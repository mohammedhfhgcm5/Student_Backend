import { Module } from '@nestjs/common';
import { DonorService } from './donor.service';
import { DonorController } from './donor.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  exports:[DonorService],
  controllers: [DonorController],
  providers: [DonorService,PrismaService],
})
export class DonorModule {}
