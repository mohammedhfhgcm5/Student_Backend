import { Module } from '@nestjs/common';
import { DonationService } from './donation.service';
import { DonationController } from './donation.controller';
import { PrismaService } from 'prisma/prisma.service';
import { NotificationsService } from '../notification/notification.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
   imports: [NotificationModule], 
  controllers: [DonationController],
  providers: [DonationService,PrismaService,NotificationsService],
})
export class DonationModule {}
