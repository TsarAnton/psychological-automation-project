import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsDate, IsDateString, IsInt, IsNotEmpty, IsObject, IsOptional, ValidateNested } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";
import { LanguageNameDescriptionDto } from "./common/language-data.dto";
import { PeriodDto } from "./common/period.dto";
import { CreateQuestionInMethodDto } from "./question.dto";
import { CreateIndicatorInMethodDto } from "./indicator.dto";


export class CreateMethodDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    timer?: number;

    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDescriptionDto)
    languages: LanguageNameDescriptionDto[];
}

export class UpdateMethodDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    timer?: number;

    @IsOptional()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDescriptionDto)
    languages?: LanguageNameDescriptionDto[];
}

export class ReadAllMethodsDto extends BaseReadAllDto {
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
    results?: number[];
}

export class BaseAvailMethodDto {
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    groups?: number[];

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    faculties?: number[];

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    students?: number[];

    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    methods: number[];
}

export class AvailMethodsDto extends BaseAvailMethodDto {
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    dateEnd: Date;
}

export class DisableMethodsDto extends BaseAvailMethodDto {
    @IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => PeriodDto)
	period?: PeriodDto;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    date?: Date;
}

export class CreateFullMethodDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    timer?: number;

    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDescriptionDto)
    languages: LanguageNameDescriptionDto[];

    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => CreateQuestionInMethodDto)
    questions: CreateQuestionInMethodDto[];

    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => CreateIndicatorInMethodDto)
    indicators: CreateIndicatorInMethodDto[];
}

export class ReadFullMethodDto {
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    id: number;

    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    languages: number[];
}