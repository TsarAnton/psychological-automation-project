import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsDate, IsDateString, IsInt, IsNotEmpty, IsObject, IsOptional, Max, Min, ValidateNested } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";
import { LanguageNameDescriptionDto } from "./common/language-data.dto";
import { PeriodDto } from "./common/period.dto";
import { CreateQuestionInMethodDto } from "./question.dto";
import { CreateIndicatorInMethodDto } from "./indicator.dto";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('Method')
export class CreateMethodDto {
    @ApiProperty({ description: "Time in milliseconds for performing created method", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    timer?: number;

    @ApiProperty({ description: "Array of LanguageNameDescriptionDto for created method", required: true, type: [LanguageNameDescriptionDto] })
    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDescriptionDto)
    languages: LanguageNameDescriptionDto[];
}

@ApiTags('Method')
export class UpdateMethodDto {
    @ApiProperty({ description: "Time in milliseconds for performing updated method", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    timer?: number;

    @ApiProperty({ description: "Array of LanguageNameDescriptionDto for updated method", required: false, type: [LanguageNameDescriptionDto] })
    @IsOptional()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDescriptionDto)
    languages?: LanguageNameDescriptionDto[];
}

@ApiTags('Method')
export class ReadAllMethodsDto extends BaseReadAllDto {
    @ApiProperty({ description: "Filter: methods ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    ids?: number[];

    @ApiProperty({ description: "Filter: array of languages ids in which names and descriptions of method will be given", required: true, type: [Number] })
    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    languages: number[];

    @ApiProperty({ description: "Filter: methods results ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    results?: number[];
}

@ApiTags('Method')
export class ReadOneMethodDto {
    @ApiProperty({ description: "Filter: method id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;

    @ApiProperty({ description: "Filter: method timer", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    timer?: number;

    @ApiProperty({ description: "Filter: array of languages ids in which names and descriptions of method will be given", required: true, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    languages?: number[];
}

@ApiTags('Method')
export class BaseAvailMethodDto {
    @ApiProperty({ description: "Array of groups ids for which students provided methods will be available/disable", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    groups?: number[];

    @ApiProperty({ description: "Array of faculties ids for which students provided methods will be available/disable", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    faculties?: number[];

    @ApiProperty({ description: "Array of students ids for which provided methods will be available/disable", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    students?: number[];

    @ApiProperty({ description: "Array of methods ids which will be available/disable for provided students", required: false, type: [Number] })
    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    methods: number[];
}

@ApiTags('Method')
export class AvailMethodsDto extends BaseAvailMethodDto {
    @ApiProperty({ description: "Date until which provided students can perform provided methods", required: true, type: Date })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    dateEnd: Date;

    @ApiProperty({ description: "If result will be displayed to user", required: true })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    displayResult: number;

    @ApiProperty({ description: "If result is anonymous", required: true })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    isAnonymous: number;
}

@ApiTags('Method')
export class UpdateAvailableMethodsDto extends BaseAvailMethodDto {
    @ApiProperty({ description: "Date until which provided students can perform provided methods", required: true, type: Date })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    dateEnd?: Date;

    @ApiProperty({ description: "If result will be displayed to user", required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    displayResult?: number;

    @ApiProperty({ description: "If result is anonymous", required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    isAnonymous?: number;
}

@ApiTags('Method')
export class DisableMethodsDto extends BaseAvailMethodDto {
    @ApiProperty({ description: "Period for which provided available methods will be disabled for provided student", required: false, type: PeriodDto })
    @IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => PeriodDto)
	period?: PeriodDto;

    @ApiProperty({ description: "Date for which provided available methods will be disabled for provided student", required: false, type: Date })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    date?: Date;
}

@ApiTags('Method')
export class CreateFullMethodDto {
    @ApiProperty({ description: "Time in milliseconds for performing created method", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    timer?: number;

    @ApiProperty({ description: "Array of LanguageNameDescriptionDto for created method", required: true, type: [LanguageNameDescriptionDto] })
    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDescriptionDto)
    languages: LanguageNameDescriptionDto[];

    @ApiProperty({ description: "Array of questions for created method", required: true, type: [CreateQuestionInMethodDto] })
    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => CreateQuestionInMethodDto)
    questions: CreateQuestionInMethodDto[];

    @ApiProperty({ description: "Array of indicators for created method", required: true, type: [CreateIndicatorInMethodDto] })
    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => CreateIndicatorInMethodDto)
    indicators: CreateIndicatorInMethodDto[];
}

@ApiTags('Method')
export class ReadFullMethodDto {
    @ApiProperty({ description: "Filter: method id", required: true })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    id: number;

    @ApiProperty({ description: "Filter: array of languages ids in which names and descriptions of method will be given", required: true, type: [Number] })
    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    languages: number[];
}

@ApiTags('Method')
export class ReadAvailableMethodsDto extends BaseReadAllDto {
    @ApiProperty({ description: "Filter: array of methods ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    methods?: number[];

    @ApiProperty({ description: "Filter: date for which provided methods are available", required: false, type: Date })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    date?: Date;

    @ApiProperty({ description: "Filter: period for which provided methods are available", required: false, type: Date })
    @IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => PeriodDto)
	period?: PeriodDto;

    @ApiProperty({ description: "Filter: array of groups ids for which students provided methods are available", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    groups?: number[];

    @ApiProperty({ description: "Filter: array of faculties ids for which students provided methods are available", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    faculties?: number[];

    @ApiProperty({ description: "Filter: array of students ids for which provided methods are available", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    students?: number[];

    @ApiProperty({ description: "Filter: array of languages ids in which names and descriptions of method will be given", required: true, type: [Number] })
    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    languages: number[];

    @ApiProperty({ description: "Filter: If result will be displayed to user", required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    displayResult?: number;

    @ApiProperty({ description: "Filter: If the student is overdue for the performing testing", required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    isOverdue?: number;

    @ApiProperty({ description: "Filter: If result is anonymous", required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    isAnonymous?: number;
}
