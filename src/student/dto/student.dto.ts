import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";

@ApiTags('Student')
export class CreateStudentDto {
    @ApiProperty({ description: "Created student record book number", required: true })
    @IsNotEmpty()
    @MaxLength(50)
    @IsString()
    recordBookNumber: string;

    @ApiProperty({ description: "Created student name", required: true })
    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    name: string;

    @ApiProperty({ description: "Created student surname", required: true })
    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    surname: string;

    @ApiProperty({ description: "Created student patronymic", required: true })
    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    patronymic: string;

    @ApiProperty({ description: "Created student phone number", required: true })
    @IsNotEmpty()
    @MaxLength(20)
    @IsString()
    phoneNumber: string;

    @ApiProperty({ description: "Created student group id", required: true })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    group: number;

    @ApiProperty({ description: "Created student user id", required: true })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    user: number;
}

@ApiTags('Student')
export class UpdateStudentDto {
    @ApiProperty({ description: "Updated student record book number", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    recordBookNumber?: string;

    @ApiProperty({ description: "Updated student name", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    name?: string;

    @ApiProperty({ description: "Updated student surname", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    surname?: string;

    @ApiProperty({ description: "Updated student patronymic", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    patronymic?: string;

    @ApiProperty({ description: "Updated student phone number", required: false })
    @IsOptional()
    @MaxLength(20)
    @IsString()
    phoneNumber?: string;

    @ApiProperty({ description: "Updated student group id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    group?: number;

    @ApiProperty({ description: "Updated student user id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    user?: number;
}

@ApiTags('Student')
export class ReadAllStudentsDto extends BaseReadAllDto {
    @ApiProperty({ description: "Filter: student record book number", required: false })
    @IsOptional()
    @MaxLength(50)
    @IsString()
    recordBookNumber?: string;

    @ApiProperty({ description: "Filter: student name", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    name?: string;

    @ApiProperty({ description: "Filter: student surname", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    surname?: string;

    @ApiProperty({ description: "Filter: student patronymic", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    patronymic?: string;

    @ApiProperty({ description: "Filter: student phone number", required: false })
    @IsOptional()
    @MaxLength(20)
    @IsString()
    phoneNumber?: string;

    @ApiProperty({ description: "Filter: array of user ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    users?: number[];

    @ApiProperty({ description: "Filter: array of group ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    groups?: number[];

    @ApiProperty({ description: "Filter: array of faculty ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    faculties?: number[];

    @ApiProperty({ description: "Filter: array of student ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    ids?: number[];
}

@ApiTags('Student')
export class ReadOneStudentDto {
    @ApiProperty({ description: "Filter: student record book number", required: false })
    @IsOptional()
    @MaxLength(50)
    @IsString()
    recordBookNumber?: string;

    @ApiProperty({ description: "Filter: student name", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    name?: string;

    @ApiProperty({ description: "Filter: student surname", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    surname?: string;

    @ApiProperty({ description: "Filter: student patronymic", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    patronymic?: string;

    @ApiProperty({ description: "Filter: student phone number", required: false })
    @IsOptional()
    @MaxLength(20)
    @IsString()
    phoneNumber?: string;

    @ApiProperty({ description: "Filter: user id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    user?: number;

    @ApiProperty({ description: "Filter: student id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;
}