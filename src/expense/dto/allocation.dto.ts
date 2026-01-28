import { IsNumber, Min, IsOptional, IsPositive } from 'class-validator';

export class CreateAllocationDto {
  @IsNumber()
  donationId: number;

  @IsNumber()
  expenseId: number;

  @IsNumber()
  @Min(0.01)
  amount: number;
}

export class UpdateAllocationDto {
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;
}

export class AllocationDto {
  id: number;
  donationId: number;
  expenseId: number;
  amount: number;
  
  // Relations
  donation?: any;
  expense?: any;
}

export class AllocationSummaryDto {
  donationId: number;
  donationAmount: number;
  allocatedAmount: number;
  remainingAmount: number;
  allocations: AllocationDto[];
}

export class ExpenseCoverageDto {
  expenseId: number;
  expenseAmount: number;
  coveredAmount: number;
  remainingAmount: number;
  percentageCovered: number;
  allocations: AllocationDto[];
}