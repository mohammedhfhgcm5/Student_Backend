import { Module } from '@nestjs/common';
import { FollowUpVisitService } from './follow-up-visit.service';
import { FollowUpVisitController } from './follow-up-visit.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[UserModule],
  controllers: [FollowUpVisitController],
  providers: [FollowUpVisitService , PrismaService , ActivityLogService],
})
export class FollowUpVisitModule {}
