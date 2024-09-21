import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Result } from "./result.entity";
import { Indicator } from "./indicator.entity";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('Result', 'Indicator')
@Entity({ name: 'results_to_indicators', engine: 'InnoDB' })
export class ResultToIndicator {
    @ApiProperty({ description: "Indicator related to this entity", required: true, type: () => Indicator })
    @PrimaryColumn({ name: 'indicator_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Indicator,
        indicator => indicator.results,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'indicator_id', referencedColumnName: 'id' })
    indicator: Indicator;

    @ApiProperty({ description: "Result related to this entity", required: true, type: () => Result })
    @PrimaryColumn({ name: 'result_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Result,
        result => result.indicators,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'result_id', referencedColumnName: 'id' })
    result: Result;

    @ApiProperty({ description: "Score perfomed by user in this indicator", required: true })
    @Column({ nullable: false })
	score: number;
}