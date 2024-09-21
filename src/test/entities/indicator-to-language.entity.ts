import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";

import { Indicator } from "./indicator.entity";
import { Language } from "./language.entity";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('Indicator', 'Language')
@Entity({ name: 'indicators_to_languages', engine: 'InnoDB' })
export class IndicatorToLanguage {
    @ApiProperty({ description: "Language related to this entity", required: true, type: () => Language })
    @PrimaryColumn({ name: 'language_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Language,
        language => language.indicators,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'language_id', referencedColumnName: 'id' })
    language: Language;

    @ApiProperty({ description: "Indicator related to this entity", required: true, type: () => Indicator })
    @PrimaryColumn({ name: 'indicator_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Indicator,
        indicator => indicator.languages,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'indicator_id', referencedColumnName: 'id' })
    indicator: Indicator;

    @ApiProperty({ description: "Name of this indicator on this language", required: true })
    @Column({ length: 255, nullable: false, unique: true })
	name: string;

    @ApiProperty({ description: "Description of this indicator on this language", required: false })
    @Column({ type: 'text', nullable: true })
	description: string;
}