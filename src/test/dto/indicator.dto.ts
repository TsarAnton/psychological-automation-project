import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsObject, IsOptional, IsString, Max, MaxLength, Min, ValidateNested } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";
import { LanguageNameDescriptionDto } from "./common/language-data.dto";

export class CreateIndicatorDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    formula: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    display: number;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    method: number;

    @IsOptional()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDescriptionDto)
    languages?: LanguageNameDescriptionDto[];
}

export class UpdateIndicatorDto {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    formula?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    display?: number;

    @IsOptional()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDescriptionDto)
    languages?: LanguageNameDescriptionDto[];
}

export class ReadAllIndicatorsDto extends BaseReadAllDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    display?: number;

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
    methods?: number[];

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    results?: number[];

    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;
}