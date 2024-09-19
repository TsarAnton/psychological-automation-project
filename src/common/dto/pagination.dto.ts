import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, Max, Min } from "class-validator";

@ApiTags('Pagination')
export class PaginationDto {
	@ApiProperty({ description: "Number of page", required: false })
    @IsNotEmpty()
	@IsInt()
	@Min(0)
	@Type(() => Number)
	public page: number;

	@ApiProperty({ description: "Page size", required: false })
    @IsNotEmpty()
	@IsInt()
	@Min(1)
	@Max(50)
	@Type(() => Number)
	public size: number;
}