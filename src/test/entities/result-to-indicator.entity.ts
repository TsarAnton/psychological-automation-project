import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Result } from "./result.entity";
import { Indicator } from "./indicator.entity";

@Entity({ name: 'results_to_indicators', engine: 'InnoDB' })
export class ResultToIndicator {
    @PrimaryColumn({ name: 'indicator_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Indicator,
        indicator => indicator.results,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'indicator_id', referencedColumnName: 'id' })
    indicator: Indicator;

    @PrimaryColumn({ name: 'result_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Result,
        result => result.indicators,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'result_id', referencedColumnName: 'id' })
    result: Result;

    @Column({ nullable: false })
	score: number;
}