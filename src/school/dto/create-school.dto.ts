// src/school/dto/create-school.dto.ts
import { IsOptional, IsString } from "class-validator";

export class CreateSchoolDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  region: string;
}
