import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Faculty } from './faculty.entity';
import { Student } from './student.entity';

@Entity({ name: 'groups', engine: 'InnoDB' })
export class Group {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 100, nullable: false })
	name: string;

    @ManyToOne(
		() => Faculty,
		faculty => faculty.groups,
		{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
	)
	@JoinColumn({ name: 'faculty_id', referencedColumnName: 'id' })
	faculty: Faculty;

    @OneToMany(
		() => Student,
		student => student.group,
	)
	students: Student[];
}