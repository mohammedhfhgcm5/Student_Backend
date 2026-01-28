import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, UseGuards, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { currentUser } from 'src/auth/decorator/current.user.decorator';
import { PayloadDto } from 'src/auth/dto/auth.dto';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }


   @Get('profile')
    @UseGuards(JwtAuthGuard)
    profile(@currentUser() user: PayloadDto ) {
      if (!user?.id) throw new BadRequestException('Invalid token payload');
      return this.service.findOne(user.id);
    }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
  
  
  @Get(':id/activity-logs')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.NGO_STAFF)
  findActivityLogs(@Param('id') id: string) {
    return this.service.findActivityLogs(+id);
  }
}
