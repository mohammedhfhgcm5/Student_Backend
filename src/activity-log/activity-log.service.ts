import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';

@Injectable()
export class ActivityLogService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateActivityLogDto) {
    return this.prisma.activityLog.create({
      data: {
        userId: dto.userId,
        action: dto.action,
        ...(dto.description ? { description: dto.description } : {}),
        

        // createdAt is defaulted by Prisma
        //  description: is not in your current schema; if you add it later include here
      },
    });
  }

  async findAll() {
    return this.prisma.activityLog.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.activityLog.findMany({
      where: { userId },
       include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
      
    });
  }
}
