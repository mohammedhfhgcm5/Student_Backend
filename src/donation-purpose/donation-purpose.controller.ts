// src/donation-purpose/donation-purpose.controller.ts
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
} from '@nestjs/common';
import { DonationPurposeService } from './donation-purpose.service';
import { CreateDonationPurposeDto } from './dto/create-donation-purpose.dto';
import { UpdateDonationPurposeDto } from './dto/update-donation-purpose.dto';

@Controller('donation-purposes')
export class DonationPurposeController {
  constructor(
    private readonly donationPurposeService: DonationPurposeService,
  ) {}

  @Post()
  create(@Body() dto: CreateDonationPurposeDto) {
    return this.donationPurposeService.create(dto);
  }
  @Get('search')
  search(
    @Query('q') query: string,
    @Query('skip', ParseIntPipe) skip = 0,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return this.donationPurposeService.search(query, skip, limit);
  }

  @Get()
  findAll() {
    return this.donationPurposeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.donationPurposeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDonationPurposeDto,
  ) {
    return this.donationPurposeService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.donationPurposeService.remove(id);
  }
}
