// src/dropout-reason/dropout-reason.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateDropoutReasonDto } from "./dto/create-dropout-reason.dto";
import { UpdateDropoutReasonDto } from "./dto/update-dropout-reason.dto";
import { PayloadDto } from "src/auth/dto/auth.dto";
import { ActivityLogService } from "src/activity-log/activity-log.service";

@Injectable()
export class DropoutReasonService {
  constructor(private readonly prisma: PrismaService,
    private activityLogService: ActivityLogService,
  ) {}

  async create(dto: CreateDropoutReasonDto , user : PayloadDto) {
    const dropoutReason= this.prisma.dropoutReason.create({ data: dto });


    // create a simple activity log: user created (logged against the created user)
      await this.activityLogService.create({
        userId: user.id,
        action: 'CREATE_DropReason',
        description: `User ${user.fullName} his name ${user.email}   created a dropReason ${dto.category}`,
      } as any); 


      return dropoutReason;

  }

  async findAll() {
    return this.prisma.dropoutReason.findMany({
      include: { students: true },
    });
  }

  async findOne(id: number) {
    const reason = await this.prisma.dropoutReason.findUnique({
      where: { id },
      include: { students: true },
    });
    if (!reason) {
      throw new NotFoundException(`DropoutReason with ID ${id} not found`);
    }
    return reason;
  }

  async update(id: number, dto: UpdateDropoutReasonDto , user : PayloadDto) {
    const update= this.prisma.dropoutReason.update({
      where: { id },
      data: dto,
    });

      await this.activityLogService.create({
        userId: user.id,
        action: 'UPDATE_DropReason',
        description: `User ${user.fullName} his name ${user.email}   Updated a dropReason  newdropReason name ${dto.category}`,
      } as any); 




    return update
  }

  async remove(id: number ,user: PayloadDto) {
    const d = this.prisma.dropoutReason.delete({ where: { id } });


     await this.activityLogService.create({
        userId: user.id,
        action: 'DELETE DropReason',
        description: `User ${user.fullName} his name ${user.email}   Delete a dropReason  id ${id}`,
      } as any); 

      return d; 
  }

  async search(query: string, skip = 0, limit = 10) {
    return this.prisma.dropoutReason.findMany({
      where: {
    
           category: { contains: query, mode: "insensitive" } 
         

      },
      include: { students: true },
      skip,
      take: limit,
    });
  }
}
