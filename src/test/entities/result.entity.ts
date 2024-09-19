import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Student } from 'src/student/entities/student.entity';
import { Method } from './method.entity';
import { ResultToIndicator } from './result-to-indicator.entity';
import { ResultToAnswer } from './result-to-answer.entity';
import { Answer } from './answer.entity';

@Entity({ name: 'results', engine: 'InnoDB' })
export class Result {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'timestamp', nullable: false })
	date: Date;

    @Column({ type: 'bool', nullable: false })
	display: number;

    @ManyToOne(
		() => Student,
		student => student.results,
		{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
	)
	@JoinColumn({ name: 'student_id', referencedColumnName: 'id' })
	student: Student;

    @ManyToOne(
		() => Method,
		method => method.results,
		{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
	)
	@JoinColumn({ name: 'method_id', referencedColumnName: 'id' })
	method: Method;

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