import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Max, MaxLength, Min, ValidateNested } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";
import { LanguageNameDescriptionDto } from "./common/language-data.dto";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('Criterion')
export class CreateCriterionDto {
    @ApiProperty({ description: "Alarm level of created criterion (min - 0, max - 2)", required: true })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(2)
    @Type(() => Number)
    alarming: number;

    @ApiProperty({ description: "Min value of this indicator score for created criterion", required: true })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    minValue: number;

    @ApiProperty({ description: "Max value of this indicator score for created criterion", required: true })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    maxValue: number;

    @ApiProperty({ description: "Created criterion indicator id", required: true })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    indicator: number;

    @ApiProperty({ description: "Array of LanguageNameDescriptionDto for created criterion", required: true, type: [LanguageNameDescriptionDto] })
    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDescriptionDto)
    languages: LanguageNameDescriptionDto[];
}

@ApiTags('Criterion')
export class UpdateCriterionDto {
    @ApiProperty({ description: "Alarm level of updated criterion (min - 0, max - 2)", required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(2)
    @Type(() => Number)
    alarming?: number;

    @ApiProperty({ description: "Min value of this indicator score for updated criterion", required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    minValue?: number;

    @ApiProperty({ description: "Max value of this indicator score for updated criterion", required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    maxValue?: number;

    @ApiProperty({ description: "Updated criterion indicator id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    indicator?: number;

    @ApiProperty({ description: "Array of LanguageNameDescriptionDto for updated criterion", required: false, type: [LanguageNameDescriptionDto] })
    @IsOptional()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDescriptionDto)
    languages?: LanguageNameDescriptionDto[];
}

@ApiTags('Criterion')
export class ReadAllCriteriaDto extends BaseReadAllDto {
    @ApiProperty({ description: "Filter: array on criteria ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    ids?: number[];

    @ApiProperty({ description: "Filter: array of languages ids in which names and descriptions of criteria will be given", required: true, type: [Number] })
    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    languages: number[];

    @ApiProperty({ description: "Filter: array on criteria indicators ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    indicators?: number[];

    @ApiProperty({ description: "Filter: criterion alarming level", required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(2)
    @Type(() => Number)
    alarming?: number;

    @ApiProperty({ description: "Filter: criterion min value (returns criteria which minValue >= provided minValue)", required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    minValue?: number;

    @ApiProperty({ description: "Filter: criterion max value (returns criteria which minValue <= provided maxValue)", required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    maxValue?: number;
}

@ApiTags('Criterion')
export class ReadOneCriterionDto {
    @ApiProperty({ description: "Filter: criterion id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;

    @ApiProperty({ description: "Filter: criterion alarming level", required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(2)
    @Type(() => Number)
    alarming?: number;

    @ApiProperty({ description: "Filter: criterion min value (returns criterion which minValue >= provided minValue)", required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    minValue?: number;

    @ApiProperty({ description: "Filter: criterion max value (returns criterion which minValue <= provided maxValue)", required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    maxValue?: number;

    @ApiProperty({ description: "Filter: criterion indicator id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    indicator?: number;

    @ApiProperty({ description: "Filter: array of languages ids in which names and descriptions of criterion will be given", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    languages?: number[];
}

@ApiTags('Criterion')
export class CreateCriterionInMethodDto {
    @ApiProperty({ description: "Alarm level of created criterion (min - 0, max - 2)", required: true })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(2)
    @Type(() => Number)
    alarming: number;

    @ApiProperty({ description: "Min value of this indicator score for created criterion", required: true })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    minValue: number;

    @ApiProperty({ description: "Max value of this indicator score for created criterion", required: true })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    maxValue: number;

    @ApiProperty({ description: "Array of LanguageNameDescriptionDto for created criterion", required: true, type: [LanguageNameDescriptionDto] })
    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDescriptionDto)
    languages: LanguageNameDescriptionDto[];
}
