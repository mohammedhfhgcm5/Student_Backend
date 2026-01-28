import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ActivityLogService } from 'src/activity-log/activity-log.service';

@Module({
  controllers: [StudentController],
  providers: [StudentService,PrismaService,ActivityLogService],
})
export class StudentModule {}
