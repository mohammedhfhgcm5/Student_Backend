// src/donation/donation.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';

import { Donation, DonationStatus, Prisma, PrismaClient } from '@prisma/client';
import { NotificationsService } from 'src/notification/notification.service';
import { PayloadDto } from 'src/auth/dto/auth.dto';


interface AllocationInput {
  donationId: number;
  amount: number;
}

interface AllocationResult {
  success: boolean;
  message?: string;
  allocations?: AllocationInput[];
}

@Injectable()
export class DonationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationsService
  ) {}

  /* =============== BASIC CRUD OPERATIONS =============== */

  async findAll(skip = 0, limit = 10) {
    return this.prisma.donation.findMany({
      include: { 
        student: true, 
        donor: true, 
        purpose: true,
        allocations: {
          include: {
            expense: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
  }
  async findAllThingForReborts(skip = 0, limit = 10) {

    let allamount=0;
    let allRemainingAmount=0;
    let expenseamount=0;


    const donations= await this.prisma.donation.findMany({
    });
    const expenses= await this.prisma.expense.findMany({
    });


     for (const donation of donations) {
      allamount+=donation.amount;
      allRemainingAmount+=donation.remainingAmount
   
  }
     for (const expense of expenses) {
      expenseamount+=expense.amount
  }

  return{
    allamount:allamount,
    allRemainingAmount:allRemainingAmount,
    expenseamount:expenseamount
  }


  }

  async findOne(id: number) {
    const donation = await this.prisma.donation.findUnique({
      where: { id },
      include: { 
        student: true, 
        donor: true, 
        purpose: true,
        allocations: {
          include: {
            expense: true,
          },
        },
      },
    });
    if (!donation) {
      throw new NotFoundException(`Donation with ID ${id} not found`);
    }
    return donation;
  }

  async update(id: number, dto: UpdateDonationDto) {
    await this.findOne(id); // Check if donation exists
    return this.prisma.donation.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if donation exists
    return this.prisma.donation.delete({ where: { id } });
  }

  async search(query: string, skip = 0, limit = 10) {
    return this.prisma.donation.findMany({
      where: {
        OR: [
          { student: { fullName: { contains: query, mode: 'insensitive' } } },
          { donor: { name: { contains: query, mode: 'insensitive' } } },
          { purpose: { name: { contains: query, mode: 'insensitive' } } },
          { transactionReference: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { 
        student: true, 
        donor: true, 
        purpose: true,
        allocations: {
          include: {
            expense: true,
          },
        },
      },
      skip,
      take: limit,
    });
  }

  /* =============== DONATION CREATION & PAYMENT =============== */

  async createDonation(dto: CreateDonationDto) {
    return this.prisma.donation.create({
      data: {
        donorId: dto.donorId,
        studentId: dto.studentId,
        purposeId: dto.purposeId,
        amount: dto.amount,
        remainingAmount:dto.amount,
        currency: dto.currency ?? 'SYP',
        status: dto.status ?? 'CONFIRMED',
        paymentMethod: dto.paymentMethod,
        transactionReference: dto.transactionReference,
      },
      include: {
        donor: true,
        student: true,
        purpose: true,
        allocations: {
          include: {
            expense: true,
          },
        },
      },
    });
  }

  async simulatePayment(dto: CreateDonationDto) {
    // 1️⃣ Create donation record (Pending)
    const donation = await this.prisma.donation.create({
      data: {
        donorId: dto.donorId,
        studentId: dto.studentId,
        purposeId: dto.purposeId,
        amount: dto.amount,
        remainingAmount:dto.amount, 
        currency: dto.currency || 'SYP',
        status: DonationStatus.PENDING,
        paymentMethod: 'Simulated Card',
        transactionReference: `SIM-TXN-${Date.now()}`,
      },
      include: {
        donor: true,
        student: true,
        purpose: true,
      },
    });

    console.log(`💰 New simulated payment started: ${donation.transactionReference}`);

    // 2️⃣ After 3 seconds: change status to CONFIRMED
    setTimeout(async () => {
      await this.prisma.donation.update({
        where: { id: donation.id },
        data: { status: DonationStatus.CONFIRMED },
      });

      console.log(`✅ Donation #${donation.id} confirmed automatically.`);

      // 3️⃣ Send notification to donor
      await this.notificationService.create({
        donorId: donation.donorId,
        title: 'Donation Confirmed',
        message: `Your donation of ${donation.amount} ${donation.currency} has been confirmed.`,
        type: 'DONOR_ALERT'
      });
    }, 3000);

    return {
      message: 'Payment simulated successfully',
      donation,
    };
  }

  /* =============== DONATION QUERIES =============== */

  async getDonationsByStudent(studentId: number) {
    return this.prisma.donation.findMany({
      where: { studentId },
      include: {
        donor: true,
        purpose: true,
        allocations: {
          include: {
            expense: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getDonationsByDonor(donorId: number) {
    return this.prisma.donation.findMany({
      where: { donorId },
      include: {
        student: true,
        purpose: true,
        allocations: {
          include: {
            expense: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getDonationDetails(donationId: number) {
    const donation = await this.prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        donor: true,
        student: true,
        purpose: true,
        allocations: {
          include: {
            expense: true,
          },
        },
      },
    });

    if (!donation) {
      throw new NotFoundException('Donation not found');
    }

    const allocated = donation.allocations.reduce((sum, a) => sum + a.amount, 0);
    const remaining = donation.amount - allocated;

    return {
      ...donation,
      allocated,
      remaining,
    };
  }

  /* =============== EXPENSE MANAGEMENT =============== */

  async createExpense(dto: CreateExpenseDto, user: PayloadDto) {
  return this.prisma.$transaction(async (tx) => {

    // 1️⃣ جلب التبرعات المتاحة
    const donations = await this.getAvailableDonations(tx);

    // 2️⃣ توزيع تلقائي
    const allocationResult = this.autoAllocate(donations, dto.amount);

      if (!allocationResult.success) {
      return {
        success: false,
        message: allocationResult.message,
      };
    }


    // 3️⃣ إنشاء المصروف
    const expense = await tx.expense.create({
      data: {
        studentId: dto.studentId,
        schoolId: dto.schoolId,
        targetType: dto.targetType,
        purposeId: dto.purposeId,
        amount: dto.amount,
        paymentMethod:dto.paymentMethod,
        currency: dto.currency ?? 'SYP',
        description: dto.description,
        createdById: user.id!,
      },
    });

    // 4️⃣ إنشاء العلاقات + تحديث رصيد التبرعات
    for (const a of allocationResult.allocations!) {
      await tx.donationExpenseAllocation.create({
        data: {
          donationId: a.donationId,
          expenseId: expense.id,
          amount: a.amount,
        },
      });

      await tx.donation.update({
        where: { id: a.donationId },
        data: {
          remainingAmount: {
            decrement: a.amount,
          },
        },
      });
    }

    // 5️⃣ إرجاع النتيجة كاملة
     return {
      success: true,
      data: await tx.expense.findUnique({
        where: { id: expense.id },
        include: {
          allocations: { include: { donation: true } },
          student: true,
          purpose: true,
          createdBy: true,
        },
      }),
    };
  });
}


private autoAllocate(
  donations: Donation[],
  expenseAmount: number,
):AllocationResult {
  const allocations :AllocationInput[] = [];
  let remaining = expenseAmount;

  for (const donation of donations) {
    if (remaining <= 0) break;

    const usedAmount = Math.min(donation.remainingAmount, remaining);

    allocations.push({
      donationId: donation.id,
      amount: usedAmount,
    });

    remaining -= usedAmount;
  }

   if (remaining > 0) {
    return {
      success: false,
      message: 'Not enough donations balance to cover this expense',
    };
  }

  return {
    success: true,
    allocations,
  };

}

  private async getAvailableDonations( tx: Prisma.TransactionClient,) {
  return tx.donation.findMany({
    where: {
      remainingAmount: { gt: 0 },
    },
    orderBy: {
      createdAt: 'asc', // FIFO
    },
  });
}

  async getExpensesall() {
    return this.prisma.expense.findMany({
     
      include: {
        allocations: {
          include: {
            donation: {
              include: { donor: true },
            },
          },
        },
        purpose: true,
        createdBy: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }
  async getExpensesByStudent(studentId: number) {
    return this.prisma.expense.findMany({
      where: { studentId },
      include: {
        allocations: {
          include: {
            donation: {
              include: { donor: true },
            },
          },
        },
        purpose: true,
        createdBy: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /* =============== FINANCIAL REPORTS =============== */

  async financialReport() {
    // Total donations and count
    const totalDonations = await this.prisma.donation.aggregate({
      _sum: { amount: true },
      _count: { id: true },
    });

    // Donations by purpose
    const byPurpose = await this.prisma.donationPurpose.findMany({
      include: {
        donations: true,
      },
    });

    const purposesReport = byPurpose.map(p => {
      const total = p.donations.reduce((sum, d) => sum + d.amount, 0);
      return {
        purposeId: p.id,
        purposeName: p.name,
        totalAmount: total,
        donationsCount: p.donations.length,
      };
    });

    return {
      totalAmount: totalDonations._sum.amount || 0,
      totalDonations: totalDonations._count.id,
      purposes: purposesReport,
    };
  }

  async monthlyFinancialReport(year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const monthlyDonations = await this.prisma.donation.findMany({
      where: { 
        createdAt: { gte: start, lt: end },
        status: DonationStatus.CONFIRMED // Only count confirmed donations
      },
    });

    const totalAmount = monthlyDonations.reduce((sum, d) => sum + d.amount, 0);

    return {
      month,
      year,
      totalDonations: monthlyDonations.length,
      totalAmount,
    };
  }

  async donationsByStudent() {
    const students = await this.prisma.student.findMany({
      include: {
        donations: {
          where: {
            status: DonationStatus.CONFIRMED // Only confirmed donations
          }
        },
      },
    });

    const report = students.map(student => {
      const totalAmount = student.donations.reduce((sum, d) => sum + d.amount, 0);
      const donationsCount = student.donations.length;

      return {
        studentId: student.id,
        studentName: student.fullName,
        donationsCount,
        totalAmount,
      };
    });

    return report;
  }

  async donationsByStudentId(studentId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { 
        donations: {
          where: {
            status: DonationStatus.CONFIRMED
          }
        },
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const totalAmount = student.donations.reduce((sum, d) => sum + d.amount, 0);
    const donationsCount = student.donations.length;

    return {
      studentId: student.id,
      studentName: student.fullName,
      donationsCount,
      totalAmount,
      donations: student.donations,
    };
  }

  /* =============== PRIVATE HELPER METHODS =============== */

   async getCardDataInDoner(
    
  ) {
    const donation = await this.prisma.donation.count();
    const ActiveDoner = await this.prisma.donor.count({
      where :{verified : true}
    });
     const donationPurpose = await this.prisma.donationPurpose.count();


     return{
      donation:donation,
      ActiveDoner:ActiveDoner,
      donationPurpose:donationPurpose
     }
    
  }
}