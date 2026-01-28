import { Module } from '@nestjs/common';
import { SupportProgramService } from './support-program.service';
import { SupportProgramController } from './support-program.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ActivityLogService } from 'src/activity-log/activity-log.service';

@Module({
  controllers: [SupportProgramController],
  providers: [SupportProgramService,PrismaService,ActivityLogService],
})
export class SupportProgramModule {}
