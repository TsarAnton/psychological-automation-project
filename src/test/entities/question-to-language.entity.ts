import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Question } from "./question.entity";
import { Language } from "./language.entity";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('Question', 'Language')
@Entity({ name: 'questions_to_languages', engine: 'InnoDB' })
export class QuestionToLanguage {
    @ApiProperty({ description: "Language related to this entity", required: true, type: () => Language })
    @PrimaryColumn({ name: 'language_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Language,
        language => language.questions,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'language_id', referencedColumnName: 'id' })
    language: Language;

    @ApiProperty({ description: "Question related to this entity", required: true, type: () => Question })
    @PrimaryColumn({ name: 'question_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Question,
        question => question.languages,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'question_id', referencedColumnName: 'id' })
    question: Question;

    @ApiProperty({ description: "Text of this question on this language", required: true })
    @Column({ length: 255, nullable: false })
	name: string;
}