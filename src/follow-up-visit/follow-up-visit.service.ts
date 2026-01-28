// src/follow-up-visit/follow-up-visit.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateFollowUpVisitDto } from "./dto/create-follow-up-visit.dto";
import { UpdateFollowUpVisitDto } from "./dto/update-follow-up-visit.dto";
import { ActivityLogService } from "src/activity-log/activity-log.service";
import { PayloadDto } from "src/auth/dto/auth.dto";
import { NotificationsService } from "src/notification/notification.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class FollowUpVisitService {
  constructor(private readonly prisma: PrismaService,
     private activityLogService: ActivityLogService,
       private readonly userservice: UserService,
     private readonly notificationService: NotificationsService
  ) {}

  async create(dto: CreateFollowUpVisitDto ,user : PayloadDto) {
   const studentExists = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
    });

    if (!studentExists) {
      throw new Error('Student not found');
    }

    // Validate guardian if provided
    if (dto.guardianId) {
      const guardianExists = await this.prisma.guardian.findUnique({
        where: { id: dto.guardianId },
      });

      if (!guardianExists) {
        throw new Error('Guardian not found');
      }
    }

    const trueuser = await this.userservice.findOne(user.id);



    const followUpVisit = await this.prisma.followUpVisit.create({
      data: {
        studentId: dto.studentId,
        userId: dto.userId, 
        guardianId: dto.guardianId || null,
        visitDate: dto.visitDate,
        visitType: dto.visitType,
        interactionType: dto.interactionType,
        notes: dto.notes || null,
        guardianPresent: dto.guardianPresent ,
        noteForGuardian: dto.noteForGuardian || null,
        studentStatusAssessment: dto.studentStatusAssessment || null,
        recommendations: dto.recommendations || null,
      },
      include: {
        student: true,
        guardian: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });



   
      await this.notificationService.create({
        userId: dto.userId,
        title: 'Have FollowUp Visit',
        message: `You Have a FollowUp Visit in ${dto.visitDate}`,
        type:"USER_ALERT"
      });




    // create a simple activity log: user created (logged against the created user)
      await this.activityLogService.create({
        userId: user.id,
        action: 'CREATE Follow UP Visit',
        description: `User ${user.fullName} his email ${user.email}  created a Follow up visit  in ${new Date(dto.visitDate)} for student Id${dto.studentId} and user ${dto.userId} `,
      } as any); 


      return followUpVisit

  }

  async findAll(skip = 0, limit = 10,user : PayloadDto) {


    if(user.role=="ADMIN"){

    
    return this.prisma.followUpVisit.findMany({
      include: { student: true },
      skip,
      take: limit,
    });
  }else{
     return this.prisma.followUpVisit.findMany({
      where:{userId:user.id},
      include: { student: true },
      skip,
      take: limit,
    });
  }
  }

  async findOne(id: number) {
    const visit = await this.prisma.followUpVisit.findUnique({
      where: { id },
      include: { student: true },
    });
    if (!visit) {
      throw new NotFoundException(`FollowUpVisit with ID ${id} not found`);
    }
    return visit;
  }

  async update(id: number, dto: UpdateFollowUpVisitDto , user:PayloadDto) {

    const update = this.prisma.followUpVisit.update({
      where: { id },
      data: dto,
    });



    // create a simple activity log: user created (logged against the created user)
      await this.activityLogService.create({
        userId: user.id,
        action: 'UPDATE Follow UP Visit',
        description: `User ${user.fullName} his email ${user.email}  update a Follow up visit , Id follow up ${id}, for student Id${dto.studentId} `,
      } as any); 

      return update;
  }

  async remove(id: number,user : PayloadDto) {
    const d = this.prisma.followUpVisit.delete({ where: { id } });

      await this.activityLogService.create({
        userId: user.id,
        action: 'DELETE Follow UP Visit',
        description: `User ${user.fullName} his email ${user.email}  Delete Follow up visit  id ${id} `,
      } as any); 

      return d

  }

  async search(query: string, skip = 0, limit = 10) {
    return this.prisma.followUpVisit.findMany({
      where: {
        OR: [
          { student: { fullName: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: { student: true },
      skip,
      take: limit,
    });
  }
}
