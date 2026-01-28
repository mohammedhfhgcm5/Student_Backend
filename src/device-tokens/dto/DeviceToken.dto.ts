import { IsOptional, IsInt, IsString } from 'class-validator';

export class CreateDeviceTokenDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsInt()
  donorId?: number;

  @IsString()
  token: string;

  @IsOptional()
  @IsString()
  deviceType?: string; // e.g. "ANDROID", "IOS", "WEB"
}
