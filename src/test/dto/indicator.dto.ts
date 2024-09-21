import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsObject, IsOptional, IsString, Max, MaxLength, Min, ValidateNested } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";
import { LanguageNameDescriptionDto } from "./common/language-data.dto";
import { CreateCriterionInMethodDto } from "./criterion.dto";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('Indicator')
export class CreateIndicatorDto {
    @ApiProperty({ description: "Created indicator formula (syntax: [a] - points of question with index 'a', [a:b] - sum of points from question with index 'a' to 'b', {c} - value for indicator with name 'c'; example: [1] + [2] + 7 * [3:10] - {indicator2}", required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    formula: string;

    @ApiProperty({ description: "Created indicator name", required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string;

    @ApiProperty({ description: "If this created indicator is displayed to user", required: true })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    display: number;

    @ApiProperty({ description: "Created indicator method id", required: true })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    method: number;

    @ApiProperty({ description: "Array of LanguageNameDescriptionDto for created criterion", required: true, type: [LanguageNameDescriptionDto] })
    @IsOptional()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDescriptionDto)
    languages?: LanguageNameDescriptionDto[];
}

@ApiTags('Indicator')
export class UpdateIndicatorDto {
    @ApiProperty({ description: "Updated indicator formula (syntax: [a] - points of question with index 'a', [a:b] - sum of points from question with index 'a' to 'b', {c} - value for indicator with name 'c'; example: [1] + [2] + 7 * [3:10] - {indicator2}", required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    formula?: string;

    @ApiProperty({ description: "Updated indicator name", required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @ApiProperty({ description: "If this updated indicator is displayed to user", required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    display?: number;

    @ApiProperty({ description: "Array of LanguageNameDescriptionDto for updated criterion", required: false, type: [LanguageNameDescriptionDto] })
    @IsOptional()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDescriptionDto)
    languages?: LanguageNameDescriptionDto[];
}

@ApiTags('Indicator')
export class ReadAllIndicatorsDto extends BaseReadAllDto {
    @ApiProperty({ description: "Filter: if indicator is displayed to user", required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    display?: number;

    @ApiProperty({ description: "Filter: array of indicators ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    ids?: number[];

    @ApiProperty({ description: "Filter: array of languages ids in which names and descriptions of indicator will be given", required: true, type: [Number] })
    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    languages: number[];

    @ApiProperty({ description: "Filter: array of methods ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    methods?: number[];

    @ApiProperty({ description: "Filter: array of results ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    results?: number[];

    @ApiProperty({ description: "Filter: indicator name", required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;
}

@ApiTags('Indicator')
export class ReadOneIndicatorDto {
    @ApiProperty({ description: "Filter: indicator id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;

    @ApiProperty({ description: "Filter: indicator formula", required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    formula?: string;

    @ApiProperty({ description: "Filter: indicator name", required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @ApiProperty({ description: "Filter: if indicator is displayed to user", required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    display?: number;

    @ApiProperty({ description: "Filter: indicator method id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    method?: number;

    @ApiProperty({ description: "Filter: array of languages ids in which names and descriptions of indicator will be given", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    languages?: number[];
}

@ApiTags('Indicator')
export class CreateIndicatorInMethodDto {
    @ApiProperty({ description: "Created indicator formula (syntax: [a] - points of question with index 'a', [a:b] - sum of points from question with index 'a' to 'b', {c} - value for indicator with name 'c'; example: [1] + [2] + 7 * [3:10] - {indicator2}", required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    formula: string;

    @ApiProperty({ description: "If this created indicator is displayed to user", required: true })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    display: number;

    @ApiProperty({ description: "Created indicator name", required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string;

    @ApiProperty({ description: "Array of LanguageNameDescriptionDto for created criterion", required: false, type: [LanguageNameDescriptionDto] })
    @IsOptional()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDescriptionDto)
    languages?: LanguageNameDescriptionDto[];

    @ApiProperty({ description: "Array of created criteria for created criterion", required: false, type: [CreateCriterionInMethodDto] })
    @IsOptional()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => CreateCriterionInMethodDto)
    criteria?: CreateCriterionInMethodDto[];
}
