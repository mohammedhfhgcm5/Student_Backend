import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { SupportProgramService } from "./support-program.service";
import { CreateSupportProgramDto } from "./dto/create-support-program.dto";
import { UpdateSupportProgramDto } from "./dto/update-support-program.dto";
import { AssignProgramDto } from "./dto/assign-program.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { currentUser } from "src/auth/decorator/current.user.decorator";
import { PayloadDto } from "src/auth/dto/auth.dto";

@Controller("programs")
@UseGuards(JwtAuthGuard)
export class SupportProgramController {
  constructor(private readonly service: SupportProgramService) {}

  @Post()
  create(@Body() dto: CreateSupportProgramDto, @currentUser() user: PayloadDto) {
    return this.service.create(dto, user);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateSupportProgramDto , @currentUser() user: PayloadDto) {
    return this.service.update(id, dto , user);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // 🔹 تسجيل طالب في برنامج
  @Post("assign")
  assignProgram(@Body() dto: AssignProgramDto) {
    return this.service.assignProgram(dto);
  }

  // 🔹 إحصائيات البرنامج
  @Get(":id/statistics")
  programStatistics(@Param("id", ParseIntPipe) id: number) {
    return this.service.programStatistics(id);
  }

  // 🔹 طلاب البرنامج
  @Get(":id/students")
  studentsInProgram(@Param("id", ParseIntPipe) id: number) {
    return this.service.studentsInProgram(id);
  }
}