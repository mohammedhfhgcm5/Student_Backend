// src/student/dto/create-student.dto.ts
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsInt,
  IsNumber,
  Min,
  IsBoolean,
  IsEmail,
  Length,
  Matches,
} from "class-validator";
import { Gender, StudentStatus } from "@prisma/client";
import { Type } from 'class-transformer';

export class CreateStudentDto {
  @IsString()
  fullName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(StudentStatus)
  status: StudentStatus;

   @IsString()
  @Length(11)
  @Matches(/^[0-9]+$/, { message: 'National number must contain only digits' })
  nationalNumber: string;

  @IsString()
  mainLanguage: string;

  // ✅ حقل LanguageneedIt المفقود
  @IsOptional()
  @IsString()
  languageneedIt?: string;

  @IsOptional()
  @IsString()
  acquiredLanguage?: string;

  @IsOptional()
  @IsString()
  supportNeeds?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  educationLevel?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  educationGapYears?: number;

  @IsOptional()
  @IsString()
  lastGradeCompleted?: string;

  @IsOptional()
  @IsString()
  literacyLevel?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  familySize?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyIncome?: number;

  @IsOptional()
  @IsString()
  incomeSource?: string;

  @IsOptional()
  @IsString()
  housingStatus?: string;

  @IsOptional()
  @IsBoolean()
  hasDisability?: boolean;

  @IsOptional()
  @IsString()
  disabilityType?: string;

  @IsOptional()
  @IsString()
  riskLevel?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsInt()
  guardianId?: number;

  @IsOptional()
  @IsInt()
  schoolId?: number;

  @IsOptional()
  @IsInt()
  locationId?: number;

  @IsOptional()
  @IsInt()
  dropoutReasonId?: number;
}