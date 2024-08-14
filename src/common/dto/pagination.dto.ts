import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, Max, Min } from "class-validator";

export class PaginationDto {
    @IsNotEmpty()
	@IsInt()
	@Min(0)
	@Type(() => Number)
	public page: number;

    @IsNotEmpty()
	@IsInt()
	@Min(1)
	@Max(50)
	@Type(() => Number)
	public size: number;
}