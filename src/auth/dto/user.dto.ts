import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";

@ApiTags('User')
export class CreateUserDto {
    @ApiProperty({ description: "Created user login", required: true })
    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    login: string;

    @ApiProperty({ description: "Created user password", required: true })
    @IsNotEmpty()
    @MaxLength(255)
    @IsString()
    password: string;

    @ApiProperty({ description: "Array of created user roles ids", required: true, type: [Number] })
    @IsArray()
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @IsInt({ each: true })
    @Type(() => Number)
    roles: number[];
}

@ApiTags('User')
export class UpdateUserDto {
    @ApiProperty({ description: "Updated user login", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    login?: string;

    @ApiProperty({ description: "Updated user current password", required: false })
    @IsOptional()
    @MaxLength(255)
    @IsString()
    currentPassword?: string;

    @ApiProperty({ description: "Updated user new login", required: false })
    @IsOptional()
    @MaxLength(255)
    @IsString()
    password?: string;

    @ApiProperty({ description: "Updated user new roles ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @IsInt({ each: true })
    @Type(() => Number)
    roles?: number[];
}

@ApiTags('User')
export class ReadAllUsersDto extends BaseReadAllDto {
    @ApiProperty({ description: "Filter: user login", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    login?: string;

    @ApiProperty({ description: "Filter: array of roles ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    roles?: number[];

    @ApiProperty({ description: "Filter: user ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    ids?: number[];
}

@ApiTags('User')
export class VerifyUserDto {
    @ApiProperty({ description: "User login", required: true })
    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    login: string;

    @ApiProperty({ description: "User password", required: true })
    @IsNotEmpty()
    @MaxLength(255)
    @IsString()
    password: string;
}

@ApiTags('User')
export class ReadOneUserDto {
    @ApiProperty({ description: "Filter: user login", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    login?: string;

    @ApiProperty({ description: "Filter: user id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;
}