import {
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { VisitType, InteractionType } from '@prisma/client';

export class CreateFollowUpVisitDto {
  @IsInt()
  studentId: number;

  @IsInt()
  userId: number;

  @IsInt()
  guardianId: number;

  @IsDateString()
  visitDate: string; 
  // مثال: "2025-11-03T10:00:00Z"

  @IsEnum(VisitType)
  visitType: VisitType;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  guardianPresent?: boolean;

  @IsOptional()
  @IsEnum(InteractionType)
  interactionType?: InteractionType;

  @IsOptional()
  @IsString()
  noteForGuardian?: string;

  @IsOptional()
  @IsString()
  studentStatusAssessment?: string;

  @IsOptional()
  @IsString()
  recommendations?: string;
}
