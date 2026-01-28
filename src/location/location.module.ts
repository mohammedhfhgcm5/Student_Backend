import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ActivityLogService } from 'src/activity-log/activity-log.service';

@Module({
  controllers: [LocationController],
  providers: [LocationService,PrismaService,ActivityLogService],
})
export class LocationModule {}
