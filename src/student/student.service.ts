// ../student/student.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { Gender, StudentStatus } from "@prisma/client";
import { ActivityLogService } from "../activity-log/activity-log.service";
import { PayloadDto } from "../auth/dto/auth.dto";

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService,
         private activityLogService: ActivityLogService,
    
  ) {}

async create(dto: CreateStudentDto, user: PayloadDto) {
  try {
    const student = await this.prisma.student.create({
      data: {
        fullName: dto.fullName,
        nationalNumber: dto.nationalNumber,
        gender: dto.gender,
        status: dto.status,
        mainLanguage: dto.mainLanguage,
        acquiredLanguage: dto.acquiredLanguage ?? null,
        dateOfBirth: new Date(dto.dateOfBirth), // ✅ convert string → Date
        guardianId: dto.guardianId, // ✅ required relation
        schoolId: dto.schoolId ?? null,
        locationId: dto.locationId ?? null,
        dropoutReasonId: dto.dropoutReasonId ?? null,
      },
      include: {
        guardian: true, // optional, but nice for frontend
      },
    });

    // Optional: log the action (recommended for audit)
    await this.prisma.activityLog.create({
      data: {
        userId: user.id!,
        action: "CREATE_STUDENT",
        description: `Student "${student.fullName}" created by ${user.email}`,
      },
    });

    console.log(student);
    

    return student;
  } catch (error) {
    console.error("❌ Error creating student:", error);
    console.log(error);
    console.log("dto", dto, "\n \n user",user);
    
    
    throw new Error("Failed to create student. Please check your data.");
  }
}

async findAll(skip = 0, limit = 50) {
  return this.prisma.student.findMany({
    include: {
      guardian: true,
      school: true,
      location: true,
      dropoutReason: true,
      donations: true,
      followUpVisits: true,
      documents: true,
      classification: true, // ✅ مهم حتى ترى totalScore
    },
    orderBy: [
      { classification: { totalScore: "desc" } }, // ✅ ترتيب حسب score
      { createdAt: "desc" }, // احتياطي لو scores متساوية
    ],
    skip,
    take: limit,
  });
}

  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        guardian: true,
        school: true,
        location: true,
        dropoutReason: true,
        donations: true,
        followUpVisits: true,
        documents: true,
        classification: true,
      },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async update(id: number, dto: UpdateStudentDto, user:PayloadDto ) {
    const update = this.prisma.student.update({
      where: { id },
      data: dto,
    });


     await this.activityLogService.create({
        userId: user.id,
        action: 'Update Student',
        description: `User ${user.fullName} his email ${user.email}  Update student  id ${id}`,
      } as any); 

      return update;

  }

  async remove(id: number ,user:PayloadDto) {
    const Delete  =  this.prisma.student.delete({ where: { id } });


     await this.activityLogService.create({
        userId: user.id,
        action: 'Delete Student',
        description: `User ${user.fullName} his email ${user.email}  Delete student id ${id}`,
      } as any); 

      return Delete;

  }

  async search(query: string, skip = 0, limit = 20) {
    return this.prisma.student.findMany({
      where: {
        OR: [
          { fullName: { contains: query, mode: "insensitive" } },
          { nationalNumber: { contains: query ,mode: "insensitive"} },
          { mainLanguage: { contains: query, mode: "insensitive" } },
          { acquiredLanguage: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        guardian: true,
        school: true,
        location: true,
        dropoutReason: true,
        donations: true,
        followUpVisits: true,
        documents: true,
      },
      skip,
      take: limit,
    });
  }


  // 1. Students by Guardian
  async findByGuardianId(guardianId: number) {
    return this.prisma.student.findMany({
      where: { guardianId },
      include: { guardian: true, school: true, location: true, dropoutReason: true },
    });
  }

  // 2. Students by School
  async findBySchoolId(schoolId: number) {
    return this.prisma.student.findMany({
      where: { schoolId },
      include: { guardian: true, school: true, location: true, dropoutReason: true },
    });
  }

  // 3. Students by Location
  async findByLocationId(locationId: number) {
    return this.prisma.student.findMany({
      where: { locationId },
      include: { guardian: true, school: true, location: true, dropoutReason: true },
    });
  }

  // 4. Students by DropoutReason
  async findByDropoutReasonId(dropoutReasonId: number) {
    return this.prisma.student.findMany({
      where: { dropoutReasonId },
      include: { guardian: true, school: true, location: true, dropoutReason: true },
    });
  }

  // 5. Count all students
  async countAll() {
    return this.prisma.student.count();
  }

  // 6. Count by status
  async countByStatus(status: StudentStatus) {
    return this.prisma.student.count({ where: { status } });
  }

  // 7. Recent enrollments
  async getRecentEnrollments(limit: number) {
    return this.prisma.student.findMany({
      orderBy: { id: "desc" },
      take: limit,
      include: { guardian: true, school: true, location: true, dropoutReason: true },
    });
  }

  // 8. Follow-up visits of a student
  async getFollowUpVisits(studentId: number) {
    return this.prisma.followUpVisit.findMany({
      where: { studentId },
      include: { student: true },
    });
  }

  // 9. Donations of a student
  async getDonations(studentId: number) {
    return this.prisma.donation.findMany({
      where: { studentId },
      include: { donor: true, purpose: true, student: true },
    });
  }

  // 10. Documents of a student
  async getDocuments(studentId: number) {
    return this.prisma.document.findMany({
      where: { studentId },
      include: { student: true },
    });
  }




  // دوال مساعدة لكل حالة
  async countActive() {
    return this.countByStatus(StudentStatus.ACTIVE);
  }

  async countDropout() {
    return this.countByStatus(StudentStatus.DROPOUT);
  }

  
  async countTransferred() {
    return this.countByStatus(StudentStatus.RETURNED);
  }



   // عدد الذكور والإناث
  async countByGender() {
    const maleCount = await this.prisma.student.count({ where: { gender: Gender.MALE } });
    const femaleCount = await this.prisma.student.count({ where: { gender: Gender.FEMALE } });
    const total = maleCount + femaleCount;

    return {
      male: maleCount,
      female: femaleCount,
      malePercentage: total ? +(maleCount / total * 100).toFixed(2) : 0,
      femalePercentage: total ? +(femaleCount / total * 100).toFixed(2) : 0,
    };
  }


  // التوزيع العمري
  async ageDistribution() {
    const students = await this.prisma.student.findMany({
      select: { dateOfBirth: true },
    });

    const now = new Date();

    const distribution = {
      under10: 0,
      from10to14: 0,
      from15to19: 0,
      over20: 0,
    };

    for (const s of students) {
      const birth = new Date(s.dateOfBirth);
      let age = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
        age--;
      }

      if (age < 10) distribution.under10++;
      else if (age <= 14) distribution.from10to14++;
      else if (age <= 19) distribution.from15to19++;
      else distribution.over20++;
    }

    return distribution;
  }

async impactReport() {
  const totalStudents = await this.countAll();
  const active = await this.countActive();
  const dropout = await this.countDropout();
  const transferred = await this.countTransferred();
  const genderDist = await this.countByGender();
  const ageDist = await this.ageDistribution();
  const returnRate = await this.returnRate();
  const totalDonations = await this.prisma.donation.aggregate({
    _sum: { amount: true },
  });

  return {
    totalStudents,
    active,
    dropout,
  
    transferred,
    genderDist,
    ageDist,
    returnRate,
    totalDonations: totalDonations._sum.amount || 0,
  };
}


   // معدل العودة
  async returnRate() {
    
    const totalDropout = await this.prisma.student.count({
      where: { status: StudentStatus.DROPOUT },
    });

    const returnedActive = await this.prisma.student.count({
      where: { status: StudentStatus.ACTIVE },
    });

    // تقديري: نسبة العودة = الذين أصبحوا ACTIVE ÷ مجموع المنقطعين + الذين عادوا
    const rate = totalDropout + returnedActive > 0 
      ? +(returnedActive / (totalDropout + returnedActive) * 100).toFixed(2)
      : 0;

    return {
      totalDropout,
      returnedActive,
      returnRatePercentage: rate,
    };
  }


  async monthlyReport(year: number, month: number) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  // الطلاب الجدد هذا الشهر
  const newStudents = await this.prisma.student.count({
    where: {
      createdAt: { gte: start, lt: end },
    },
  });

  // الطلاب الذين أصبحوا DROPOUT خلال الشهر
  const dropouts = await this.prisma.student.count({
    where: {
      status: StudentStatus.DROPOUT,
      updatedAt: { gte: start, lt: end }, // تم تغيير حالتهم خلال الشهر
    },
  });
  const ACTIVE = await this.prisma.student.count({
    where: {
      status: StudentStatus.ACTIVE,
      updatedAt: { gte: start, lt: end }, // تم تغيير حالتهم خلال الشهر
    },
  });

  // الطلاب الذين أصبحوا GRADUATED خلال الشهر
  const graduated = await this.prisma.student.count({
    where: {
      status: StudentStatus.RETURNED,
      updatedAt: { gte: start, lt: end },
    },
  });

  // زيارات المتابعة خلال الشهر
  const followUpVisits = await this.prisma.followUpVisit.count({
    where: { createdAt: { gte: start, lt: end } },
  });

  // التبرعات خلال الشهر
  const donations = await this.prisma.donation.count({
    where: { createdAt: { gte: start, lt: end } },
  });

  return {
    newStudents,
    dropouts,
    graduated,
    ACTIVE,
    followUpVisits,
    donations,
  };
}


// تقرير جغرافي حسب الموقع
  async geographicReport() {
    // جلب كل المواقع مع عدد الطلاب حسب الحالة
    const locations = await this.prisma.location.findMany({
      include: {
        students: true,
      },
    });

    const report = locations.map((loc) => {
      const total = loc.students.length;
      const active = loc.students.filter(s => s.status === StudentStatus.ACTIVE).length;
      const dropout = loc.students.filter(s => s.status === StudentStatus.DROPOUT).length;
      const AT_RISK = loc.students.filter(s => s.status === StudentStatus.AT_RISK).length;
      const RETURNED = loc.students.filter(s => s.status === StudentStatus.RETURNED).length;

      return {
        locationId: loc.id,
        locationName: loc.name,
        region: loc.region,
        totalStudents: total,
        active,
        dropout,
        AT_RISK,
        RETURNED,
      };
    });

    return report;
  }

   // تقرير أسباب الانقطاع
  async dropoutReasonReport() {
    const reasons = await this.prisma.dropoutReason.findMany({
      include: {
        students: true,
      },
    });

    const totalDropouts = reasons.reduce(
      (sum, r) => sum + r.students.filter(s => s.status === StudentStatus.DROPOUT).length,
      0,
    );

    const report = reasons.map(r => {
      const count = r.students.filter(s => s.status === StudentStatus.DROPOUT).length;
      const percentage = totalDropouts ? +(count / totalDropouts * 100).toFixed(2) : 0;

      return {
        reasonId: r.id,
        reasonName: r.category,
       
        dropoutCount: count,
        percentage,
      };
    });

    return report;
  }


  
  // التقرير المالي الكلي
  async financialReport() {
    // إجمالي التبرعات وعددها
    const totalDonations = await this.prisma.donation.aggregate({
      _sum: { amount: true },
      _count: { id: true },
    });

    // التبرعات حسب الهدف (DonationPurpose)
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

  // التقرير المالي الشهري
  async monthlyFinancialReport(year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const monthlyDonations = await this.prisma.donation.findMany({
      where: { createdAt: { gte: start, lt: end } },
    });

    const totalAmount = monthlyDonations.reduce((sum, d) => sum + d.amount, 0);

    return {
      month,
      year,
      totalDonations: monthlyDonations.length,
      totalAmount,
    };
  }

}

