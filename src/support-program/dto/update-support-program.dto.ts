import { PartialType } from "@nestjs/mapped-types";
import { CreateSupportProgramDto } from "./create-support-program.dto";

export class UpdateSupportProgramDto extends PartialType(CreateSupportProgramDto) {}
