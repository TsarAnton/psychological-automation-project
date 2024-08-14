import { IsObject, IsOptional, ValidateNested } from "class-validator";
import { PaginationDto } from "./pagination.dto";
import { Type } from "class-transformer";
import { SortingDto } from "./sorting.dto";

export abstract class BaseReadAllDto {
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => PaginationDto)
    public pagination?: PaginationDto;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => SortingDto)
    public sorting?: SortingDto;
}