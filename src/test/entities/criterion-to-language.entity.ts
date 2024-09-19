import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Criterion } from "./criterion.entity";
import { Language } from "./language.entity";

@Entity({ name: 'criteria_to_languages', engine: 'InnoDB' })
export class CriterionToLanguage {
    @PrimaryColumn({ name: 'language_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Language,
        language => language.criteria,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'language_id', referencedColumnName: 'id' })
    language: Language;

    @PrimaryColumn({ name: 'criterion_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Criterion,
        criterion => criterion.languages,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'criterion_id', referencedColumnName: 'id' })
    criterion: Criterion;

    @Column({ length: 255, nullable: false })
	name: string;

    @Column({ nullable: true, type: 'text' })
	description: string;
}