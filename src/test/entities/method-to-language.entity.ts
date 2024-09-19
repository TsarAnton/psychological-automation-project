import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Method } from "./method.entity";
import { Language } from "./language.entity";

@Entity({ name: 'methods_to_languages', engine: 'InnoDB' })
export class MethodToLanguage {
    @PrimaryColumn({ name: 'language_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Language,
        language => language.methods,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'language_id', referencedColumnName: 'id' })
    language: Language;

    @PrimaryColumn({ name: 'method_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Method,
        method => method.languages,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'method_id', referencedColumnName: 'id' })
    method: Method;

    @Column({ length: 255, nullable: false })
	name: string;

    @Column({ nullable: true, type: 'text' })
	description: string;
}