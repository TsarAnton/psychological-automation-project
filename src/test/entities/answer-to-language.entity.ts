import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Answer } from "./answer.entity";
import { Language } from "./language.entity";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('Answer', 'Language')
@Entity({ name: 'answers_to_languages', engine: 'InnoDB' })
export class AnswerToLanguage {
    @ApiProperty({ description: "Language related to this entity", required: true, type: () => Language })
    @PrimaryColumn({ name: 'language_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Language,
        language => language.answers,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'language_id', referencedColumnName: 'id' })
    language: Language;

    @ApiProperty({ description: "Answer related to this entity", required: true, type: () => Answer })
    @PrimaryColumn({ name: 'answer_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Answer,
        answer => answer.languages,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'answer_id', referencedColumnName: 'id' })
    answer: Answer;

    @ApiProperty({ description: "Text of this answer on this language", required: true })
    @Column({ length: 255, nullable: false })
	name: string;
}