import { Module } from '@nestjs/common';
import { ExpoNotificationService } from './expo-notification.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [ExpoNotificationService, PrismaService],
  exports: [ExpoNotificationService], // ✅ تصديرها أيضًا
})
export class ExpoNotificationModule {}
