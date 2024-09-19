import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";

export class CreateStudentDto {
    @IsNotEmpty()
    @MaxLength(50)
    @IsString()
    recordBookNumber: string;

    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    name: string;

    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    surname: string;

    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    patronymic: string;

    @IsNotEmpty()
    @MaxLength(20)
    @IsString()
    phoneNumber: string;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    group: number;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    user: number;
}

export class UpdateStudentDto {
    @IsOptional()
    @MaxLength(100)
    @IsString()
    recordBookNumber?: string;

    @IsOptional()
    @MaxLength(100)
    @IsString()
    name?: string;

    @IsOptional()
    @MaxLength(100)
    @IsString()
    surname?: string;

    @IsOptional()
    @MaxLength(100)
    @IsString()
    patronymic?: string;

    @IsOptional()
    @MaxLength(20)
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    group?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    user?: number;
}

export class ReadAllStudentsDto extends BaseReadAllDto {
    @IsOptional()
    @MaxLength(50)
    @IsString()
    recordBookNumber?: string;

    @IsOptional()
    @MaxLength(100)
    @IsString()
    name?: string;

    @IsOptional()
    @MaxLength(100)
    @IsString()
    surname?: string;

    @IsOptional()
    @MaxLength(100)
    @IsString()
    patronymic?: string;

    @IsOptional()
    @MaxLength(20)
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    users?: number[];

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    groups?: number[];

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

export class ReadOneStudentDto {
    @IsOptional()
    @MaxLength(50)
    @IsString()
    recordBookNumber?: string;

    @IsOptional()
    @MaxLength(100)
    @IsString()
    name?: string;

    @IsOptional()
    @MaxLength(100)
    @IsString()
    surname?: string;

    @IsOptional()
    @MaxLength(100)
    @IsString()
    patronymic?: string;

    @IsOptional()
    @MaxLength(20)
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    user?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;
}