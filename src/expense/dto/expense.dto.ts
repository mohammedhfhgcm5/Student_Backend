import { IsEnum, IsNumber, IsString, IsOptional, IsPositive, Min } from 'class-validator';
import { ExpenseTargetType } from '@prisma/client';
import { AllocationDto } from './allocation.dto';

export class CreateExpenseDto {
  @IsOptional()
  @IsNumber()
  studentId?: number;

  @IsOptional()
  @IsNumber()
  schoolId?: number;

  @IsOptional()
  @IsNumber()
  vendorId?: number;

  @IsEnum(ExpenseTargetType)
  targetType: ExpenseTargetType;

  @IsNumber()
  @IsPositive()
  purposeId: number;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  @IsEnum(['SYP', 'USD', 'EUR'], { message: 'Currency must be SYP, USD, or EUR' })
  currency?: string = 'SYP';

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

export class UpdateExpenseDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  receiptUrl?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}

export class ExpenseDto {
  id: number;
  studentId?: number;
  schoolId?: number;
  vendorId?: number;
  targetType: ExpenseTargetType;
  purposeId: number;
  amount: number;
  currency: string;
  paymentMethod?: string;
  description?: string;
  receiptUrl?: string;
  createdAt: Date;
  createdById: number;
  
  // Relations
  student?: any;
  purpose?: any;
  createdBy?: any;
  allocations?: AllocationDto[];
  
  // Calculated fields
  allocatedAmount?: number;
  remainingAmount?: number;
  isFullyCovered?: boolean;
}