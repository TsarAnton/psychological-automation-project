import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Max, MaxLength, Min, ValidateNested } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";
import { LanguageNameDescriptionDto } from "./common/language-data.dto";

export class CreateCriterionDto {
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(2)
    @Type(() => Number)
    alarming: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    minValue: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    maxValue: number;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    indicator: number;

    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDescriptionDto)
    languages: LanguageNameDescriptionDto[];
}

export class UpdateCriterionDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(2)
    @Type(() => Number)
    alarming?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    minValue?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    maxValue?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    indicator?: number;

    @IsOptional()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDescriptionDto)
    languages?: LanguageNameDescriptionDto[];
}

export class ReadAllCriteriaDto extends BaseReadAllDto {
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    ids?: number[];

    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    languages: number[];

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    indicators?: number[];

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(2)
    @Type(() => Number)
    alarming?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    minValue?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    maxValue?: number;
}