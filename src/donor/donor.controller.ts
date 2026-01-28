// src/donor/donor.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { DonorService } from './donor.service';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { currentUser } from '../auth/decorator/current.user.decorator';
import { PayloadDto } from '../auth/dto/auth.dto';
import { UpdateDonorProfileDto } from './dto/update-donor-profile.dto';

@Controller('donors')
export class DonorController {
  constructor(private readonly donorService: DonorService) {}

  @Post()
  create(@Body() dto: CreateDonorDto) {
    return this.donorService.create(dto);
  }

  @Get('search')
  search(
    @Query('q') query: string,
    @Query('skip', ParseIntPipe) skip = 0,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return this.donorService.search(query, skip, limit);
  }
  @Get()
  findAll() {
    return this.donorService.findAll();
  }

  // Donor profile for authenticated donor
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@currentUser() user: PayloadDto & { id: number }) {
    if (!user?.id) throw new BadRequestException('Invalid token payload');
    return this.donorService.findOne(user.id);
  }

  // Read-only: donor national number (authenticated donor)
  @Get('profile/national-number')
  @UseGuards(JwtAuthGuard)
  myNationalNumber(@currentUser() user: PayloadDto & { id: number }) {
    if (!user?.id) throw new BadRequestException('Invalid token payload');
    return this.donorService.getNationalNumber(user.id);
  }

  // Edit donor profile (name, email, phone)
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @currentUser() user: PayloadDto & { id: number },
    @Body() dto: UpdateDonorProfileDto,
  ) {
    if (!user?.id) throw new BadRequestException('Invalid token payload');
    const { name, email, phone } = dto;
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (phone !== undefined) data.phone = phone;
    return this.donorService.update(user.id, data);
  }

  // All donations for a given donor (by ID)
  @Get(':id/donations')
  getDonationsByDonor(@Param('id', ParseIntPipe) id: number) {
    return this.donorService.donationsByDonor(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.donorService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDonorDto) {
    return this.donorService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.donorService.remove(id);
  }
}
