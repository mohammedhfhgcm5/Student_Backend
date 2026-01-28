// src/follow-up-visit/follow-up-visit.controller.ts
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
import { FollowUpVisitService } from "./follow-up-visit.service";
import { CreateFollowUpVisitDto } from "./dto/create-follow-up-visit.dto";
import { UpdateFollowUpVisitDto } from "./dto/update-follow-up-visit.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { currentUser } from "../auth/decorator/current.user.decorator";
import { PayloadDto } from "../auth/dto/auth.dto";

@Controller("follow-up-visits")
@UseGuards(JwtAuthGuard)

export class FollowUpVisitController {
  constructor(private readonly followUpVisitService: FollowUpVisitService) {}

  @Post()
  create(@Body() dto: CreateFollowUpVisitDto, @currentUser() user: PayloadDto) {
    return this.followUpVisitService.create(dto , user);
  }

  @Get()
  findAll(
    @Query("skip", ParseIntPipe) skip = 0,
    @Query("limit", ParseIntPipe) limit = 10,
    @currentUser() user:PayloadDto
  ) {
    return this.followUpVisitService.findAll(skip, limit,user  );
  }
    @Get("search")
  search(
    @Query("q") query: string,
    @Query("skip", ParseIntPipe) skip = 0,
    @Query("limit", ParseIntPipe) limit = 10,
  ) {
    return this.followUpVisitService.search(query, skip, limit);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.followUpVisitService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateFollowUpVisitDto,@currentUser() user: PayloadDto) {
    return this.followUpVisitService.update(id, dto , user);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number, @currentUser() user: PayloadDto) {
    return this.followUpVisitService.remove(id , user);
  }


}
