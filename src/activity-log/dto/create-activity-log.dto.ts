import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateActivityLogDto {
  @IsInt()
  userId: number;

  @IsString()
  action: string;

  @IsOptional()
  @IsString()
  description?: string;
}
