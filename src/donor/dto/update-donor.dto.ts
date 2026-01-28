import { PartialType } from '@nestjs/mapped-types';
import { CreateDonorDto } from './create-donor.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDonorDto extends PartialType(CreateDonorDto) {
  @IsOptional()
  @IsString()
  passwordHash?: string; // ✅ مضاف هنا فقط
}
