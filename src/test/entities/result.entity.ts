import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Student } from 'src/student/entities/student.entity';
import { Method } from './method.entity';
import { ResultToIndicator } from './result-to-indicator.entity';
import { ResultToAnswer } from './result-to-answer.entity';
import { Answer } from './answer.entity';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Result')
@Entity({ name: 'results', engine: 'InnoDB' })
export class Result {
	@ApiProperty({ description: "Result id", required: true })
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ description: "Result date", required: true })
	@Column({ type: 'timestamp', nullable: false })
	date: Date;

	@ApiProperty({ description: "If this result is displayed to user", required: true })
    @Column({ type: 'bool', nullable: false })
	display: number;

	@ApiProperty({ description: "Student related to this result", required: true, type: () => Student })
    @ManyToOne(
		() => Student,
		student => student.results,
		{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
	)
	@JoinColumn({ name: 'student_id', referencedColumnName: 'id' })
	student: Student;

	@ApiProperty({ description: "Method related to this result", required: true, type: () => Method })
    @ManyToOne(
		() => Method,
		method => method.results,
		{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
	)
	@JoinColumn({ name: 'method_id', referencedColumnName: 'id' })
	method: Method;

	@ApiProperty({ description: "Array of answers given by student in this result", required: true, type: [() => Answer] })
    @ManyToMany(
        () => Answer,
        answer => answer.results,
        { onUpdate: 'RESTRICT', onDelete: 'RESTRICT'}
    )
    @JoinTable({ 
        name: "results_to_answers",
        joinColumn: {
            name: 'result_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'answer_id',
            referencedColumnName: 'id',
        },
    })
    answers: Answer[];

	@ApiProperty({ description: "If result is anonymous", required: true })
    @Column({ nullable: false, type: 'bool', name: 'is_anonymous' })
	isAnonymous: boolean;

	@ApiProperty({ description: "Array of indicator scores perfomed by student in this result", required: true, type: [() => ResultToIndicator] })
    @OneToMany(
		() => ResultToIndicator,
		resultToIndicator => resultToIndicator.result,
	)
	indicators: ResultToIndicator[];

    @OneToMany(
		() => ResultToAnswer,
		resultToAnswer => resultToAnswer.result,
	)
	resultToAnswers: ResultToAnswer[];
}