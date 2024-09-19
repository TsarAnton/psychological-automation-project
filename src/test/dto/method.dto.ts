import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsDate, IsDateString, IsInt, IsNotEmpty, IsObject, IsOptional, ValidateNested } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";
import { LanguageNameDescriptionDto } from "./common/language-data.dto";

export class CreateMethodDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    timer?: number;

    @IsNotEmpty()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDescriptionDto)
    languages: LanguageNameDescriptionDto[];
}

export class UpdateMethodDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    timer?: number;

    @IsOptional()
    @IsObject({ each: true })
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => LanguageNameDescriptionDto)
    languages?: LanguageNameDescriptionDto[];
}

export class ReadAllMethodsDto extends BaseReadAllDto {
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
    results?: number[];
}
