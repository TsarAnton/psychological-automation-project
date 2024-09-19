import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";

export class CreateFacultyDto {
    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    name: string;
}

export class UpdateFacultyDto {
    @IsOptional()
    @MaxLength(100)
    @IsString()
    name?: string;
}

export class ReadAllFacultiesDto extends BaseReadAllDto {
    @IsOptional()
    @MaxLength(100)
    @IsString()
    name?: string;

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    ids?: number[];
}

export class ReadOneFacultyDto {
    @IsOptional()
    @MaxLength(100)
    @IsString()
    name?: string;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;
}