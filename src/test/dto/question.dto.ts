import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsInt, IsNotEmpty, IsObject, IsOptional, Min, ValidateNested } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";
import { LanguageNameDto } from "./common/language-data.dto";
import { CreateAnswerInMethodDto } from "./answer.dto";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('Question')
export class CreateQuestionDto {
    @ApiProperty({ description: "Created question index in provided method", required: true })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    index: number;

    @ApiProperty({ description: "Created question method id", required: true })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    method: number;

    @ApiProperty({ description: "Array of LanguageNameDto for created question", required: true, type: [LanguageNameDto] })
    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDto)
    languages: LanguageNameDto[];
}

@ApiTags('Question')
export class UpdateQuestionDto {
    @ApiProperty({ description: "Updated question index in provided method", required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    index?: number;

    @ApiProperty({ description: "Updated question method id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    method?: number;

    @ApiProperty({ description: "Array of LanguageNameDto for updated question", required: false, type: [LanguageNameDto] })
    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDto)
    languages: LanguageNameDto[];
}

@ApiTags('Question')
export class ReadAllQuestionsDto extends BaseReadAllDto {
    @ApiProperty({ description: "Filter: array of questions ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    ids?: number[];

    @ApiProperty({ description: "Filter: array of languages ids in which names of questions will be given", required: true, type: [Number] })
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
}

@ApiTags('Question')
export class ReadOneQuestionDto {
    @ApiProperty({ description: "Filter: question id", required: false, })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;

    @ApiProperty({ description: "Filter: question index", required: false, })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    index?: number;

    @ApiProperty({ description: "Filter: question method id", required: false, })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    method?: number;

    @ApiProperty({ description: "Filter: array of languages ids in which names of questions will be given", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    languages?: number[];
}

@ApiTags('Question')
export class CreateQuestionInMethodDto {
    @ApiProperty({ description: "Created question index", required: true })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    index: number;

    @ApiProperty({ description: "Array of LanguageNameDto for created question", required: true, type: [LanguageNameDto] })
    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDto)
    languages: LanguageNameDto[];

    @ApiProperty({ description: "Array of answers for created question", required: true, type: [CreateAnswerInMethodDto] })
    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => CreateAnswerInMethodDto)
    answers: CreateAnswerInMethodDto[];
}