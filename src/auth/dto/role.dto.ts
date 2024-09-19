import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";

export class CreateRoleDto {
    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    name: string;
}

export class UpdateRoleDto {
    @IsOptional()
    @MaxLength(100)
    @IsString()
    name?: string;
}

export class ReadAllRolesDto extends BaseReadAllDto {
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

export class ReadOneRoleDto {
    @IsOptional()
    @MaxLength(100)
    @IsString()
    name?: string;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;
}