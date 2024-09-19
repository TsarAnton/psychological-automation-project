import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { MethodToLanguage } from './method-to-language.entity';
import { IndicatorToLanguage } from './indicator-to-language.entity';
import { QuestionToLanguage } from './question-to-language.entity';
import { AnswerToLanguage } from './answer-to-language.entity';
import { CriterionToLanguage } from './criterion-to-language.entity';

@Entity({ name: 'languages', engine: 'InnoDB' })
export class Language {
	@PrimaryGeneratedColumn()
	id: number;

    @Column({ length: 100, nullable: false, unique: true })
	name: string;

    @OneToMany(
        () => MethodToLanguage,
        methodToLanguage => methodToLanguage.language,
    )
    methods: MethodToLanguage[];

    @OneToMany(
        () => IndicatorToLanguage,
        indicatorToLanguage => indicatorToLanguage.language,
    )
    indicators: IndicatorToLanguage[];

    @OneToMany(
        () => QuestionToLanguage,
        questionToLanguage => questionToLanguage.language,
    )
    questions: QuestionToLanguage[];
    
    @OneToMany(
        () => AnswerToLanguage,
        answerToLanguage => answerToLanguage.language,
    )
    answers: AnswerToLanguage[];

    @OneToMany(
        () => CriterionToLanguage,
        criterionToLanguage => criterionToLanguage.language,
    )
    criteria: CriterionToLanguage[];
}