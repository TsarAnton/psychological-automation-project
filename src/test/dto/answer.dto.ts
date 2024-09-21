import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsObject, IsOptional, ValidateNested } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";
import { LanguageNameDto } from "./common/language-data.dto";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('Answer')
export class CreateAnswerDto {
    @ApiProperty({ description: "Number of points for created answer", required: true })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    point: number;

    @ApiProperty({ description: "Created answer question id", required: true })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    question: number;

    @ApiProperty({ description: "Array of LanguageNameDto for created answer", required: true, type: [LanguageNameDto] })
    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDto)
    languages: LanguageNameDto[];
}

@ApiTags('Answer')
export class UpdateAnswerDto {
    @ApiProperty({ description: "Number of points for updated answer", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    point?: number;

    @ApiProperty({ description: "Updated answer question id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    question?: number;

    @ApiProperty({ description: "Array of LanguageNameDto for updated answer", required: false, type: [LanguageNameDto] })
    @IsOptional()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDto)
    languages?: LanguageNameDto[];
}

@ApiTags('Answer')
export class ReadAllAnswersDto extends BaseReadAllDto {
    @ApiProperty({ description: "Filter: array of answer ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    ids?: number[];

    @ApiProperty({ description: "Filter: array of languages ids in which names of answers will be given", required: true, type: [Number] })
    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    languages: number[];

    @ApiProperty({ description: "Filter: array of question ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    questions?: number[];

    @ApiProperty({ description: "Filter: array of method ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    methods?: number[];

    @ApiProperty({ description: "Filter: array of result ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    results?: number[];
}

@ApiTags('Answer')
export class ReadOneAnswerDto {
    @ApiProperty({ description: "Filter: answer id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;

    @ApiProperty({ description: "Filter: question id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    question?: number;

    @ApiProperty({ description: "Filter: number of points", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    point?: number;

    @ApiProperty({ description: "Filter: array of languages ids in which names of answers will be given", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    languages?: number[];
}

@ApiTags('Answer')
export class CreateAnswerInMethodDto {
    @ApiProperty({ description: "Number of points for created answer", required: true })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    point: number;

    @ApiProperty({ description: "Array of LanguageNameDto for created answer", required: true, type: [LanguageNameDto] })
    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDto)
    languages: LanguageNameDto[];
}