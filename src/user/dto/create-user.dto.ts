import { IsString, IsEmail, IsEnum, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsString()
  nationalNumber: string;

  @IsEnum(Role)
  role: Role;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
