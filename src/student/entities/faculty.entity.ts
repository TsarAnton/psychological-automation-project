import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Group } from './group.entity';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Faculty')
@Entity({ name: 'faculties', engine: 'InnoDB' })
export class Faculty {
	@ApiProperty({ description: "Faculty id", required: true })
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ description: "Faculty name", required: true })
	@Column({ length: 100, nullable: false })
	name: string;

	@ApiProperty({ description: "Array of faculty groups", required: false, type: [Group] })
    @OneToMany(
		() => Group,
		group => group.faculty,
	)
	groups: Group[];
}