// src/donor/donor.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';

@Injectable()
export class DonorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDonorDto) {
    const { password, ...rest } = dto;
    return this.prisma.donor.create({
      data: {
        ...rest,
        passwordHash: password, // ✅ نحفظه مؤقتًا هنا (أو بعد تشفيره في auth.service)
      },
    });
  }

  async findAll() {
    return this.prisma.donor.findMany({
      include: { donations: true },
    });
  }

  async findOne(id: number) {
    const donor = await this.prisma.donor.findUnique({
      where: { id },
      include: { donations: true },
    });
    if (!donor) {
      throw new NotFoundException(`Donor with ID ${id} not found`);
    }
    return donor;
  }
  async findOnebyemail(email: string) {
    const donor = await this.prisma.donor.findUnique({
      where: { email },
      include: { donations: true },
    });
    if (!donor) {
      throw new NotFoundException(`Donor with email ${email} not found`);
    }
    return donor;
  }

  // Return all donations made by a specific donor
  async donationsByDonor(donorId: number) {
    return this.prisma.donation.findMany({
      where: { donorId },
      include: { student: true, purpose: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Return only the national number for a donor
  async getNationalNumber(donorId: number) {
    const donor = await this.prisma.donor.findUnique({
      where: { id: donorId },
      select: { nationalNumber: true },
    });
    if (!donor) {
      throw new NotFoundException(`Donor with ID ${donorId} not found`);
    }
    return donor; // { nationalNumber: string }
  }
  // Return email 
  async getDonerFromEmail(email: string) {
    const donor = await this.prisma.donor.findUnique({
      where: { email },
      
    });
    if (!donor) {
      throw new NotFoundException(`Donor with ID ${email} not found`);
    }
    return donor; // { email: string }
  }

  async update(id: number, dto: UpdateDonorDto) {
    // Prevent changing nationalNumber (read-only)
    const { nationalNumber, ...data } = (dto as any) || {};
    return this.prisma.donor.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.donor.delete({ where: { id } });
  }

  async search(query: string, skip = 0, limit = 10) {
    return this.prisma.donor.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { nationalNumber: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { donations: true },
      skip,
      take: limit,
    });
  }
}
