import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Indicator } from './indicator.entity';
import { CriterionToLanguage } from './criterion-to-language.entity';

@Entity({ name: 'criteria', engine: 'InnoDB' })
export class Criterion {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "tinyint", nullable: false })
	alarming: number;

    @Column({ name: "min_value", type: "int", nullable: false })
	minValue: number;

    @Column({ name: "max_value", type: "int", nullable: false })
	maxValue: number;

    @OneToMany(
		() => CriterionToLanguage,
		criterionToLanguage => criterionToLanguage.criterion,
	)
	languages: CriterionToLanguage[];

    @ManyToOne(
		() => Indicator,
		indicator => indicator.criteria,
		{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
	)
	@JoinColumn({ name: 'indicator_id', referencedColumnName: 'id' })
	indicator: Indicator;
}