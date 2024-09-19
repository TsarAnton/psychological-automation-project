import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Method } from './method.entity';
import { IndicatorToLanguage } from './indicator-to-language.entity';
import { ResultToIndicator } from './result-to-indicator.entity';
import { Criterion } from './criterion.entity';

@Entity({ name: 'indicators', engine: 'InnoDB' })
export class Indicator {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 255, nullable: false, name: 'real_formula' })
	realFormula: string;

	@Column({ length: 255, nullable: false, name: 'validated_formula' })
	validatedFormula: string;

	@Column({ length: 255, nullable: false })
	name: string;

	@Column({ type: 'bool', nullable: false })
	display: number;

    @ManyToOne(
		() => Method,
		method => method.indicators,
		{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
	)
	@JoinColumn({ name: 'method_id', referencedColumnName: 'id' })
	method: Method;

    @OneToMany(
		() => IndicatorToLanguage,
		indicatorToLanguage => indicatorToLanguage.indicator,
	)
	languages: IndicatorToLanguage[];

    @OneToMany(
		() => ResultToIndicator,
		resultToIndicator => resultToIndicator.indicator,
	)
	results: ResultToIndicator[];

    @OneToMany(
		() => Criterion,
		criterion => criterion.indicator,
	)
	criteria: Criterion[];
}