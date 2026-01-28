// src/guardian/guardian.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateGuardianDto } from "./dto/create-guardian.dto";
import { UpdateGuardianDto } from "./dto/update-guardian.dto";
import { ActivityLogService } from "src/activity-log/activity-log.service";
import { PayloadDto } from "src/auth/dto/auth.dto";

@Injectable()
export class GuardianService {
  constructor(private readonly prisma: PrismaService,
     private activityLogService: ActivityLogService,
  ) {}

  async create(dto: CreateGuardianDto,user : PayloadDto) {
    
    const create = this.prisma.guardian.create({
      data: dto,
    });


     // create a simple activity log: user created (logged against the created user)
      await this.activityLogService.create({
        userId: user.id,
        action: 'CREATE Guardian',
        description: `User ${user.fullName} his email ${user.email}  created a Guardian  his name : ${dto.fullName}  `,
      } as any); 

      return create;



  }

  async findAll() {
    return this.prisma.guardian.findMany({
      include: { students: true },
    });
  }

  async findOne(id: number) {
    const guardian = await this.prisma.guardian.findUnique({
      where: { id },
      include: { students: true },
    });
    if (!guardian) {
      throw new NotFoundException(`Guardian with ID ${id} not found`);
    }
    return guardian;
  }

  async update(id: number, dto: UpdateGuardianDto, user : PayloadDto) {
    const update = this.prisma.guardian.update({
      where: { id },
      data: dto,
    });

    // create a simple activity log: user created (logged against the created user)
      await this.activityLogService.create({
        userId: user.id,
        action: 'UPDATE Guardian',
        description: `User ${user.fullName} his email ${user.email}  updated Guardian  his Id : ${id} `,
      } as any); 

      return update;

  }

  async remove(id: number ,user: PayloadDto) {
    const d = this.prisma.guardian.delete({
      where: { id },
    });

      await this.activityLogService.create({
        userId: user.id,
        action: 'DELETE Guardian',
        description: `User ${user.fullName} his email ${user.email}  Delete Guardian  his Id : ${id} `,
      } as any); 
      return d;
  }

  async search(query: string) {
  return this.prisma.guardian.findMany({
    where: {
      OR: [
        { nationalNumber: { contains: query } },
        { phone: { equals: query } },
        { fullName: { contains: query, mode: "insensitive" } },
      ],
     },
     include: { students: true },
    });
  }
}
