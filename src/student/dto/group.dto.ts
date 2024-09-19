import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";

@ApiTags('Group')
export class CreateGroupDto {
    @ApiProperty({ description: "Created group name", required: true })
    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    name: string;

    @ApiProperty({ description: "Created group faculty id", required: true })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    faculty: number;
}

@ApiTags('Group')
export class UpdateGroupDto {
    @ApiProperty({ description: "Updated group name", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    name?: string;

    @ApiProperty({ description: "Updated group faculty id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    faculty?: number;
}

@ApiTags('Group')
export class ReadAllGroupsDto extends BaseReadAllDto {
    @ApiProperty({ description: "Filter: group name", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    name?: string;

    @ApiProperty({ description: "Filter: array of faculty ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    faculties?: number[];

    @ApiProperty({ description: "Filter: array of group ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    ids?: number[];
}

@ApiTags('Group')
export class ReadOneGroupDto {
    @ApiProperty({ description: "Filter: group name", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    name?: string;

    @ApiProperty({ description: "Filter: group id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;
}