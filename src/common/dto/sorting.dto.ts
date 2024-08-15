import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class SortingDto {
	@IsNotEmpty()
	@IsString()
	public column: string;

	@IsNotEmpty()
    @IsString()
	@IsIn(['DESC', 'ASC'])
	public direction: 'DESC' | 'ASC';
}