import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsObject, IsOptional, ValidateNested } from "class-validator";
import { PeriodDto } from "./common/period.dto";
import { BaseReadAllDto } from "src/common/dto/base-read-all.dto";

export class ReadXlsxReportDto extends BaseReadAllDto {
    @ApiProperty({ description: "Filter: period for results date", required: false, type: PeriodDto })
    @IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => PeriodDto)
	period?: PeriodDto;

    @ApiProperty({ description: "Filter: array of faculties ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    faculties?: number[];

    @ApiProperty({ description: "Filter: array of groups ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    groups?: number[];

    @ApiProperty({ description: "Filter: array of students ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    students?: number[];

    @ApiProperty({ description: "Filter: array of methods ids", required: false, type: [Number] })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty({ each: true })
    @Type(() => Number)
    methods?: number[];

    @ApiProperty({ description: "Filter: language id", required: true })
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    language: number;
}