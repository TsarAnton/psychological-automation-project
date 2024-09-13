import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";

export class CreateGroupDto {
    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    faculty: number;
}

export class UpdateGroupDto {
    @IsOptional()
    @MaxLength(100)
    @IsString()
    name?: string;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    faculty?: number;
}

export class ReadAllGroupsDto extends BaseReadAllDto {
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
    faculties?: number[];

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    ids?: number[];
}