import { IsInt, IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';
import { DonationStatus } from '@prisma/client';

export class CreateDonationDto {
  @IsInt()
  donorId: number;

  @IsOptional()
  @IsInt()
  studentId?: number;

  @IsInt()
  purposeId: number;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsEnum(DonationStatus)
  status?: DonationStatus;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  transactionReference?: string;
}
