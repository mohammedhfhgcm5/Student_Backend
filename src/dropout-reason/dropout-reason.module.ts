import { Module } from '@nestjs/common';
import { DropoutReasonService } from './dropout-reason.service';
import { DropoutReasonController } from './dropout-reason.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Module({
  
  controllers: [DropoutReasonController],
  providers: [DropoutReasonService,PrismaService,ActivityLogService],
})
export class DropoutReasonModule {}
