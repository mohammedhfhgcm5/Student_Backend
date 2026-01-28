// src/follow-up-visit/dto/update-follow-up-visit.dto.ts
import { PartialType } from "@nestjs/mapped-types";
import { CreateFollowUpVisitDto } from "./create-follow-up-visit.dto";

export class UpdateFollowUpVisitDto extends PartialType(CreateFollowUpVisitDto) {}
