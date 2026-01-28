// src/dropout-reason/dropout-reason.controller.ts
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
} from "@nestjs/common";
import { DropoutReasonService } from "./dropout-reason.service";
import { CreateDropoutReasonDto } from "./dto/create-dropout-reason.dto";
import { UpdateDropoutReasonDto } from "./dto/update-dropout-reason.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PayloadDto } from "../auth/dto/auth.dto";
import { currentUser } from "../auth/decorator/current.user.decorator";



 
@Controller("dropout-reasons")
//@UseGuards(JwtAuthGuard)

export class DropoutReasonController {
  constructor(private readonly dropoutReasonService: DropoutReasonService) {}

  @Post()
  create(@Body() dto: CreateDropoutReasonDto, @currentUser() user: PayloadDto) {
    return this.dropoutReasonService.create(dto, user);
  }

  @Get()
  findAll() {
    return this.dropoutReasonService.findAll();
  }
  @Get("search")
  search(
    @Query("q") query: string,
    skip = 0,
    limit = 10,
  ) {
    return this.dropoutReasonService.search(query, skip, limit);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.dropoutReasonService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateDropoutReasonDto,
     @currentUser() user: PayloadDto
  ) {
    console.log(id);
    
    return this.dropoutReasonService.update( id, dto,user);

  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number,@currentUser() user: PayloadDto) {
    return this.dropoutReasonService.remove(id ,user);
  }


}
