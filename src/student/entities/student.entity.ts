import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { Group } from './group.entity';
import { User } from 'src/auth/entities/user.entity';
import { Result } from 'src/test/entities/result.entity';
import { AvailableMethod } from 'src/test/entities/available-method.entity';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Entity({ name: 'students', engine: 'InnoDB' })
export class Student {
	@ApiProperty({ description: "Student id", required: true })
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ description: "Student record book number", required: true })
	@Column({ name: 'record_book_number', unique: true, length: 50 })
	recordBookNumber: string;

	@ApiProperty({ description: "Student name", required: true })
    @Column({ length: 100, nullable: true })
	name: string;

	@ApiProperty({ description: "Student surname", required: true })
    @Column({ length: 100, nullable: true })
	surname: string;

	@ApiProperty({ description: "Student patronymic", required: true })
    @Column({ length: 100, nullable: true })
	patronymic: string;

	@ApiProperty({ description: "Student phone number", required: true })
    @Column({ length: 20, nullable: true, name: "phone_number" })
	phoneNumber: string;

	@ApiProperty({ description: "User related to this student", required: true, type: () => Student })
	@OneToOne(
		() => User,
		user => user.student,
		{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
	)
	@JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
	user: User;

	@ApiProperty({ description: "Results related to this student", required: false, type: [Result] })
	@OneToMany(
		() => Result,
		result => result.student,
	)
	results: Result[];

	@ApiProperty({ description: "Methods that this user can perform", required: false, type: [AvailableMethod] })
	@OneToMany(
		() => AvailableMethod,
		availableMethod => availableMethod.student,
	)
	availableMethods: AvailableMethod[];

	@ApiProperty({ description: "Group related to this student", required: true, type: Group })
    @ManyToOne(
		() => Group,
		group => group.students,
		{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
	)
	@JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
	group: Group;
}