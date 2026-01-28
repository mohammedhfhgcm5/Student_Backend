// src/dropout-reason/dto/create-dropout-reason.dto.ts
import { IsString } from "class-validator";

export class CreateDropoutReasonDto {
  @IsString()
  category: string;
  @IsString()
  description: string;


}

