import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { Question } from './question.entity';
import { AnswerToLanguage } from './answer-to-language.entity';
import { ResultToAnswer } from './result-to-answer.entity';
import { Result } from './result.entity';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Answer')
@Entity({ name: 'answers', engine: 'InnoDB' })
export class Answer {
	@ApiProperty({ description: "Answer id", required: true })
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ description: "Number of points for this answer", required: true })
	@Column({ type: 'int', nullable: false })
	point: number;

	@ApiProperty({ description: "Question that is related with this answer", required: true,  type: () => Question })
    @ManyToOne(
		() => Question,
		question => question.answers,
		{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
	)
	@JoinColumn({ name: 'question_id', referencedColumnName: 'id' })
	question: Question;

	@ApiProperty({ description: "Array of AnswerToLanguage entities related to this answer", required: false, type: [() => AnswerToLanguage] })
    @OneToMany(
		() => AnswerToLanguage,
		answerToLanguage => answerToLanguage.answer,
	)
	languages: AnswerToLanguage[];

    @OneToMany(
		() => ResultToAnswer,
		resultToAnswer => resultToAnswer.answer,
	)
	answerToResults: ResultToAnswer[];

	@ApiProperty({ description: "Array of reults related to this answer", required: false, type: [() => Result] })
    @ManyToMany(
        () => Result,
        result => result.answers,
        { onUpdate: 'RESTRICT', onDelete: 'RESTRICT' }
    )
    results: Result[];
}