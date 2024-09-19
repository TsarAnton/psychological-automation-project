import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsInt, IsNotEmpty, IsObject, IsOptional, Min, ValidateNested } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";
import { LanguageNameDto } from "./common/language-data.dto";


export class CreateQuestionDto {
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    index: number;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    method: number;

    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDto)
    languages: LanguageNameDto[];
}

export class UpdateQuestionDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    index?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    method?: number;

    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDto)
    languages: LanguageNameDto[];
}

export class ReadAllQuestionsDto extends BaseReadAllDto {
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    ids?: number[];

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    languages?: number[];

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    methods?: number[];
}