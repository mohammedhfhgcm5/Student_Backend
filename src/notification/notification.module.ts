import { Global, Module } from '@nestjs/common';
import { NotificationsService } from './notification.service';
import { NotificationsController } from './notification.controller';
import { PrismaService } from 'prisma/prisma.service';
import { FcmModule } from './fcm.module';
import { ExpoNotificationModule } from './expo-notification.module';

@Global()
@Module({
  imports: [FcmModule, ExpoNotificationModule], // ✅ نجلب الموديولين
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaService],
  exports: [NotificationsService, FcmModule, ExpoNotificationModule], // ✅ نصدر الموديولات نفسهم
})
export class NotificationModule {}
