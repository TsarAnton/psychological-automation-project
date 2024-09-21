import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsObject, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";

import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";

@ApiTags('Language')
export class CreateLanguageDto {
    @ApiProperty({ description: "Created language name", required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;
}

@ApiTags('Language')
export class UpdateLanguageDto {
    @ApiProperty({ description: "Updated language name", required: false })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;
}

@ApiTags('Language')
export class ReadAllLanguagesDto extends BaseReadAllDto {
    @ApiProperty({ description: "Filter: language name", required: false })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;

    @ApiProperty({ description: "Filter: languages ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    ids?: number[];

    @ApiProperty({ description: "Filter: criteria ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    criteria?: number[];

    @ApiProperty({ description: "Filter: indicators ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    indicators?: number[];

    @ApiProperty({ description: "Filter: methods ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    methods?: number[];

    @ApiProperty({ description: "Filter: questions ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    questions?: number[];

    @ApiProperty({ description: "Filter: answers ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    answers?: number[];
}

@ApiTags('Language')
export class ReadOneLanguageDto {
    @ApiProperty({ description: "Filter: language id", required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    id?: number;

    @ApiProperty({ description: "Filter: language name", required: false })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;
}
