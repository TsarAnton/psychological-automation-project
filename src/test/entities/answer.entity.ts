import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { Question } from './question.entity';
import { AnswerToLanguage } from './answer-to-language.entity';
import { ResultToAnswer } from './result-to-answer.entity';
import { Result } from './result.entity';

@Entity({ name: 'answers', engine: 'InnoDB' })
export class Answer {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'int', nullable: false })
	point: number;

    @ManyToOne(
		() => Question,
		question => question.answers,
		{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
	)
	@JoinColumn({ name: 'question_id', referencedColumnName: 'id' })
	question: Question;

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

    @ManyToMany(
        () => Result,
        result => result.answers,
        { onUpdate: 'RESTRICT', onDelete: 'RESTRICT' }
    )
    results: Result[];
}