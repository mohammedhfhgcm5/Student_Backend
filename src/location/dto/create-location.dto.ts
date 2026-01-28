// src/location/dto/create-location.dto.ts
import { IsString } from "class-validator";

export class CreateLocationDto {
  @IsString()
  name: string;

  @IsString()
  region: string;
}
