import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Method } from './method.entity';
import { IndicatorToLanguage } from './indicator-to-language.entity';
import { ResultToIndicator } from './result-to-indicator.entity';
import { Criterion } from './criterion.entity';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Indicator')
@Entity({ name: 'indicators', engine: 'InnoDB' })
export class Indicator {
	@ApiProperty({ description: "Indicator id", required: true })
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ description: "Indicator formula that has provided by user", required: true })
	@Column({ length: 255, nullable: false, name: 'real_formula' })
	realFormula: string;

	@ApiProperty({ description: "Indicator formula that is used in app", required: true })
	@Column({ length: 255, nullable: false, name: 'validated_formula' })
	validatedFormula: string;

	@ApiProperty({ description: "Indicator name that is used in formulas", required: true })
	@Column({ length: 255, nullable: false })
	name: string;

	@ApiProperty({ description: "If this indicator is displayed to user", required: true })
	@Column({ type: 'bool', nullable: false })
	display: number;

	@ApiProperty({ description: "Method related to this indicator", required: true, type: () => Method })
    @ManyToOne(
		() => Method,
		method => method.indicators,
		{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
	)
	@JoinColumn({ name: 'method_id', referencedColumnName: 'id' })
	method: Method;

	@ApiProperty({ description: "Array of AnswerToLanguage entities related to this indicator", required: false, type: [() => IndicatorToLanguage] })
    @OneToMany(
		() => IndicatorToLanguage,
		indicatorToLanguage => indicatorToLanguage.indicator,
	)
	languages: IndicatorToLanguage[];

	@ApiProperty({ description: "Array of ResultToIndicator entities related to this indicator", required: true, type: [() => ResultToIndicator] })
    @OneToMany(
		() => ResultToIndicator,
		resultToIndicator => resultToIndicator.indicator,
	)
	results: ResultToIndicator[];

	@ApiProperty({ description: "Array of criteria related to this indicator", required: false, type: [() => Criterion] })
    @OneToMany(
		() => Criterion,
		criterion => criterion.indicator,
	)
	criteria: Criterion[];
}