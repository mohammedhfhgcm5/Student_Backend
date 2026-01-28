// src/document/dto/create-document.dto.ts
import { IsInt, IsString } from "class-validator";

export class CreateDocumentDto {
  @IsInt()
  studentId: number;

  @IsString()
  filePath: string;

  @IsString()
  fileType: string;
}

