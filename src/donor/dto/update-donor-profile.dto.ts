import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateDonorProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

