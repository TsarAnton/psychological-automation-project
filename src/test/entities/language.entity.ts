import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { MethodToLanguage } from './method-to-language.entity';
import { IndicatorToLanguage } from './indicator-to-language.entity';
import { QuestionToLanguage } from './question-to-language.entity';
import { AnswerToLanguage } from './answer-to-language.entity';
import { CriterionToLanguage } from './criterion-to-language.entity';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Language', 'Method', 'Question', 'Answer', 'Indicator', 'Criterion')
@Entity({ name: 'languages', engine: 'InnoDB' })
export class Language {
    @ApiProperty({ description: "Language id", required: true })
	@PrimaryGeneratedColumn()
	id: number;

    @ApiProperty({ description: "Language name", required: true })
    @Column({ length: 100, nullable: false, unique: true })
	name: string;

    @ApiProperty({ description: "Array of MethodToLanguage entities related to this language", required: false, type: [MethodToLanguage] })
    @OneToMany(
        () => MethodToLanguage,
        methodToLanguage => methodToLanguage.language,
    )
    methods: MethodToLanguage[];

    @ApiProperty({ description: "Array of IndicatorToLanguage entities related to this language", required: false, type: [IndicatorToLanguage] })
    @OneToMany(
        () => IndicatorToLanguage,
        indicatorToLanguage => indicatorToLanguage.language,
    )
    indicators: IndicatorToLanguage[];

    @ApiProperty({ description: "Array of QuestionToLanguage entities related to this language", required: false, type: [QuestionToLanguage] })
    @OneToMany(
        () => QuestionToLanguage,
        questionToLanguage => questionToLanguage.language,
    )
    questions: QuestionToLanguage[];
    
    @ApiProperty({ description: "Array of AnswerToLanguage entities related to this language", required: false, type: [AnswerToLanguage] })
    @OneToMany(
        () => AnswerToLanguage,
        answerToLanguage => answerToLanguage.language,
    )
    answers: AnswerToLanguage[];

    @ApiProperty({ description: "Array of CriterionToLanguage entities related to this language", required: false, type: [CriterionToLanguage] })
    @OneToMany(
        () => CriterionToLanguage,
        criterionToLanguage => criterionToLanguage.language,
    )
    criteria: CriterionToLanguage[];
}