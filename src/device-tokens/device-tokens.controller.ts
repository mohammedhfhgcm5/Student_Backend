import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { DeviceTokenService } from './device-tokens.service';
import { CreateDeviceTokenDto } from './dto/DeviceToken.dto';

@Controller('device-token')
export class DeviceTokenController {
  constructor(private readonly deviceTokenService: DeviceTokenService) {}

  // Register or update token
  @Post('register')
  register(@Body() dto: CreateDeviceTokenDto) {
    return this.deviceTokenService.registerToken(dto);
  }

  // Get all tokens
  @Get()
  findAll() {
    return this.deviceTokenService.findAll();
  }

  // Get tokens by user
  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.deviceTokenService.findByUser(userId);
  }

  // Get tokens by donor
  @Get('donor/:donorId')
  findByDonor(@Param('donorId', ParseIntPipe) donorId: number) {
    return this.deviceTokenService.findByDonor(donorId);
  }

  // Delete a token
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deviceTokenService.remove(id);
  }
}
