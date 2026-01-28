// src/donation-purpose/dto/update-donation-purpose.dto.ts
import { PartialType } from "@nestjs/mapped-types";
import { CreateDonationPurposeDto } from "./create-donation-purpose.dto";

export class UpdateDonationPurposeDto extends PartialType(CreateDonationPurposeDto) {}
