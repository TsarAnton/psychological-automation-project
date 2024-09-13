import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Group } from './group.entity';

@Entity({ name: 'faculties', engine: 'InnoDB' })
export class Faculty {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 100, nullable: false })
	name: string;

    @OneToMany(
		() => Group,
		group => group.faculty,
	)
	groups: Group[];
}