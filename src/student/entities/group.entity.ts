import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Faculty } from './faculty.entity';
import { Student } from './student.entity';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Group')
@Entity({ name: 'groups', engine: 'InnoDB' })
export class Group {
	@ApiProperty({ description: "Group id", required: true })
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ description: "Group name", required: true })
	@Column({ length: 100, nullable: false })
	name: string;

	@ApiProperty({ description: "Faculty related to this group", required: true, type: Faculty })
    @ManyToOne(
		() => Faculty,
		faculty => faculty.groups,
		{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
	)
	@JoinColumn({ name: 'faculty_id', referencedColumnName: 'id' })
	faculty: Faculty;

	@ApiProperty({ description: "Array of students related to this group", required: false, type: [Student] })
    @OneToMany(
		() => Student,
		student => student.group,
	)
	students: Student[];
}