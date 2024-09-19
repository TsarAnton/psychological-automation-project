import { Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsOptional } from "class-validator";

export class PeriodDto {
    @IsOptional()
    @IsDateString()
    @Type(() => Date)
    minDate?: Date;

    @IsOptional()
    @IsDateString()
    @Type(() => Date)
    maxDate?: Date;
}