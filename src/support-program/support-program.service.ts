import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateSupportProgramDto } from "./dto/create-support-program.dto";
import { UpdateSupportProgramDto } from "./dto/update-support-program.dto";
import { AssignProgramDto } from "./dto/assign-program.dto";
import { ActivityLogService } from "../activity-log/activity-log.service";
import { PayloadDto } from "../auth/dto/auth.dto";

@Injectable()
export class SupportProgramService {
  constructor(private prisma: PrismaService,
    private activityLogService: ActivityLogService,
  ) {}

  // ✅ إنشاء برنامج دعم
  async create(dto: CreateSupportProgramDto , user: PayloadDto) {
    const create = await this.prisma.supportProgram.create({ data: dto });


    await this.activityLogService.create({
        userId: user.id,
        action: 'UPDATE_SupportProgram',
        description: `User ${user.email} and ID : ${user.id} create SupportProgram ID : ${ create.id} `,
      } as any); 


      
  }

  // ✅ عرض جميع البرامج
  findAll() {
    return this.prisma.supportProgram.findMany({
      orderBy: { created_at: "desc" },
    });
  }

  // ✅ عرض برنامج محدد
  findOne(id: number) {
    return this.prisma.supportProgram.findUnique({ where: { id } });
  }

  // ✅ تحديث برنامج
  async update(id: number, dto: UpdateSupportProgramDto, user: PayloadDto) {
    const Update = await this.prisma.supportProgram.update({
      where: { id },
      data: dto,
    });
      await this.activityLogService.create({
        userId: user.id,
        action: 'UPDATE_SupportProgram',
        description: `User ${user.email} and ID : ${user.id} create SupportProgram ID : ${ Update.id} `,
      } as any); 
  }

  // ✅ حذف برنامج
  remove(id: number) {
    return this.prisma.supportProgram.delete({ where: { id } });
  }

  // ✅ تسجيل طالب في برنامج
  async assignProgram(dto: AssignProgramDto) {
    const existing = await this.prisma.studentProgram.findFirst({
      where: {
        student_id: dto.studentId,
        program_id: dto.programId,
      },
    });

    if (existing) {
      return this.prisma.studentProgram.update({
        where: { id: existing.id },
        data: { status: dto.status ?? existing.status },
      });
    }

    return this.prisma.studentProgram.create({
      data: {
        student_id: dto.studentId,
        program_id: dto.programId,
        status: dto.status ?? "ENROLLED",
      },
    });
  }

  // ✅ إحصائيات البرنامج
  async programStatistics(programId: number) {
    const total = await this.prisma.studentProgram.count({
      where: { program_id: programId },
    });

    const completed = await this.prisma.studentProgram.count({
      where: { program_id: programId, status: "COMPLETED" },
    });

    const dropped = await this.prisma.studentProgram.count({
      where: { program_id: programId, status: "DROPPED" },
    });

    return { total, completed, dropped };
  }

  // ✅ طلاب برنامج محدد
  studentsInProgram(programId: number) {
    return this.prisma.studentProgram.findMany({
      where: { program_id: programId },
      include: { student: true },
    });
  }
}
