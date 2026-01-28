import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDeviceTokenDto } from './dto/DeviceToken.dto';

@Injectable()
export class DeviceTokenService {
  constructor(private prisma: PrismaService) {}

  async registerToken(dto: CreateDeviceTokenDto) {
    // Make sure one of userId or donorId is provided
    if (!dto.userId && !dto.donorId) {
      throw new BadRequestException('Either userId or donorId is required');
    }

    // Upsert ensures no duplicate tokens
    return this.prisma.deviceToken.upsert({
      where: { token: dto.token },
      update: {
        userId: dto.userId ?? null,
        donorId: dto.donorId ?? null,
        deviceType: dto.deviceType ?? null,
      },
      create: {
        token: dto.token,
        userId: dto.userId ?? null,
        donorId: dto.donorId ?? null,
        deviceType: dto.deviceType ?? null,
      },
    });
  }

  async findAll() {
    return this.prisma.deviceToken.findMany({
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        donor: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.deviceToken.findMany({
      where: { userId },
    });
  }

  async findByDonor(donorId: number) {
    return this.prisma.deviceToken.findMany({
      where: { donorId },
    });
  }

  async remove(id: number) {
    return this.prisma.deviceToken.delete({ where: { id } });
  }
}
