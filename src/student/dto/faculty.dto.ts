import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";

@ApiTags('Faculty')
export class CreateFacultyDto {
    @ApiProperty({ description: "Created faculty name", required: true })
    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    name: string;
}

@ApiTags('Faculty')
export class UpdateFacultyDto {
    @ApiProperty({ description: "Updated faculty name", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    name?: string;
}

@ApiTags('Faculty')
export class ReadAllFacultiesDto extends BaseReadAllDto {
    @ApiProperty({ description: "Filter: faculty name", required: false })
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
    ids?: number[];
}

@ApiTags('Faculty')
export class ReadOneFacultyDto {
    @ApiProperty({ description: "Filter: faculty name", required: false })
    @IsOptional()
    @MaxLength(100)
    @IsString()
    name?: string;

    @ApiProperty({ description: "Filter: faculty id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;
}