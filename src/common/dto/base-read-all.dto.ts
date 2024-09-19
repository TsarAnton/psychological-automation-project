import { IsObject, IsOptional, ValidateNested } from "class-validator";
import { PaginationDto } from "./pagination.dto";
import { Type } from "class-transformer";
import { SortingDto } from "./sorting.dto";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('Pagination', 'Sorting')
export abstract class BaseReadAllDto {
    @ApiProperty({ description: "Pagination information", required: false, type: PaginationDto })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => PaginationDto)
    public pagination?: PaginationDto;

    @ApiProperty({ description: "Sorting information", required: false, type: SortingDto })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => SortingDto)
    public sorting?: SortingDto;
}