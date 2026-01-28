import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  ParseIntPipe,
  UseGuards,
  Res,
} from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ReportFilterDto } from "./dto/report-filter.dto";
import type { Response } from 'express';

@Controller("reports")
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("students")
  studentsReport() {
    return this.reportsService.studentsReport();
  }

  @Get("donations/impact")
  donationImpact() {
    return this.reportsService.donationImpactReport();
  }

  @Get("dropouts")
  dropoutReasons() {
    return this.reportsService.dropoutReasonsReport();
  }

  @Get("schools")
  schoolsReport() {
    return this.reportsService.schoolsReport();
  }

  @Get("locations")
  locationReport() {
    return this.reportsService.locationReport();
  }

  @Get("monthly")
  monthlyTrends(@Query("year", ParseIntPipe) year: number) {
    return this.reportsService.monthlyTrends(year);
  }

  @Post("custom")
  customReport(@Body() filters: ReportFilterDto) {
    return this.reportsService.customReport(filters);
  }

   @Get("export/excel")
  exportExcel(@Res() res: Response) {
    return this.reportsService.exportStudentsToExcel(res);
  }

  @Get("export/pdf")
  exportPDF(@Res() res: Response) {
    return this.reportsService.exportStudentsToPDF(res);
  }
}
