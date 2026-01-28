import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ActivityLogModule } from '../activity-log/activity-log.module';
import { PrismaService } from 'prisma/prisma.service';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Module({
   imports: [ActivityLogModule],
  controllers: [UserController],
  providers: [UserService, PrismaService ,ActivityLogService],
  exports:[UserService]
})
export class UserModule {}
