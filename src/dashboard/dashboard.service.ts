import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { StudentStatus, DonationStatus, Role } from "@prisma/client";

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  // 🔹 نظرة عامة عامة (Overview)
  async getOverview(userId:number) {
    const [
      studentsCount,
      activeStudents,
      dropoutStudents,
      atRiskStudents,
      returnedStudents,
      usersCount,
      fieldTeamsCount,
      ngoStaffCount,
      donationsCount,
      pendingDonations,
      confirmedDonations,
      visitsCount,
      recentNotifications,
    ] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.student.count({ where: { status: StudentStatus.ACTIVE } }),
      this.prisma.student.count({ where: { status: StudentStatus.DROPOUT } }),
      this.prisma.student.count({ where: { status: StudentStatus.AT_RISK } }),
      this.prisma.student.count({ where: { status: StudentStatus.RETURNED } }),

      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: Role.FIELD_TEAM } }),
      this.prisma.user.count({ where: { role: Role.NGO_STAFF } }),

      this.prisma.donation.count(),
      this.prisma.donation.count({ where: { status: DonationStatus.PENDING } }),
      this.prisma.donation.count({ where: { status: DonationStatus.CONFIRMED } }),

      this.prisma.followUpVisit.count(),

      this.prisma.notification.findMany({
        where:{userId},
        orderBy: { created_at: "desc" },
        take: 5,
        select: { id: true, title: true, message: true, created_at: true },
      }),
    ]);

    return {
      studentsCount,
      activeStudents,
      dropoutStudents,
      atRiskStudents,
      returnedStudents,
      usersCount,
      fieldTeamsCount,
      ngoStaffCount,
      donationsCount,
      pendingDonations,
      confirmedDonations,
      visitsCount,
      recentNotifications,
    };
  }

  // 🔹 الاتجاهات الشهرية (Trends)
  async getTrends() {
    const donations = await this.prisma.$queryRawUnsafe<
      { month: number; total: number }[]
    >(`
      SELECT EXTRACT(MONTH FROM "donation_date") AS month, SUM(amount) AS total
      FROM "Donation"
      WHERE EXTRACT(YEAR FROM "donation_date") = EXTRACT(YEAR FROM CURRENT_DATE)
      GROUP BY month
      ORDER BY month;
    `);

    const students = await this.prisma.$queryRawUnsafe<
      { month: number; total: number }[]
    >(`
      SELECT EXTRACT(MONTH FROM "created_at") AS month, COUNT(*) AS total
      FROM "Student"
      WHERE EXTRACT(YEAR FROM "created_at") = EXTRACT(YEAR FROM CURRENT_DATE)
      GROUP BY month
      ORDER BY month;
    `);

    return { donations, students };
  }

  // 🔹 التنبيهات (Alerts)
  async getAlerts() {
    const [criticalCases, delayedVisits, unallocatedDonations] = await Promise.all([
      this.prisma.student.count({ where: { status: StudentStatus.AT_RISK } }),
      this.prisma.followUpVisit.count({
        where: {
          visitDate: {
            lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // أكثر من 30 يوم
          },
        },
      }),
      this.prisma.donation.count({ where: { studentId: null } }),
    ]);

    return { criticalCases, delayedVisits, unallocatedDonations };
  }
}
