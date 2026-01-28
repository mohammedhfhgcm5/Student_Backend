import { Injectable, Logger } from '@nestjs/common';
import { Expo } from 'expo-server-sdk';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ExpoNotificationService {
  private readonly expo = new Expo();
  private readonly logger = new Logger(ExpoNotificationService.name);

  constructor(private prisma: PrismaService) {}

  private isExpo(token: string) {

    console.log(token);
    console.log(Expo.isExpoPushToken(token));
     
    
    return Expo.isExpoPushToken(token);
  }

  async sendToUser(userId: number, title: string, body: string, data?: any) {
    const rows = await this.prisma.deviceToken.findMany({ where: { userId } });
    const expoTokens = rows.map(r => r.token).filter(this.isExpo);
    console.log(expoTokens);
    

    if (!expoTokens.length) return;

    const messages = expoTokens.map(to => ({ to, sound: 'default', title, body, data }));
    const chunks = this.expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      console.log(chunk);
      
      await this.expo.sendPushNotificationsAsync(chunk);
    }
    this.logger.log(`Expo -> user ${userId}: ${expoTokens.length} tokens`);
  }

  async sendToDonor(donorId: number, title: string, body: string, data?: any) {
    const rows = await this.prisma.deviceToken.findMany({ where: { donorId } });
    const expoTokens = rows.map(r => r.token).filter(this.isExpo);

    if (!expoTokens.length) return;

    const messages = expoTokens.map(to => ({ to, sound: 'default', title, body, data }));
    const chunks = this.expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      await this.expo.sendPushNotificationsAsync(chunk);
    }
    this.logger.log(`Expo -> donor ${donorId}: ${expoTokens.length} tokens`);
  }
}
