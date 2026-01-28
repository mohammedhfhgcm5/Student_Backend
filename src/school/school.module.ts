import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ActivityLogService } from 'src/activity-log/activity-log.service';

@Module({
  controllers: [SchoolController],
  providers: [SchoolService, PrismaService,ActivityLogService],
})
export class SchoolModule {}
