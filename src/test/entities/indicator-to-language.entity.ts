import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";

import { Indicator } from "./indicator.entity";
import { Language } from "./language.entity";

@Entity({ name: 'indicators_to_languages', engine: 'InnoDB' })
export class IndicatorToLanguage {
    @PrimaryColumn({ name: 'language_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Language,
        language => language.indicators,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'language_id', referencedColumnName: 'id' })
    language: Language;

    @PrimaryColumn({ name: 'indicator_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Indicator,
        indicator => indicator.languages,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'indicator_id', referencedColumnName: 'id' })
    indicator: Indicator;

    @Column({ length: 255, nullable: false, unique: true })
	name: string;

    @Column({ type: 'text', nullable: true })
	description: string;
}