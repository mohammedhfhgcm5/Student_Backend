import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export enum CriteriaType {
  NUMBER = "NUMBER",
  PERCENT = "PERCENT",
  BOOLEAN = "BOOLEAN",
  ENUM = "ENUM",
}

export enum CriteriaDirection {
  HIGHER_BETTER = "HIGHER_BETTER",
  LOWER_BETTER = "LOWER_BETTER",
}

export class CreateCriteriaDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(CriteriaType)
  type: CriteriaType;

  @IsEnum(CriteriaDirection)
  direction: CriteriaDirection;

  @IsNumber()
  @IsOptional()
  minValue?: number;

  @IsNumber()
  @IsOptional()
  maxValue?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  sourceField:string

}
