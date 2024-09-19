import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Not } from "typeorm";

import { Result } from "../entities/result.entity";
import { CreateResultDto, ReadFullResultsDto, UpdateResultDto } from "../dto/result.dto";
import { ITransactionOptions } from "src/common/types/transaction.types";
import { createReadAllResultObject, ReadAllResult } from "src/common/types/read-all-result.types";
import { IReadAllResultsOptions } from "../types/result.options";
import { AnswerService } from "./answer.service";
import { StudentService } from "src/student/services/student.service";
import { BaseService } from "src/common/classes/base-service";
import { MethodService } from "./method.service";
import { ResultToAnswer } from "../entities/result-to-answer.entity";
import { IndicatorService } from "./indicator.service";
import { ResultToIndicator } from "../entities/result-to-indicator.entity";
import { evaluate } from "mathjs";

@Injectable()
export class ResultService extends BaseService {
    constructor(
        protected dataSource: DataSource,
        @Inject(forwardRef(() => AnswerService))
        private answerService: AnswerService,
        private studentService: StudentService,
        @Inject(forwardRef(() => MethodService))
        private methodService: MethodService,
        private indicatorService: IndicatorService,
    ) {
        super(dataSource);
    }

    public async create(
        createResultDto: CreateResultDto,
        options: ITransactionOptions = {},
    ): Promise<Result> {
        return this.execInTransaction<Result>(async queryRunner => {
            const { student, answers, method, ...properties } = createResultDto;

            const existingStudent = await this.studentService.readById(student, { queryRunner });
            if(existingStudent === null) {
                throw new NotFoundException(`Student with id '${student}' does not exist`);
            }

            const existingMethod = await this.methodService.readById(method, { queryRunner });
            if(existingMethod === null) {
                throw new NotFoundException(`Method with id '${student}' does not exist`);
            }

            if(new Set(answers).size !== answers.length) {
                throw new BadRequestException(`Answers array has duplicate language values`);
            }

            const existingAnswers = (await this.answerService.readAll({
                filter: {
                    ids: answers,
                },
                sorting: {
                    column: "question.index",
                    direction: 'ASC',
                },
                queryRunner: queryRunner,
            })).entities;

            if(answers.length !== existingAnswers.length) {
                throw new BadRequestException(`One or several answers of answers array do not exist`);
            }

            const createdResult = await queryRunner.manager.save(Result, {
                student: { id: student },
                method: { id: method },
                date: new Date(Date.now()),
                ...properties,
            });

            await queryRunner.manager.insert(ResultToAnswer, answers.map(el => ({
                result: { id: createdResult.id },
                answer: { id: el },
            })));

            const indicators = (await this.indicatorService.readAll({
                filter: {
                    methods: [method],
                },
                queryRunner: queryRunner,
            })).entities;

            const answerPoints = existingAnswers.map(el => el.point);

            await queryRunner.manager.insert(ResultToIndicator, indicators.map(el => ({
                result: { id: createdResult.id },
                indicator: { id: el.id },
                score: evaluate(el.validatedFormula, {
                    answers: answerPoints,
                }),
            })))

            return this.readById(createdResult.id, { queryRunner });
            
        }, options);
    }

    public async readAll(
        options: IReadAllResultsOptions,
    ): Promise<ReadAllResult<Result>> {
        return this.execInTransaction<ReadAllResult<Result>>(async queryRunner => {

            const languages = options.filter?.languages ? options.filter.languages : [null];

            const queryBuilder = queryRunner.manager.createQueryBuilder();

            queryBuilder
                .select(['result.id', 'result.date', 'result.display'])
                .from(Result, 'result')
                .leftJoinAndSelect('result.method', 'method')
                .leftJoin('method.languages', 'methodLanguages', 'methodLanguages.language.id IN (:...languages)', {
                    languages: languages,
                })
                .leftJoinAndSelect('methodLanguages.language', 'methodLanguage')
                .leftJoin('result.indicators', 'indicators')
                .leftJoinAndSelect('indicators.indicator', 'indicator')
                .leftJoin('indicator.languages', 'indicatorLanguages', 'indicatorLanguages.language.id IN (:...languages)')
                .leftJoinAndSelect('indicatorLanguages.language', 'indicatorLanguage')
                .leftJoinAndSelect('indicator.criteria', 'criteria', 'criteria.minValue <= indicators.score AND criteria.maxValue >= indicators.score')
                .leftJoin('criteria.languages', 'criteriaLanguages', 'criteriaLanguages.language.id IN (:...languages)')
                .leftJoinAndSelect('criteriaLanguages.language', 'criteriaLanguage')
                .leftJoinAndSelect('result.student', 'student')
                .leftJoinAndSelect('student.group', 'group')
                .leftJoinAndSelect('group.faculty', 'faculty')
                .addSelect([ 
                    'indicators.score',
                    'indicatorLanguages.name',
                    'indicatorLanguages.description',
                    'criteriaLanguages.name',
                    'criteriaLanguages.description',
                    'methodLanguages.name',
                    'methodLanguages.description',
                ]);

            if(options.filter) {
                if(options.filter.date) {
                    queryBuilder.andWhere('result.date = :date', {
                        date: options.filter.date,
                    });
                }
                if(options.filter.period) {
                    if(options.filter.period.minDate) {
                        queryBuilder.andWhere('result.date >= :minDate', {
                            dateEnd: options.filter.period.minDate,
                        });
                    }
                    if(options.filter.period.maxDate) {
                        queryBuilder.andWhere('result.date <= :maxDate', {
                            maxDate: options.filter.period.maxDate,
                        });
                    }
                }
                if(options.filter.alarming) {
                    queryBuilder.andWhere('criteria.alarming = :alarming', {
                        alarming: options.filter.alarming,
                    });
                }
                if(options.filter.display) {
                    queryBuilder.andWhere('result.display = :display', {
                        display: options.filter.display,
                    });
                }
                if(options.filter.ids) {
                    queryBuilder.andWhere('result.id IN (:...ids)', {
                        ids: options.filter.ids,
                    });
                }
                if(options.filter.students) {
                    queryBuilder.andWhere('student.id IN (:...students)', {
                        students: options.filter.students,
                    });
                }
                if(options.filter.groups) {
                    queryBuilder.andWhere('group.id IN (:...groups)', {
                        groups: options.filter.groups,
                    });
                }
                if(options.filter.faculties) {
                    queryBuilder.andWhere('faculty.id IN (:...faculties)', {
                        faculties: options.filter.faculties,
                    });
                }
                if(options.filter.methods) {
                    queryBuilder.andWhere('method.id IN (:...methods)', {
                        methods: options.filter.methods,
                    });
                }
                if(options.filter.indicators) {
                    queryBuilder.andWhere('indicator.id IN (:...indicators)', {
                        indicators: options.filter.indicators,
                    });
                }
            }

            if(options.sorting) {
                queryBuilder.orderBy(options.sorting.column, options.sorting.direction);
            }

            if(options.pagination) {
                queryBuilder.skip(options.pagination.page * options.pagination.size).take(options.pagination.size);
            }

            const [ entities, count ] = await queryBuilder.getManyAndCount();

            return createReadAllResultObject<Result>(options, count, entities);

        }, options);
    }

    public async readById(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<Result> {
        return this.execInTransaction<Result>(async queryRunner => {
            const existingResult = await queryRunner.manager.createQueryBuilder()
                .select(['result.id', 'result.date', 'result.display'])
                .from(Result, 'result')
                .leftJoinAndSelect('result.method', 'method')
                .leftJoin('method.languages', 'methodLanguages')
                .leftJoinAndSelect('methodLanguages.language', 'methodLanguage')
                .leftJoin('result.indicators', 'indicators')
                .leftJoinAndSelect('indicators.indicator', 'indicator')
                .leftJoin('indicator.languages', 'indicatorLanguages')
                .leftJoinAndSelect('indicatorLanguages.language', 'indicatorLanguage')
                .leftJoinAndSelect('indicator.criteria', 'criteria', 'criteria.minValue <= indicators.score AND criteria.maxValue >= indicators.score')
                .leftJoin('criteria.languages', 'criteriaLanguages')
                .leftJoinAndSelect('criteriaLanguages.language', 'criteriaLanguage')
                .leftJoinAndSelect('result.student', 'student')
                .leftJoinAndSelect('student.group', 'group')
                .leftJoinAndSelect('group.faculty', 'faculty')
                .addSelect([ 
                    'indicators.score',
                    'indicatorLanguages.name',
                    'indicatorLanguages.description',
                    'criteriaLanguages.name',
                    'criteriaLanguages.description',
                    'methodLanguages.name',
                    'methodLanguages.description',
                ])
                .where('result.id = :id', {
                    id: id,
                })
                .getOne();
            
            if(existingResult === null) {
                throw new NotFoundException(`Result with id '${id}' does not exist`);
            }
            
            return existingResult;
        }, options);
    }

    public async update(
        id: number,
        updateResultDto: UpdateResultDto,
        options: ITransactionOptions = {},
    ): Promise<Result> {
        return this.execInTransaction<Result>(async queryRunner => {

            if(!(await queryRunner.manager.exists(Result, {
                where: { id },
            }))) {
                throw new NotFoundException(`Result with id '${id}' does not exist`);
            }

            await queryRunner.manager.update(Result, id, updateResultDto);

            return this.readById(id, { queryRunner });
        }, options);
    }

    public async delete(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<void> {
        return this.execInTransaction<void>(async queryRunner => {
            const existingResult = await this.readById(id, { queryRunner });
            
            if(!existingResult) {
                throw new NotFoundException(`Result with id '${id}' does not exist`);
            }

            await queryRunner.manager.delete(ResultToAnswer, { result: { id: id } });
            await queryRunner.manager.delete(ResultToIndicator, { result: { id: id }});
            
            await queryRunner.manager.delete(Result, id);
        }, options);
    }

    public async readFullById(
        readFullResultDto: ReadFullResultsDto,
        options: ITransactionOptions = {},
    ): Promise<Result> {
        return this.execInTransaction<Result>(async queryRunner => {
            const existingResult = await queryRunner.manager.createQueryBuilder()
                .select(['result.id', 'result.date', 'result.display'])
                .from(Result, 'result')
                .leftJoinAndSelect('result.method', 'method')
                .leftJoin('method.languages', 'methodLanguages', 'methodLanguages.language.id IN (:...languages)', {
                    languages: readFullResultDto.languages,
                })
                .leftJoinAndSelect('methodLanguages.language', 'methodLanguage')
                .leftJoin('result.indicators', 'indicators')
                .leftJoinAndSelect('indicators.indicator', 'indicator')
                .leftJoin('indicator.languages', 'indicatorLanguages', 'indicatorLanguages.language.id IN (:...languages)')
                .leftJoinAndSelect('indicatorLanguages.language', 'indicatorLanguage')
                .leftJoinAndSelect('indicator.criteria', 'criteria', 'criteria.minValue <= indicators.score AND criteria.maxValue >= indicators.score')
                .leftJoin('criteria.languages', 'criteriaLanguages', 'criteriaLanguages.language.id IN (:...languages)')
                .leftJoinAndSelect('criteriaLanguages.language', 'criteriaLanguage')
                .leftJoinAndSelect('result.student', 'student')
                .leftJoinAndSelect('student.group', 'group')
                .leftJoinAndSelect('group.faculty', 'faculty')
                .leftJoinAndSelect('result.answers', 'answers')
                .leftJoin('answers.languages', 'answersLanguages', 'answersLanguages.language.id IN (:...languages)')
                .leftJoinAndSelect('answersLanguages.language', 'answersLanguage')
                .leftJoinAndSelect('answers.question', 'question')
                .leftJoin('question.languages', 'questionLanguages', 'questionLanguages.language.id IN (:...languages)')
                .leftJoinAndSelect('questionLanguages.language', 'questionLanguage')
                .addSelect([ 
                    'indicators.score',
                    'indicatorLanguages.name',
                    'indicatorLanguages.description',
                    'criteriaLanguages.name',
                    'criteriaLanguages.description',
                    'methodLanguages.name',
                    'methodLanguages.description',
                    'answersLanguages.name',
                    'questionLanguages.name',
                ])
                .where('result.id = :id', {
                    id: readFullResultDto.id,
                })
                .getOne();

            if(!existingResult) {
                throw new NotFoundException(`Result with id '${readFullResultDto.id}' does not exist`);
            }

            return existingResult;
        }, options);
    }
}