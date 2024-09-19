import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { Group } from './group.entity';
import { User } from 'src/auth/entities/user.entity';
import { Result } from 'src/test/entities/result.entity';
import { AvailableMethod } from 'src/test/entities/available-method.entity';

@Entity({ name: 'students', engine: 'InnoDB' })
export class Student {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: 'record_book_number', unique: true, length: 50 })
	recordBookNumber: string;

    @Column({ length: 100, nullable: true })
	name: string;

    @Column({ length: 100, nullable: true })
	surname: string;

    @Column({ length: 100, nullable: true })
	patronymic: string;

    @Column({ length: 20, nullable: true, name: "phone_number" })
	phoneNumber: string;

	@OneToOne(
		() => User,
		user => user.student,
		{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
	)
	@JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
	user: User;

	@OneToMany(
		() => Result,
		result => result.student,
	)
	results: Result[];

	@OneToMany(
		() => AvailableMethod,
		availableMethod => availableMethod.student,
	)
	availableMethods: AvailableMethod[];

    @ManyToOne(
		() => Group,
		group => group.students,
		{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
	)
	@JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
	group: Group;
}