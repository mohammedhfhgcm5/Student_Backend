import { IsString, IsOptional, IsBoolean } from "class-validator";

export class CreateSupportProgramDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
