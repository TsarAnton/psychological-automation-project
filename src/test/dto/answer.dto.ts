import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsObject, IsOptional, ValidateNested } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";
import { LanguageNameDto } from "./common/language-data.dto";

export class CreateAnswerDto {
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    point: number;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    question: number;

    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDto)
    languages: LanguageNameDto[];
}

export class UpdateAnswerDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    point?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    question?: number;

    @IsOptional()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDto)
    languages?: LanguageNameDto[];
}

export class ReadAllAnswersDto extends BaseReadAllDto {
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
    questions?: number[];

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
}

export class ReadOneAnswerDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    question?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    point?: number;

    @IsOptional()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDto)
    languages?: LanguageNameDto[];
}

export class CreateAnswerInMethodDto {
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    point: number;

    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDto)
    languages: LanguageNameDto[];
}