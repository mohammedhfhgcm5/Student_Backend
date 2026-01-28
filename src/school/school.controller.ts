// src/school/school.controller.ts
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
  DefaultValuePipe,
} from "@nestjs/common";
import { SchoolService } from "./school.service";
import { CreateSchoolDto } from "./dto/create-school.dto";
import { UpdateSchoolDto } from "./dto/update-school.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { currentUser } from "src/auth/decorator/current.user.decorator";
import { PayloadDto } from "src/auth/dto/auth.dto";

@Controller("schools")
@UseGuards(JwtAuthGuard)

export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  create(@Body() dto: CreateSchoolDto,  @currentUser() user: PayloadDto) {
    return this.schoolService.create(dto , user );
  }

  @Get()
  findAll() {
    return this.schoolService.findAll();
  }

  @Get("search")
search(
  @Query("q") query: string,
  @Query("skip", new DefaultValuePipe(0), ParseIntPipe) skip: number,
  @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
) {
  return this.schoolService.search(query, skip, limit);
}

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.schoolService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateSchoolDto,
     @currentUser() user: PayloadDto
  ) {
    return this.schoolService.update(id, dto , user);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number, @currentUser() user: PayloadDto) {
    return this.schoolService.remove(id , user );
  }


}
