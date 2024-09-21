import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Method } from "./method.entity";
import { Language } from "./language.entity";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('Method', 'Language')
@Entity({ name: 'methods_to_languages', engine: 'InnoDB' })
export class MethodToLanguage {
    @ApiProperty({ description: "Language related to this entity", required: true, type: () => Language })
    @PrimaryColumn({ name: 'language_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Language,
        language => language.methods,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'language_id', referencedColumnName: 'id' })
    language: Language;

    @ApiProperty({ description: "Method related to this entity", required: true, type: () => Method })
    @PrimaryColumn({ name: 'method_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Method,
        method => method.languages,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'method_id', referencedColumnName: 'id' })
    method: Method;

    @ApiProperty({ description: "Name of this method on this language", required: true })
    @Column({ length: 255, nullable: false })
	name: string;

    @ApiProperty({ description: "Description of this indicator on this language", required: false })
    @Column({ nullable: true, type: 'text' })
	description: string;
}