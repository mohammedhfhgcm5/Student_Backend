import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from "path";
import * as fs from "fs";
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class FcmService {
  private readonly logger = new Logger(FcmService.name);

  constructor(private prisma: PrismaService) {
      if (!admin.apps.length) {
      try {
        // ✅ تحديد المسار الكامل للملف
        const filePath = path.join(process.cwd(), "firebase-admin.json");

        if (!fs.existsSync(filePath)) {
          this.logger.error(`❌ ملف firebase-admin.json غير موجود في المسار: ${filePath}`);
          throw new Error("Firebase credentials file not found");
        }

        this.logger.log(`📁 جاري تحميل مفاتيح Firebase من: ${filePath}`);

        admin.initializeApp({
          credential: admin.credential.cert(require(filePath)),
        });

        this.logger.log("✅ تم تهيئة Firebase Admin بنجاح");
      } catch (err) {
        this.logger.error("❌ خطأ أثناء تحميل Firebase Admin:", err);
      }
    }
  }


  

  async sendToUser(userId: number, title: string, body: string, data?: Record<string, string>) {
    const tokens = await this.prisma.deviceToken.findMany({ where: { userId } });
    if (!tokens.length) return;

    const res = await admin.messaging().sendEachForMulticast({
      tokens: tokens.map(t => t.token),
      notification: { title, body },
      data,
    });
    this.logger.log(`FCM -> user ${userId}: ${res.successCount}/${tokens.length} sent`);
  }

  async sendToDonor(donorId: number, title: string, body: string, data?: Record<string, string>) {
    const tokens = await this.prisma.deviceToken.findMany({ where: { donorId } });
    if (!tokens.length) return;

    const res = await admin.messaging().sendEachForMulticast({
      tokens: tokens.map(t => t.token),
      notification: { title, body },
      data,
    });
    this.logger.log(`FCM -> donor ${donorId}: ${res.successCount}/${tokens.length} sent`);
  }
}
