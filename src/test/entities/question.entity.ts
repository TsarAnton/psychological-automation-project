import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Method } from './method.entity';
import { QuestionToLanguage } from './question-to-language.entity';
import { Answer } from './answer.entity';

@Entity({ name: 'questions', engine: 'InnoDB' })
export class Question {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'int', nullable: false })
	index: number;

    @ManyToOne(
		() => Method,
		method => method.questions,
		{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
	)
	@JoinColumn({ name: 'method_id', referencedColumnName: 'id' })
	method: Method;

    @OneToMany(
		() => QuestionToLanguage,
		questionToLanguage => questionToLanguage.question,
	)
	languages: QuestionToLanguage[];

    @OneToMany(
		() => Answer,
		answer => answer.question,
	)
	answers: Answer[];
}