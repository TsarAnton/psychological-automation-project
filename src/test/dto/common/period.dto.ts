import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsOptional } from "class-validator";

@ApiTags('Period')
export class PeriodDto {
    @ApiProperty({ description: "Start date of period", required: false })
    @IsOptional()
    @IsDateString()
    @Type(() => Date)
    minDate?: Date;

    @ApiProperty({ description: "End date of period", required: false })
    @IsOptional()
    @IsDateString()
    @Type(() => Date)
    maxDate?: Date;
}