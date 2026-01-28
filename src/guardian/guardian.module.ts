import { Module } from '@nestjs/common';
import { GuardianService } from './guardian.service';
import { GuardianController } from './guardian.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Module({
  controllers: [GuardianController],
  providers: [GuardianService, PrismaService,ActivityLogService],
})
export class GuardianModule {}
