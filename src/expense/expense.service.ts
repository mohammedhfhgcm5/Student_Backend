import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto, ExpenseDto } from './dto/expense.dto';
import { CreateAllocationDto, AllocationDto, ExpenseCoverageDto, AllocationSummaryDto } from './dto/allocation.dto';
import { ExpenseTargetType } from '@prisma/client';
import { ExpenseReportDto } from './dto/report.dto';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async createExpense(userId: number, createExpenseDto: CreateExpenseDto): Promise<ExpenseDto> {
    // Validate target type consistency
    this.validateExpenseTarget(createExpenseDto);

    // Check if purpose exists
    const purpose = await this.prisma.donationPurpose.findUnique({
      where: { id: createExpenseDto.purposeId }
    });

    if (!purpose) {
      throw new NotFoundException('Donation purpose not found');
    }

    // Create expense
    const expense = await this.prisma.expense.create({
      data: {
        ...createExpenseDto,
        createdById: userId,
      },
      include: {
        student: true,
        purpose: true,
        createdBy: true,
        allocations: {
          include: {
            donation: true,
          }
        }
      }
    });

    return this.mapToExpenseDto(expense);
  }

  async getExpenseById(id: number): Promise<ExpenseDto> {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: {
        student: true,
        purpose: true,
        createdBy: true,
        allocations: {
          include: {
            donation: true,
          }
        }
      }
    });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return this.mapToExpenseDto(expense);
  }

  async getAllExpenses(
    page: number = 1,
    limit: number = 10,
    filters?: {
      targetType?: ExpenseTargetType;
      purposeId?: number;
      studentId?: number;
      schoolId?: number;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<{ data: ExpenseDto[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (filters) {
      if (filters.targetType) where.targetType = filters.targetType;
      if (filters.purposeId) where.purposeId = filters.purposeId;
      if (filters.studentId) where.studentId = filters.studentId;
      if (filters.schoolId) where.schoolId = filters.schoolId;
      
      if (filters.startDate || filters.endDate) {
        where.createdAt = {};
        if (filters.startDate) where.createdAt.gte = filters.startDate;
        if (filters.endDate) where.createdAt.lte = filters.endDate;
      }
    }

    const [expenses, total] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        skip,
        take: limit,
        include: {
          student: true,
          purpose: true,
          createdBy: true,
          allocations: {
            include: {
              donation: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.expense.count({ where })
    ]);

    return {
      data: expenses.map(expense => this.mapToExpenseDto(expense)),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async updateExpense(id: number, updateExpenseDto: UpdateExpenseDto): Promise<ExpenseDto> {
    // Check if expense exists
    const existingExpense = await this.prisma.expense.findUnique({
      where: { id },
      include: { allocations: true }
    });

    if (!existingExpense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    // If updating amount, check if it's less than allocated amount
    if (updateExpenseDto.amount !== undefined) {
      const allocatedAmount = existingExpense.allocations.reduce(
        (sum, allocation) => sum + allocation.amount, 0
      );
      
      if (updateExpenseDto.amount < allocatedAmount) {
        throw new BadRequestException(
          `New amount (${updateExpenseDto.amount}) cannot be less than already allocated amount (${allocatedAmount})`
        );
      }
    }

    const updatedExpense = await this.prisma.expense.update({
      where: { id },
      data: updateExpenseDto,
      include: {
        student: true,
        purpose: true,
        createdBy: true,
        allocations: {
          include: {
            donation: true,
          }
        }
      }
    });

    return this.mapToExpenseDto(updatedExpense);
  }

  async deleteExpense(id: number): Promise<void> {
    // Check if expense exists
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: { allocations: true }
    });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    // Check if there are allocations
    if (expense.allocations.length > 0) {
      throw new ConflictException(
        `Cannot delete expense with ID ${id} because it has allocations. Remove allocations first.`
      );
    }

    await this.prisma.expense.delete({
      where: { id }
    });
  }

  async getExpenseCoverage(expenseId: number): Promise<ExpenseCoverageDto> {
    const expense = await this.prisma.expense.findUnique({
      where: { id: expenseId },
      include: {
        allocations: {
          include: {
            donation: true,
          }
        }
      }
    });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${expenseId} not found`);
    }

    const coveredAmount = expense.allocations.reduce(
      (sum, allocation) => sum + allocation.amount, 0
    );

    return {
      expenseId: expense.id,
      expenseAmount: expense.amount,
      coveredAmount,
      remainingAmount: expense.amount - coveredAmount,
      percentageCovered: (coveredAmount / expense.amount) * 100,
      allocations: expense.allocations
    };
  }

  async allocateDonationToExpense(createAllocationDto: CreateAllocationDto): Promise<AllocationDto> {
    // Check if donation exists and is valid
    const donation = await this.prisma.donation.findUnique({
      where: { id: createAllocationDto.donationId },
      include: { allocations: true }
    });

    if (!donation) {
      throw new NotFoundException(`Donation with ID ${createAllocationDto.donationId} not found`);
    }

    // Check donation status (assuming you have a status field)
    if (donation.status !== 'CONFIRMED') {
      throw new BadRequestException('Only completed donations can be allocated');
    }

    // Check if expense exists
    const expense = await this.prisma.expense.findUnique({
      where: { id: createAllocationDto.expenseId },
      include: { allocations: true }
    });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${createAllocationDto.expenseId} not found`);
    }

    // Calculate remaining amounts
    const donationAllocatedAmount = donation.allocations.reduce(
      (sum, allocation) => sum + allocation.amount, 0
    );
    
    const donationRemainingAmount = donation.amount - donationAllocatedAmount;
    
    const expenseAllocatedAmount = expense.allocations.reduce(
      (sum, allocation) => sum + allocation.amount, 0
    );
    
    const expenseRemainingAmount = expense.amount - expenseAllocatedAmount;

    // Validate allocation amount
    if (createAllocationDto.amount > donationRemainingAmount) {
      throw new BadRequestException(
        `Allocation amount (${createAllocationDto.amount}) exceeds donation remaining amount (${donationRemainingAmount})`
      );
    }

    if (createAllocationDto.amount > expenseRemainingAmount) {
      throw new BadRequestException(
        `Allocation amount (${createAllocationDto.amount}) exceeds expense remaining amount (${expenseRemainingAmount})`
      );
    }

    // Check if allocation already exists
    const existingAllocation = await this.prisma.donationExpenseAllocation.findUnique({
      where: {
        donationId_expenseId: {
          donationId: createAllocationDto.donationId,
          expenseId: createAllocationDto.expenseId
        }
      }
    });

    if (existingAllocation) {
      throw new ConflictException('Allocation already exists for this donation and expense');
    }

    // Create allocation
    const allocation = await this.prisma.donationExpenseAllocation.create({
      data: createAllocationDto,
      include: {
        donation: true,
        expense: true
      }
    });

    return allocation;
  }

  async removeAllocation(allocationId: number): Promise<void> {
    const allocation = await this.prisma.donationExpenseAllocation.findUnique({
      where: { id: allocationId }
    });

    if (!allocation) {
      throw new NotFoundException(`Allocation with ID ${allocationId} not found`);
    }

    await this.prisma.donationExpenseAllocation.delete({
      where: { id: allocationId }
    });
  }

  async getDonationAllocations(donationId: number): Promise<AllocationSummaryDto> {
    const donation = await this.prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        allocations: {
          include: {
            expense: true
          }
        }
      }
    });

    if (!donation) {
      throw new NotFoundException(`Donation with ID ${donationId} not found`);
    }

    const allocatedAmount = donation.allocations.reduce(
      (sum, allocation) => sum + allocation.amount, 0
    );

    return {
      donationId: donation.id,
      donationAmount: donation.amount,
      allocatedAmount,
      remainingAmount: donation.amount - allocatedAmount,
      allocations: donation.allocations
    };
  }

  async getFinancialReport(): Promise<ExpenseReportDto> {
    // Get all donations
    const donations = await this.prisma.donation.findMany({
      where: { status: 'CONFIRMED' },
      include: { allocations: true }
    });

    // Get all expenses
    const expenses = await this.prisma.expense.findMany({
      include: { allocations: true }
    });

    // Calculate totals
    const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const totalAllocated = donations.reduce((sum, donation) => 
      sum + donation.allocations.reduce((allocSum, alloc) => allocSum + alloc.amount, 0), 0
    );

    // Group by purpose
    const purposeSummary = await this.prisma.donationPurpose.findMany({
      include: {
        donations: {
          where: { status: 'CONFIRMED' },
          include: { allocations: true }
        },
        Expense: {
          include: { allocations: true }
        }
      }
    }).then(purposes => purposes.map(purpose => ({
      purposeId: purpose.id,
      purposeName: purpose.name,
      totalDonations: purpose.donations.reduce((sum, d) => sum + d.amount, 0),
      totalExpenses: purpose.Expense.reduce((sum, e) => sum + e.amount, 0),
      allocatedDonations: purpose.donations.reduce((sum, d) => 
        sum + d.allocations.reduce((allocSum, alloc) => allocSum + alloc.amount, 0), 0
      ),
      allocatedExpenses: purpose.Expense.reduce((sum, e) => 
        sum + e.allocations.reduce((allocSum, alloc) => allocSum + alloc.amount, 0), 0
      )
    })));

    return {
      summary: {
        totalDonations,
        totalExpenses,
        totalAllocated,
        remainingBalance: totalDonations - totalAllocated,
        utilizationRate: totalAllocated / totalDonations * 100 || 0
      },
      purposeSummary,
      recentAllocations: await this.prisma.donationExpenseAllocation.findMany({
        take: 10,
        orderBy: { id: 'desc' },
        include: {
          donation: true,
          expense: true
        }
      })
    };
  }

  private validateExpenseTarget(expense: CreateExpenseDto): void {
    if (expense.targetType === ExpenseTargetType.STUDENT && !expense.studentId) {
      throw new BadRequestException('Student ID is required for student expenses');
    }
    
    if (expense.targetType === ExpenseTargetType.SCHOOL && !expense.schoolId) {
      throw new BadRequestException('School ID is required for school expenses');
    }
    
    if (expense.targetType === ExpenseTargetType.VENDOR && !expense.vendorId) {
      throw new BadRequestException('Vendor ID is required for vendor expenses');
    }
  }

  private mapToExpenseDto(expense: any): ExpenseDto {
    const allocatedAmount = expense.allocations?.reduce(
      (sum: number, allocation: any) => sum + allocation.amount, 0
    ) || 0;

    return {
      id: expense.id,
      studentId: expense.studentId,
      schoolId: expense.schoolId,
      vendorId: expense.vendorId,
      targetType: expense.targetType,
      purposeId: expense.purposeId,
      amount: expense.amount,
      currency: expense.currency,
      paymentMethod: expense.paymentMethod,
      description: expense.description,
      receiptUrl: expense.receiptUrl,
      createdAt: expense.createdAt,
      createdById: expense.createdById,
      student: expense.student,
      purpose: expense.purpose,
      createdBy: expense.createdBy,
      allocations: expense.allocations,
      allocatedAmount,
      remainingAmount: expense.amount - allocatedAmount,
      isFullyCovered: allocatedAmount >= expense.amount
    };
  }
}