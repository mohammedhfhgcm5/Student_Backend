import { Module } from '@nestjs/common';
import { DeviceTokenService } from './device-tokens.service';
import { DeviceTokenController } from './device-tokens.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [DeviceTokenController],
  providers: [DeviceTokenService, PrismaService],
})
export class DeviceTokensModule {}
