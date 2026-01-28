import {
  IsString,
  IsEmail,
  MinLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateDonorDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string; // ✅ المستخدم يرسل هذا فقط

  @IsString()
  nationalNumber: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  verificationToken?: string;

  @IsOptional()
  @IsBoolean()
  verified?: boolean;
}
