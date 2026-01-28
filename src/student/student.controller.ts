// src/student/student.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { currentUser } from '../auth/decorator/current.user.decorator';
import { PayloadDto } from '../auth/dto/auth.dto';

@Controller('students')
  @UseGuards(JwtAuthGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  create(@Body() dto: CreateStudentDto, @currentUser() user: PayloadDto) {
    return this.studentService.create(dto, user);
  }
  
  @Get('search')
  search(
    @Query('q') query: string,
    @Query('skip', ParseIntPipe) skip = 0,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return this.studentService.search(query, skip, limit);
  }

  @Get()
  findAll(
    @Query('skip', ParseIntPipe) skip = 0,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return this.studentService.findAll(skip, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStudentDto,
    @currentUser() user: PayloadDto,
  ) {
    return this.studentService.update(id, dto, user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @currentUser() user: PayloadDto,
  ) {
    return this.studentService.remove(id, user);
  }

  @Get('by-guardian/:guardianId')
  findByGuardian(@Param('guardianId', ParseIntPipe) guardianId: number) {
    return this.studentService.findByGuardianId(guardianId);
  }

  @Get('by-school/:schoolId')
  findBySchool(@Param('schoolId', ParseIntPipe) schoolId: number) {
    return this.studentService.findBySchoolId(schoolId);
  }

  @Get('by-location/:locationId')
  findByLocation(@Param('locationId', ParseIntPipe) locationId: number) {
    return this.studentService.findByLocationId(locationId);
  }

  @Get('by-dropout-reason/:dropoutReasonId')
  findByDropoutReason(
    @Param('dropoutReasonId', ParseIntPipe) dropoutReasonId: number,
  ) {
    return this.studentService.findByDropoutReasonId(dropoutReasonId);
  }

  @Get('count/all')
  countAll() {
    return this.studentService.countAll();
  }

  @Get('count/status/:status')
  countByStatus(@Param('status') status: StudentStatus) {
    return this.studentService.countByStatus(status);
  }

  @Get('recent/:limit')
  getRecentEnrollments(@Param('limit', ParseIntPipe) limit: number) {
    return this.studentService.getRecentEnrollments(limit);
  }

  @Get(':studentId/follow-up-visits')
  getFollowUpVisits(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.studentService.getFollowUpVisits(studentId);
  }

  @Get(':studentId/donations')
  getDonations(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.studentService.getDonations(studentId);
  }

  @Get(':studentId/documents')
  getDocuments(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.studentService.getDocuments(studentId);
  }

  @Get('count/gender')
  countByGender() {
    return this.studentService.countByGender();
  }

  @Get('distribution/age')
  ageDistribution() {
    return this.studentService.ageDistribution();
  }

  @Get('report/impact')
  impactReport() {
    return this.studentService.impactReport();
  }

  @Get('report/monthly')
  monthlyReport(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.studentService.monthlyReport(year, month);
  }

  @Get('report/geographic')
  geographicReport() {
    return this.studentService.geographicReport();
  }

  @Get('report/dropout-reasons')
  dropoutReasonReport() {
    return this.studentService.dropoutReasonReport();
  }
}
