import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDate, IsDateString, IsInt, IsNotEmpty, IsObject, IsOptional, Max, Min, ValidateNested } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";
import { PeriodDto } from "./common/period.dto";

export class CreateResultDto {
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

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    student: number;

    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    answers: number[];
}

export class UpdateResultDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    display?: number;
}

export class ReadAllResultsDto extends BaseReadAllDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    alarming?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    display?: number;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    date?: Date;

    @IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => PeriodDto)
	period?: PeriodDto;

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
    students?: number[];

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
    indicators?: number[];

    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    languages: number[];
}

export class ReadOneResultDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    student?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    method?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    display?: number;

    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    languages: number[];
}

export class ReadFullResultsDto {
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