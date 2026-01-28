    // src/dropout-reason/dto/update-dropout-reason.dto.ts
    import { PartialType } from "@nestjs/mapped-types";
    import { CreateDropoutReasonDto } from "./create-dropout-reason.dto";

    export class UpdateDropoutReasonDto extends PartialType(CreateDropoutReasonDto) {}
