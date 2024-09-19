import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class LanguageNameDto {
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    language: number;

    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    name: string;
}

export class LanguageNameDescriptionDto {
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    language: number;

    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}