import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

@ApiTags('Sorting')
export class SortingDto {
	@ApiProperty({ description: "Column name to be sorted by", required: false })
	@IsNotEmpty()
	@IsString()
	public column: string;

	@ApiProperty({ description: "Sorting direction", required: false, enum: ['ASC', 'DESC'] })
	@IsNotEmpty()
    @IsString()
	@IsIn(['DESC', 'ASC'])
	public direction: 'DESC' | 'ASC';
}