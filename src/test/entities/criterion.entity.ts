import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Indicator } from './indicator.entity';
import { CriterionToLanguage } from './criterion-to-language.entity';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Criterion')
@Entity({ name: 'criteria', engine: 'InnoDB' })
export class Criterion {
	@ApiProperty({ description: "Criterion id", required: true })
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ description: "Alarming level of this criterion", required: true })
	@Column({ type: "tinyint", nullable: false })
	alarming: number;

	@ApiProperty({ description: "Criterion min value", required: true })
    @Column({ name: "min_value", type: "int", nullable: false })
	minValue: number;

	@ApiProperty({ description: "Criterion max value", required: true })
    @Column({ name: "max_value", type: "int", nullable: false })
	maxValue: number;

	@ApiProperty({ description: "Array of AnswerToLanguage entities related to this criterion", required: false, type: [() => CriterionToLanguage] })
    @OneToMany(
		() => CriterionToLanguage,
		criterionToLanguage => criterionToLanguage.criterion,
	)
	languages: CriterionToLanguage[];

	@ApiProperty({ description: "Indicator related to this criterion", required: true, type: () => Indicator })
    @ManyToOne(
		() => Indicator,
		indicator => indicator.criteria,
		{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
	)
	@JoinColumn({ name: 'indicator_id', referencedColumnName: 'id' })
	indicator: Indicator;
}