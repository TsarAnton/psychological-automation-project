import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MethodToLanguage } from './method-to-language.entity';
import { Result } from './result.entity';
import { Indicator } from './indicator.entity';
import { AvailableMethod } from './available-method.entity';
import { Question } from './question.entity';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Method')
@Entity({ name: 'methods', engine: 'InnoDB' })
export class Method {
	@ApiProperty({ description: "Method id", required: true })
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ description: "Time in milliseconds for performing this method", required: true })
    @Column({ nullable: true, type: 'int' })
    timer: number;

	@ApiProperty({ description: "Array of AnswerToLanguage entities related to this method", required: false, type: [() => MethodToLanguage] })
    @OneToMany(
		() => MethodToLanguage,
		methodToLanguage => methodToLanguage.method,
	)
	languages: MethodToLanguage[];

	@ApiProperty({ description: "Array of result related to this method", required: false, type: [() => Result] })
    @OneToMany(
		() => Result,
		result => result.method,
	)
	results: Result[];

	@ApiProperty({ description: "Array of indicators related to this method", required: false, type: [() => Indicator] })
    @OneToMany(
		() => Indicator,
		indicator => indicator.method,
	)
	indicators: Indicator[];

	@ApiProperty({ description: "Array of questions entities related to this method", required: false, type: [Question] })
    @OneToMany(
		() => Question,
		question => question.method,
	)
	questions: Question[];

	@ApiProperty({ description: "Students that can perform this method", required: false, type: [() => AvailableMethod] })
    @OneToMany(
		() => AvailableMethod,
		availableMethod => availableMethod.method,
	)
	availableStudents: AvailableMethod[];
}