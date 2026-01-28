// src/location/location.controller.ts
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
  DefaultValuePipe,
} from "@nestjs/common";
import { LocationService } from "./location.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { currentUser } from "src/auth/decorator/current.user.decorator";
import { PayloadDto } from "src/auth/dto/auth.dto";

@Controller("locations")
@UseGuards(JwtAuthGuard)

export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  create(@Body() dto: CreateLocationDto, @currentUser() user: PayloadDto) {
    return this.locationService.create(dto , user);
  }

  @Get()
  findAll() {
    return this.locationService.findAll();
  }
@Get("search")
  search(
    @Query("q") query: string,
  @Query("skip", new DefaultValuePipe(0), ParseIntPipe) skip: number,
  @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.locationService.search(query, skip, limit);
  }
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.locationService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateLocationDto,
     @currentUser() user: PayloadDto
  ) {
    return this.locationService.update(id, dto ,user);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number , @currentUser() user: PayloadDto ) {
    return this.locationService.remove(id , user );
  }

  
}
