import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Answer } from "./answer.entity";
import { Language } from "./language.entity";

@Entity({ name: 'answers_to_languages', engine: 'InnoDB' })
export class AnswerToLanguage {
    @PrimaryColumn({ name: 'language_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Language,
        language => language.answers,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'language_id', referencedColumnName: 'id' })
    language: Language;

    @PrimaryColumn({ name: 'answer_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Answer,
        answer => answer.languages,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'answer_id', referencedColumnName: 'id' })
    answer: Answer;

    @Column({ length: 255, nullable: false })
	name: string;
}