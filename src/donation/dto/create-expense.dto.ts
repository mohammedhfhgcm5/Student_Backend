import {
  IsInt,
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExpenseTargetType } from '@prisma/client';

class ExpenseAllocationInput {
  @IsInt()
  donationId: number;

  @IsNumber()
  amount: number;
}

export class CreateExpenseDto {
  @IsOptional()
  @IsInt()
  studentId?: number;

  @IsOptional()
  @IsInt()
  schoolId?: number;

  @IsEnum(ExpenseTargetType)
  targetType: ExpenseTargetType;

  @IsInt()
  purposeId: number;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  receiptUrl?: string;

}
