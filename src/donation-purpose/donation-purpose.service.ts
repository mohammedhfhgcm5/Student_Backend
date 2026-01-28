import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDonationPurposeDto } from './dto/create-donation-purpose.dto';
import { UpdateDonationPurposeDto } from './dto/update-donation-purpose.dto';

@Injectable()
export class DonationPurposeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDonationPurposeDto) {
    return this.prisma.donationPurpose.create({ data: dto });
  }

  async findAll() {
    return this.prisma.donationPurpose.findMany({
      include: { donations: true },
    });
  }

  async findOne(id: number) {
    const purpose = await this.prisma.donationPurpose.findUnique({
      where: { id },
      include: { donations: true },
    });
    if (!purpose) {
      throw new NotFoundException(`DonationPurpose with ID ${id} not found`);
    }
    return purpose;
  }

  async update(id: number, dto: UpdateDonationPurposeDto) {
    return this.prisma.donationPurpose.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.donationPurpose.delete({ where: { id } });
  }

  /**
   * 🔍 Advanced but simple search:
   * Searches by any part of a letter, word, or sentence.
   * Matches in name, description, or category (case-insensitive).
   */
  async search(query: string, skip = 0, limit = 10) {
    if (!query || query.trim() === '') {
      return this.prisma.donationPurpose.findMany({
        include: { donations: true },
        skip,
        take: limit,
      });
    }

    return this.prisma.donationPurpose.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { donations: true },
      skip,
      take: limit,
    });
  }
}
