import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDate, IsDateString, IsInt, IsNotEmpty, IsObject, IsOptional, Max, Min, ValidateNested } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";
import { PeriodDto } from "./common/period.dto";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('Result')
export class CreateResultDto {
    @ApiProperty({ description: "If created result is displayed to user", required: true })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    display: number;

    @ApiProperty({ description: "Created result method id", required: true })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    method: number;

    @ApiProperty({ description: "Created result student id", required: true })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    student: number;

    @ApiProperty({ description: "Array of answers id given by provided student in provided result", required: true, type: [Number] })
    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    answers: number[];
}

@ApiTags('Result')
export class UpdateResultDto {
    @ApiProperty({ description: "If updated result is displayed to user", required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    display?: number;
}

@ApiTags('Result')
export class ReadAllResultsDto extends BaseReadAllDto {
    @ApiProperty({ description: "Filter: indicators alarming level", required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    alarming?: number;

    @ApiProperty({ description: "Filter: if results are displayed to user", required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    display?: number;

    @ApiProperty({ description: "Filter: results date", required: false, type: Date })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    date?: Date;

    @ApiProperty({ description: "Filter: period for results date", required: false, type: PeriodDto })
    @IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => PeriodDto)
	period?: PeriodDto;

    @ApiProperty({ description: "Filter: array of methods ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    methods?: number[];

    @ApiProperty({ description: "Filter: array of students ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    students?: number[];

    @ApiProperty({ description: "Filter: array of groups ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    groups?: number[];

    @ApiProperty({ description: "Filter: array of faculties ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    faculties?: number[];

    @ApiProperty({ description: "Filter: array of indicators ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    indicators?: number[];

    @ApiProperty({ description: "Filter: array of languages ids in which names and descriptions of entities will be given", required: true, type: [Number] })
    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    languages: number[];
}

@ApiTags('Result')
export class ReadOneResultDto {
    @ApiProperty({ description: "Filter: result id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;

    @ApiProperty({ description: "Filter: student id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    student?: number;

    @ApiProperty({ description: "Filter: method id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    method?: number;

    @ApiProperty({ description: "Filter: if result is displayed to user", required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    display?: number;

    @ApiProperty({ description: "Filter: array of languages ids in which names and descriptions of entities will be given", required: false, type: [Number] })
    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    languages?: number[];
}

@ApiTags('Result')
export class ReadFullResultsDto {
    @ApiProperty({ description: "Filter: result id", required: false })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    id: number;

    @ApiProperty({ description: "Filter: array of languages ids in which names and descriptions of entities will be given", required: true, type: [Number] })
    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    languages: number[];
}