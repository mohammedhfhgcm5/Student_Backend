import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import {
  CreateExpenseDto,
  UpdateExpenseDto,
  ExpenseDto
} from './dto/expense.dto';
import {
  CreateAllocationDto,
  AllocationDto,
  AllocationSummaryDto,
  ExpenseCoverageDto
} from './dto/allocation.dto';
import { ExpenseReportDto } from './dto/report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ExpenseTargetType } from '@prisma/client';
import { currentUser } from 'src/auth/decorator/current.user.decorator';
import { PayloadDto } from 'src/auth/dto/auth.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('expenses')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @Roles("ADMIN", "MANAGER")
  async createExpense(
    @currentUser() user: PayloadDto,
    @Body() createExpenseDto: CreateExpenseDto
  ): Promise<ExpenseDto> {
    return this.expenseService.createExpense(user.id, createExpenseDto);
  }

  @Get()
  async getAllExpenses(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  @Query('targetType') targetType?: ExpenseTargetType,
  @Query('purposeId', new ParseIntPipe({ optional: true })) purposeId?: number,
  @Query('studentId', new ParseIntPipe({ optional: true })) studentId?: number,
  @Query('schoolId', new ParseIntPipe({ optional: true })) schoolId?: number,
  @Query('startDate') startDate?: string,
  @Query('endDate') endDate?: string,

  ): Promise<{ data: ExpenseDto[]; total: number; page: number; totalPages: number }> {
    // Validate date format
    let startDateObj: Date | undefined;
    let endDateObj: Date | undefined;
    
    if (startDate) {
      startDateObj = new Date(startDate);
      if (isNaN(startDateObj.getTime())) {
        throw new BadRequestException('Invalid start date format');
      }
    }
    
    if (endDate) {
      endDateObj = new Date(endDate);
      if (isNaN(endDateObj.getTime())) {
        throw new BadRequestException('Invalid end date format');
      }
    }

    return this.expenseService.getAllExpenses(page, limit, {
      targetType,
      purposeId,
      studentId,
      schoolId,
      startDate: startDateObj,
      endDate: endDateObj
    });
  }

  @Get(':id')
  async getExpenseById(@Param('id', ParseIntPipe) id: number): Promise<ExpenseDto> {
    return this.expenseService.getExpenseById(id);
  }

  @Put(':id')
  @Roles("ADMIN", "MANAGER")
  async updateExpense(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseDto: UpdateExpenseDto
  ): Promise<ExpenseDto> {
    return this.expenseService.updateExpense(id, updateExpenseDto);
  }

  @Delete(':id')
  @Roles("ADMIN")
  async deleteExpense(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.expenseService.deleteExpense(id);
  }

  @Get(':id/coverage')
  async getExpenseCoverage(@Param('id', ParseIntPipe) id: number): Promise<ExpenseCoverageDto> {
    return this.expenseService.getExpenseCoverage(id);
  }

  @Post('allocations')
  @Roles("ADMIN", "MANAGER")
  async allocateDonationToExpense(
    @Body() createAllocationDto: CreateAllocationDto
  ): Promise<AllocationDto> {
    return this.expenseService.allocateDonationToExpense(createAllocationDto);
  }

  @Delete('allocations/:id')
  @Roles("ADMIN", "MANAGER")
  async removeAllocation(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.expenseService.removeAllocation(id);
  }

  @Get('donations/:donationId/allocations')
  async getDonationAllocations(
    @Param('donationId', ParseIntPipe) donationId: number
  ): Promise<AllocationSummaryDto> {
    return this.expenseService.getDonationAllocations(donationId);
  }

  @Get('reports/financial')
  // @Roles("ADMIN", "MANAGER", "ACCOUNTANT")
  async getFinancialReport(): Promise<ExpenseReportDto> {
    return this.expenseService.getFinancialReport();
  }

  @Get('reports/by-purpose/:purposeId')
  async getExpensesByPurpose(
    @Param('purposeId', ParseIntPipe) purposeId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.expenseService.getAllExpenses(page, limit, { purposeId });
  }

  @Get('reports/by-student/:studentId')
  async getExpensesByStudent(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.expenseService.getAllExpenses(page, limit, { studentId });
  }
}