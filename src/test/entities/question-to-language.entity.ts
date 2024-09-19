import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Question } from "./question.entity";
import { Language } from "./language.entity";

@Entity({ name: 'questions_to_languages', engine: 'InnoDB' })
export class QuestionToLanguage {
    @PrimaryColumn({ name: 'language_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Language,
        language => language.questions,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'language_id', referencedColumnName: 'id' })
    language: Language;

    @PrimaryColumn({ name: 'question_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Question,
        question => question.languages,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'question_id', referencedColumnName: 'id' })
    question: Question;

    @Column({ length: 255, nullable: false })
	name: string;
}