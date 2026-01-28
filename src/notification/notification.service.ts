import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateNotificationDto,MarkReadDto } from './dto/create-notification.dto';
import { FcmService } from './fcm.service';
import { ExpoNotificationService } from './expo-notification.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService,
    private fcm: FcmService,
    private expo: ExpoNotificationService,
  ) {}

 async create(dto: CreateNotificationDto) {
    if (!dto.userId && !dto.donorId) {
      throw new Error('Either userId or donorId is required');
    }

    const notif = await this.prisma.notification.create({
      data: {
        userId: dto.userId ?? null,
        donorId: dto.donorId ?? null,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        link: dto.link ?? null,
      },
    });

   

    return notif;
  }

  async findAllForUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { created_at: 'desc' },
    });
  }

  async findAllForDonor(donorId: number) {
    return this.prisma.notification.findMany({
      where: { donorId },
      orderBy: { created_at: 'desc' },
    });
  }

  async markAsRead(dto: MarkReadDto) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: dto.id },
    });
    if (!notification) throw new NotFoundException('Notification not found');

    return this.prisma.notification.update({
      where: { id: dto.id },
      data: { is_read: dto.is_read },
    });
  }

  async delete(id: number) {
    return this.prisma.notification.delete({ where: { id } });
  }

  // Optional helper for future FCM
  async notifyUser(userId: number, title: string, message: string, link?: string) {
    return this.create({
      userId,
      type: 'USER_ALERT',
      title,
      message,
      link,
    });
  }

  async notifyDonor(donorId: number, title: string, message: string, link?: string) {
    return this.create({
      donorId,
      type: 'DONOR_ALERT',
      title,
      message,
      link,
    });
  }
}
