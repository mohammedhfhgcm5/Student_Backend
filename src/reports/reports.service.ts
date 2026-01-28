import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { ReportFilterDto } from "./dto/report-filter.dto";
import { StudentStatus } from "@prisma/client";
import * as ExcelJS from "exceljs";
import type { Response } from 'express';

import {  Res } from "@nestjs/common";
import PDFDocument from "pdfkit";
@Injectable()
export class ReportsService {

  constructor(private prisma: PrismaService) {}


  //////

 async exportStudentsToPDF(@Res() res: Response) {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=students-report.pdf");

    doc.pipe(res);

    // 🧾 العنوان
    doc.fontSize(18).text("Students Report", { align: "center" }).moveDown();

    // 🧑‍🎓 البيانات (افترض بيانات من Prisma)
    const students = [
      { id: 1, name: "Ali Ahmad", status: "DROPOUT" },
      { id: 2, name: "Sara Ali", status: "RETURNED" },
    ];

    students.forEach((s) => {
      doc.fontSize(12).text(`ID: ${s.id} | Name: ${s.name} | Status: ${s.status}`);
    });

    doc.end();
  }


  /////
   async exportStudentsToExcel(@Res() res: Response) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Students Report");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Full Name", key: "full_name", width: 30 },
      { header: "Status", key: "status", width: 15 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "School ID", key: "school_id", width: 10 },
    ];

    // 🔹 بيانات تجريبية — لاحقًا تستبدلها ببيانات من Prisma
    const students = [
      { id: 1, full_name: "Ali Ahmad", status: "DROPOUT", gender: "M", school_id: 12 },
      { id: 2, full_name: "Sara Ali", status: "RETURNED", gender: "F", school_id: 10 },
    ];

    worksheet.addRows(students);

    // إعداد الرد
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", "attachment; filename=students-report.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  }

  // 🧾 1. تقرير الطلاب العام
  async studentsReport(filters?: ReportFilterDto) {
    const [total, dropout, returned, active, atRisk] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.student.count({ where: { status: StudentStatus.DROPOUT } }),
      this.prisma.student.count({ where: { status: StudentStatus.RETURNED } }),
      this.prisma.student.count({ where: { status: StudentStatus.ACTIVE } }),
      this.prisma.student.count({ where: { status: StudentStatus.AT_RISK } }),
    ]);

    const byGender = await this.prisma.student.groupBy({
      by: ["gender"],
      _count: { _all: true },
    });

    const bySchool = await this.prisma.student.groupBy({
      by: ["schoolId"],
      _count: { _all: true },
    });

    return {
      total,
      dropout,
      returned,
      active,
      atRisk,
      byGender,
      bySchool,
    };
  }

  // 💰 2. تقرير أثر التبرعات
  async donationImpactReport() {
    const [totalDonations, usedDonations, unallocated, donors] = await Promise.all([
      this.prisma.donation.aggregate({ _sum: { amount: true } }),
      this.prisma.donation.count({ where: { status: "USED" } }),
      this.prisma.donation.count({ where: { studentId: null } }),
      this.prisma.donor.count(),
    ]);

    return {
      totalAmount: totalDonations._sum.amount || 0,
      usedDonations,
      unallocatedDonations: unallocated,
      totalDonors: donors,
    };
  }

  // 📉 3. تقرير أسباب الانقطاع
  async dropoutReasonsReport() {
    return this.prisma.student.groupBy({
      by: ["dropoutReasonId"],
      _count: { _all: true },
    });
  }

  // 🏫 4. تقرير حسب المدارس
  async schoolsReport() {
    return this.prisma.student.groupBy({
      by: ["schoolId"],
      _count: { _all: true },
    });
  }

  // 🌍 5. تقرير جغرافي حسب المناطق
  async locationReport() {
    const result = await this.prisma.location.findMany({
      include: {
        _count: {
          select: { students: true },
        },
      },
    });
    return result.map((loc) => ({
      location: loc.name,
      region: loc.region,
      students: loc._count.students,
    }));
  }

  // 📅 6. الاتجاهات الشهرية (عدد الطلاب / التبرعات)
  async monthlyTrends(year: number) {
    const donations = await this.prisma.$queryRawUnsafe<{
      month: number;
      total: number;
    }[]>(`
      SELECT EXTRACT(MONTH FROM "donation_date") AS month, SUM(amount) AS total
      FROM "Donation"
      WHERE EXTRACT(YEAR FROM "donation_date") = ${year}
      GROUP BY month
      ORDER BY month;
    `);

    const students = await this.prisma.$queryRawUnsafe<{
      month: number;
      total: number;
    }[]>(`
      SELECT EXTRACT(MONTH FROM "created_at") AS month, COUNT(*) AS total
      FROM "Student"
      WHERE EXTRACT(YEAR FROM "created_at") = ${year}
      GROUP BY month
      ORDER BY month;
    `);

    return { donations, students };
  }

  // ⚙️ 7. تقرير مخصص حسب الفلاتر
  async customReport(filters: ReportFilterDto) {
    const where: any = {};

    if (filters.region) where.region = filters.region;
    if (filters.schoolId) where.school_id = +filters.schoolId;

    const students = await this.prisma.student.findMany({
      where,
      include: {
        school: true,
        location: true,
        dropoutReason: true,
      },
    });

    return {
      total: students.length,
      data: students,
    };
  }
}
