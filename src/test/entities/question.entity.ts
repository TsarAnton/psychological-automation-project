import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Method } from './method.entity';
import { QuestionToLanguage } from './question-to-language.entity';
import { Answer } from './answer.entity';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Question')
@Entity({ name: 'questions', engine: 'InnoDB' })
export class Question {
	@ApiProperty({ description: "Question id", required: true })
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ description: "Question index in it's method", required: true })
	@Column({ type: 'int', nullable: false })
	index: number;

	@ApiProperty({ description: "Method related to this question", required: true, type: () => Method })
    @ManyToOne(
		() => Method,
		method => method.questions,
		{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
	)
	@JoinColumn({ name: 'method_id', referencedColumnName: 'id' })
	method: Method;

	@ApiProperty({ description: "Array of AnswerToLanguage entities related to this question", required: false, type: [() => QuestionToLanguage] })
    @OneToMany(
		() => QuestionToLanguage,
		questionToLanguage => questionToLanguage.question,
	)
	languages: QuestionToLanguage[];

	@ApiProperty({ description: "Array of answers related to this question", required: false, type: [() => Answer] })
    @OneToMany(
		() => Answer,
		answer => answer.question,
	)
	answers: Answer[];
}