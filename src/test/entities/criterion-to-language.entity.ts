import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Criterion } from "./criterion.entity";
import { Language } from "./language.entity";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('Criterion', 'Language')
@Entity({ name: 'criteria_to_languages', engine: 'InnoDB' })
export class CriterionToLanguage {
    @ApiProperty({ description: "Language related to this entity", required: true, type: () => Language })
    @PrimaryColumn({ name: 'language_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Language,
        language => language.criteria,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'language_id', referencedColumnName: 'id' })
    language: Language;

    @ApiProperty({ description: "Criterion related to this entity", required: true, type: () => Criterion })
    @PrimaryColumn({ name: 'criterion_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Criterion,
        criterion => criterion.languages,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'criterion_id', referencedColumnName: 'id' })
    criterion: Criterion;

    @ApiProperty({ description: "Name of this criterion on this language", required: true })
    @Column({ length: 255, nullable: false })
	name: string;

    @ApiProperty({ description: "Description of this criterion on this language", required: false })
    @Column({ nullable: true, type: 'text' })
	description: string;
}