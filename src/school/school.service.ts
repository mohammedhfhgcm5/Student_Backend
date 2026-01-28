// src/school/school.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateSchoolDto } from "./dto/create-school.dto";
import { UpdateSchoolDto } from "./dto/update-school.dto";
import { ActivityLogService } from "../activity-log/activity-log.service";
import { PayloadDto } from "../auth/dto/auth.dto";

@Injectable()
export class SchoolService {
  constructor(private readonly prisma: PrismaService,
         private activityLogService: ActivityLogService,
    
  ) {}

  async create(dto: CreateSchoolDto  , user : PayloadDto) {
    const create = this.prisma.school.create({
      data: dto,
    });

      await this.activityLogService.create({
        userId: user.id,
        action: 'CREATE School',
        description: `User ${user.fullName} his email ${user.email}  created a new School  ${dto.name} `,
      } as any); 


      return create;
  }

  async findAll() {
    return this.prisma.school.findMany({
      include: { students: true },
    });
  }

  async findOne(id: number) {
    const school = await this.prisma.school.findUnique({
      where: { id },
      include: { students: true },
    });
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }

  async update(id: number, dto: UpdateSchoolDto ,user: PayloadDto) {
    const update =  this.prisma.school.update({
      where: { id },
      data: dto,
    });

     await this.activityLogService.create({
        userId: user.id,
        action: 'UPDATE School',
        description: `User ${user.fullName} his email ${user.email}  Updated School id ${id} `,
      } as any); 

  }

  async remove(id: number , user : PayloadDto) {
    const d = this.prisma.school.delete({
      where: { id },
    });

     await this.activityLogService.create({
        userId: user.id,
        action: 'Delete School',
        description: `User ${user.fullName} his email ${user.email}  Delete School id ${id} `,
      } as any); 
      return d;

  }


  
async search(query: string, skip = 0, limit = 10) {
  return this.prisma.school.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
        { region: { contains: query, mode: "insensitive" } },
        { address: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { students: true },
    skip,
    take: limit,
  });
}
}
