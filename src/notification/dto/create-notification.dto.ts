import { IsInt, IsOptional, IsString, IsEnum } from 'class-validator';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsInt()
  donorId?: number;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  link?: string;
}
import { IsBoolean } from 'class-validator';

export class MarkReadDto {
  @IsInt()
  id: number;

  @IsBoolean()
  is_read: boolean;
}
