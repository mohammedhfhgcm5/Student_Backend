// src/donation-purpose/dto/create-donation-purpose.dto.ts
import { IsString } from "class-validator";

export class CreateDonationPurposeDto {
  @IsString()
  name: string;
}
