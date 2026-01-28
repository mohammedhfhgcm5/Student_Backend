import { IsOptional, IsInt, IsString } from "class-validator";

export class ReportFilterDto {
  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  schoolId?: string;

  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsInt()
  month?: number;
}
