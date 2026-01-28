import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationsService } from './notification.service';
import { CreateNotificationDto, MarkReadDto } from './dto/create-notification.dto';


@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }

  @Get('user/:userId')
  getForUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.notificationsService.findAllForUser(userId);
  }

  @Get('donor/:donorId')
  getForDonor(@Param('donorId', ParseIntPipe) donorId: number) {
    return this.notificationsService.findAllForDonor(donorId);
  }

  @Patch('read')
  markAsRead(@Body() dto: MarkReadDto) {
    return this.notificationsService.markAsRead(dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.delete(id);
  }
}
