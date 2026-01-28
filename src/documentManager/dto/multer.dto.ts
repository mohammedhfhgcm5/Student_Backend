// dto/delete-file.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteFileDto {
  @IsString()
  @IsNotEmpty()
  url: string;
}