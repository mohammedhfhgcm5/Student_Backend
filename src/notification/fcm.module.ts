import { Module } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [FcmService, PrismaService],
  exports: [FcmService], // ✅ تصدير FcmService لأي موديول يستورد هذا
})
export class FcmModule {}
