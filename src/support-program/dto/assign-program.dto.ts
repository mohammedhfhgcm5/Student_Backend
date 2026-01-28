import { IsInt, IsEnum, IsOptional } from "class-validator";
import { ProgramStatus } from "@prisma/client";

export class AssignProgramDto {
  @IsInt()
  studentId: number;

  @IsInt()
  programId: number;

  @IsOptional()
  @IsEnum(ProgramStatus)
  status?: ProgramStatus;
}
