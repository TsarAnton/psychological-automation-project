import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Not } from "typeorm";

import { Method } from "../entities/method.entity";
import { CreateMethodDto, UpdateMethodDto } from "../dto/method.dto";
import { ITransactionOptions } from "src/common/types/transaction.types";
import { createReadAllResultObject, ReadAllResult } from "src/common/types/read-all-result.types";
import { ICheckIndicatorOptions, IReadAllMethodsOptions } from "../types/method.options";
import { LanguageService } from "./language.service";
import { MethodToLanguage } from "../entities/method-to-language.entity";
import { QuestionService } from "./question.service";
import { IndicatorService } from "./indicator.service";
import { Result } from "../entities/result.entity";
import { AnswerService } from "./answer.service";
import { validateFormulas } from "../types/common/formula.options";
import { CriterionService } from "./criterion.service";
import { FacultyService } from "src/student/services/faculty.service";
import { GroupService } from "src/student/services/group.service";
import { StudentService } from "src/student/services/student.service";
import { AvailableMethod } from "../entities/available-method.entity";
import { BaseLanguagesService } from "./common/base-languages.service";
import { Cron } from "@nestjs/schedule";
import { ResultService } from "./result.service";

@Injectable()
export class MethodService extends BaseLanguagesService {
    constructor(
        protected dataSource: DataSource,
        protected languageService: LanguageService,
        @Inject(forwardRef(() => QuestionService))
        private questionService: QuestionService,
        @Inject(forwardRef(() => IndicatorService))
        private indicatorService: IndicatorService,
        private answerService: AnswerService,
        private criterionService: CriterionService,
        private facultyService: FacultyService,
        private groupService: GroupService,
        private studentService: StudentService,
        @Inject(forwardRef(() => ResultService))
        private resultService: ResultService,
    ) {
        super(dataSource, languageService);
    }

    public async create(
        createMethodDto: CreateMethodDto,
        options: ITransactionOptions = {},
    ): Promise<Method> {
        return this.execInTransaction<Method>(async queryRunner => {
            const { languages, ...properties } = createMethodDto;

            await this.validateLanguages(languages.map(el => el.language), { queryRunner });

            const createdMethod = await queryRunner.manager.save(Method, properties);

            await queryRunner.manager.insert(MethodToLanguage, languages.map(el => ({
                method: createdMethod,
                language: { id: el.language },
                name: el.name,
                description: el.description,
            })));
            
            return this.readById(createdMethod.id, { queryRunner });
        }, options);
    }

    public async readAll(
        options: IReadAllMethodsOptions,
    ): Promise<ReadAllResult<Method>> {
        return this.execInTransaction<ReadAllResult<Method>>(async queryRunner => {

            const languages = options.filter?.languages ? options.filter.languages : [null];

            const queryBuilder = queryRunner.manager.createQueryBuilder();

            queryBuilder
                .select(['method.id', 'method.timer'])                
                .from(Method, 'method')
                .leftJoin('method.languages', 'languages', 'languages.language.id IN (:...languages)', {
                    languages: languages,
                })
                .leftJoinAndSelect('languages.language', 'language')
                .addSelect([
                    'languages.name', 
                    'languages.description',
                ]);

            if(options.filter) {
                if(options.filter.ids) {
                    queryBuilder.andWhere('method.id IN (:...ids)', {
                        ids: options.filter.ids,
                    })
                }
                if(options.filter.results) {
                    queryBuilder.andWhere('method.results.id IN (:...results)', {
                        results: options.filter.results,
                    })
                }
            }

            if(options.sorting) {
                queryBuilder.orderBy(options.sorting.column, options.sorting.direction);
            }

            if(options.pagination) {
                queryBuilder.skip(options.pagination.page * options.pagination.size).take(options.pagination.size);
            }

            const [ entities, count ] = await queryBuilder.getManyAndCount();

            return createReadAllResultObject<Method>(options, count, entities);

        }, options);
    }

    public async readById(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<Method> {
        return this.execInTransaction<Method>(async queryRunner => {
            const existingMethod = await queryRunner.manager.createQueryBuilder()
                .select(['method.id', 'method.timer'])                
                .from(Method, 'method')
                .leftJoin('method.languages', 'languages')
                .leftJoinAndSelect('languages.language', 'language')
                .addSelect([
                    'languages.name', 
                    'languages.description',
                ])
                .where('method.id = :id', {
                    id: id,
                })
                .getOne();
            if(existingMethod === null) {
                throw new NotFoundException(`Method with id '${id}' does not exist`);
            }
            
            return existingMethod;
        }, options);
    }

    public async update(
        id: number,
        updateMethodDto: UpdateMethodDto,
        options: ITransactionOptions = {},
    ): Promise<Method> {
        return this.execInTransaction<Method>(async queryRunner => {

            if(!(await queryRunner.manager.exists(Method, {
                where: { id },
            }))) {
                throw new NotFoundException(`Method with id '${id}' does not exist`);
            }

            const { languages, ...properties } = updateMethodDto;

            if(languages) {
                await this.validateLanguages(languages.map(el => el.language), { queryRunner });

                await queryRunner.manager.save(MethodToLanguage, languages.map(el => ({
                    language: { id: el.language },
                    method: { id: id },
                    name: el.name,
                    description: el.description,
                })))
            }

            await queryRunner.manager.update(Method, id, properties);

            return this.readById(id, { queryRunner });
        }, options);
    }

    public async delete(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<void> {
        return this.execInTransaction<void>(async queryRunner => {
            const existingMethod = await queryRunner.manager.createQueryBuilder()
                .select('method.id')
                .from(Method, 'method')
                .leftJoinAndSelect('method.questions', 'questions')
                .leftJoinAndSelect('method.indicators', 'indicators')
                .leftJoinAndSelect('method.results', 'results')
                .where('method.id = :id', {
                    id: id,
                })
                .getOne();

            if(!existingMethod) {
                throw new NotFoundException(`Method with id '${id}' does not exist`);
            }

            await queryRunner.manager.delete(MethodToLanguage, { method: existingMethod });
            for(let result of existingMethod.results) {
                await this.resultService.delete(result.id, { queryRunner });
            }
            for(let question of existingMethod.questions) {
                await this.questionService.delete(question.id, { queryRunner });
            }
            for(let indicator of existingMethod.indicators) {
                await this.indicatorService.delete(indicator.id, { queryRunner });
            }

            await queryRunner.manager.delete(Method, id);
        }, options);
    }

    async checkIndicatorsFormulas(
        options: ICheckIndicatorOptions,
    ): Promise<string> {
        return this.execInTransaction<string>(async queryRunner => {

            const existingQuestions = (await this.questionService.readAll({
                filter: {
                    methods: [options.id],
                },
                queryRunner: queryRunner,
            })).entities;

            let formulas = options.indicators.map(el => ({
                name: el.name,
                formula: el.realFormula,
            }));
            
            if(options.newFormula) {
                formulas.push(options.newFormula);
            }

            const validatedFormulas = validateFormulas(formulas, existingQuestions.map(el => el.index));

            return options.newFormula ? validatedFormulas.pop().formula : null;
        }, options);
    }

    //every minute delete available methods which date end has expired
    @Cron('00 * * * * *')
    private async deleteExpiredAvailableMethod(
        options: ITransactionOptions = {},
    ): Promise<void> {
        await this.execInTransaction<void>(async queryRunner => {
            await queryRunner.manager.createQueryBuilder()
                .delete()
                .from(AvailableMethod, 'availableMethod')
                .where('dateEnd <= :currentDate', {
                    currentDate: new Date(Date.now()),
                })
                .execute();
        }, options);
    }

}