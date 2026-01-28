// src/donation/donation.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { DonationService } from './donation.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PayloadDto } from '../auth/dto/auth.dto';
import { currentUser } from '../auth/decorator/current.user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('donations')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  /* =============== CRUD & LIST =============== */

  @Get()
  async findAll(
    @Query('skip') skip?: string,
    @Query('limit') limit?: string,
  ) {
    const s = Number(skip) || 0;
    const l = Number(limit) || 10;
    return this.donationService.findAll(s, l);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.donationService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateDonationDto) {
    return this.donationService.createDonation(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDonationDto,
  ) {
    return this.donationService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.donationService.remove(id);
  }

  /* =============== Search & Simulation =============== */

  @Get('search')
  async search(
    @Query('q') q?: string,
    @Query('skip') skip?: string,
    @Query('limit') limit?: string,
  ) {
    if (!q || q.trim() === '') {
      throw new BadRequestException('Query parameter "q" is required');
    }
    const s = Number(skip) || 0;
    const l = Number(limit) || 10;
    return this.donationService.search(q, s, l);
  }

  @Post('simulate-payment')
  async simulatePayment(@Body() dto: CreateDonationDto) {
    return this.donationService.simulatePayment(dto);
  }

  /* =============== Donation-specific queries =============== */

  @Get('allthing/GetAllThingForReborts')
  async findAllThingForReborts(
   
  ) {
    return this.donationService.findAllThingForReborts();
  }
  @Get('student/:studentId')
  async getDonationsByStudent(
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.donationService.getDonationsByStudent(studentId);
  }

  @Get('donor/:donorId')
  async getDonationsByDonor(
    @Param('donorId', ParseIntPipe) donorId: number,
  ) {
    return this.donationService.getDonationsByDonor(donorId);
  }

  @Get(':id/details')
  async getDonationDetails(@Param('id', ParseIntPipe) id: number) {
    return this.donationService.getDonationDetails(id);
  }

  /* =============== Expenses =============== */

  @Post('expenses')
  async createExpense(
    @Body() dto: CreateExpenseDto,
    @currentUser() user: PayloadDto,
  ) {
    return this.donationService.createExpense(dto, user);
  }

  @Get('expenses/GetAllexpenses')
  async getExpensesall(
  ) {
    return this.donationService.getExpensesall();
  }
  @Get('expenses/student/:studentId')
  async getExpensesByStudent(
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.donationService.getExpensesByStudent(studentId);
  }

  /* =============== Reports =============== */

  @Get('reports/financial')
  async financialReport() {
    return this.donationService.financialReport();
  }

  @Get('reports/monthly')
  async monthlyFinancialReport(
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    const y = Number(year);
    const m = Number(month);
    if (!y || !m) {
      throw new BadRequestException('Query parameters "year" and "month" are required (numbers).');
    }
    return this.donationService.monthlyFinancialReport(y, m);
  }

  @Get('reports/by-student')
  async donationsByStudent() {
    return this.donationService.donationsByStudent();
  }

  @Get('reports/by-student/:studentId')
  async donationsByStudentId(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.donationService.donationsByStudentId(studentId);
  }
  @Get('getCardDataInDoner/ForTheDonerDashboard')
  async getCardDataInDoner() {
    return this.donationService.getCardDataInDoner();
  }
}
