import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MethodToLanguage } from './method-to-language.entity';
import { Result } from './result.entity';
import { Indicator } from './indicator.entity';
import { AvailableMethod } from './available-method.entity';
import { Question } from './question.entity';

@Entity({ name: 'methods', engine: 'InnoDB' })
export class Method {
	@PrimaryGeneratedColumn()
	id: number;

    @Column({ nullable: true, type: 'int' })
    timer: number;

    @OneToMany(
		() => MethodToLanguage,
		methodToLanguage => methodToLanguage.method,
	)
	languages: MethodToLanguage[];

    @OneToMany(
		() => Result,
		result => result.method,
	)
	results: Result[];

    @OneToMany(
		() => Indicator,
		indicator => indicator.method,
	)
	indicators: Indicator[];

    @OneToMany(
		() => Question,
		question => question.method,
	)
	questions: Question[];

    @OneToMany(
		() => AvailableMethod,
		availableMethod => availableMethod.method,
	)
	availableStudents: AvailableMethod[];
}