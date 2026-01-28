// src/guardian/guardian.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from "@nestjs/common";
import { GuardianService } from "./guardian.service";
import { CreateGuardianDto } from "./dto/create-guardian.dto";
import { UpdateGuardianDto } from "./dto/update-guardian.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { currentUser } from "src/auth/decorator/current.user.decorator";
import { PayloadDto } from "src/auth/dto/auth.dto";

@Controller("guardians")
 @UseGuards(JwtAuthGuard)

export class GuardianController {
  constructor(private readonly guardianService: GuardianService) {}

  @Post()
  create(@Body() dto: CreateGuardianDto , @currentUser() user: PayloadDto) {
    return this.guardianService.create(dto , user);
  }

  @Get()
  findAll() {
    return this.guardianService.findAll();
  }
 @Get("search")
search(@Query("q") query: string) {
  return this.guardianService.search(query);
}
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.guardianService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateGuardianDto,
     @currentUser() user: PayloadDto
  ) {
    return this.guardianService.update(id, dto,user);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number,@currentUser() user: PayloadDto) {
    return this.guardianService.remove(id , user);
  }

 
}
