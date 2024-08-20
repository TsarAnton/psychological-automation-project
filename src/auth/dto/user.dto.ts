import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";

export class CreateUserDto {
    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    login: string;

    @IsNotEmpty()
    @MaxLength(255)
    @IsString()
    password: string;

    @IsArray()
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @IsInt({ each: true })
    @Type(() => Number)
    roles: number[];
}

export class UpdateUserDto {
    @IsOptional()
    @MaxLength(100)
    @IsString()
    login?: string;

    @IsOptional()
    @MaxLength(255)
    @IsString()
    currentPassword?: string;

    @IsOptional()
    @MaxLength(255)
    @IsString()
    password?: string;

    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @IsInt({ each: true })
    @Type(() => Number)
    roles?: number[];
}

export class ReadAllUsersDto extends BaseReadAllDto {
    @IsOptional()
    @MaxLength(100)
    @IsString()
    login?: string;

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    roles?: number[];

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    ids?: number[];
}

export class VerifyUserDto {
    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    login: string;

    @IsNotEmpty()
    @MaxLength(255)
    @IsString()
    password: string;
}