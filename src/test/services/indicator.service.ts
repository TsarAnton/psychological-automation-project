import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Not } from "typeorm";

import { Indicator } from "../entities/indicator.entity";
import { CreateIndicatorDto, ReadOneIndicatorDto, UpdateIndicatorDto } from "../dto/indicator.dto";
import { ITransactionOptions } from "src/common/types/transaction.types";
import { createReadAllResultObject, ReadAllResult } from "src/common/types/read-all-result.types";
import { IReadAllIndicatorsOptions } from "../types/indicator.options";
import { BaseService } from "src/common/classes/base-service";
import { MethodService } from "./method.service";
import { LanguageService } from "./language.service";
import { IndicatorToLanguage } from "../entities/indicator-to-language.entity";
import { validateFormulas } from "../types/common/formula.options";
import { QuestionService } from "./question.service";
import { CriterionService } from "./criterion.service";
import { BaseLanguagesService } from "./common/base-languages.service";

@Injectable()
export class IndicatorService extends BaseLanguagesService {
    constructor(
        protected dataSource: DataSource,
        @Inject(forwardRef(() => MethodService))
        private methodService: MethodService,
        protected languageService: LanguageService,
        private questionService: QuestionService,
        @Inject(forwardRef(() => CriterionService))
        private criterionService: CriterionService,
    ) {
        super(dataSource, languageService);
    }

    public async create(
        createIndicatorDto: CreateIndicatorDto,
        options: ITransactionOptions = {},
        validatedFormula: string = undefined,
    ): Promise<Indicator> {
        return this.execInTransaction<Indicator>(async queryRunner => {
            const { languages, method, formula, ...properties } = createIndicatorDto;

            const newMethod = await this.methodService.readById(method, { queryRunner });
            if(newMethod === null) {
                throw new NotFoundException(`Method with id '${method}' does not exist`);
            }

            if((await queryRunner.manager.exists(Indicator, {
                where: {
                    name: properties.name,
                    method: { id: newMethod.id },
                }
            }))) {
                throw new BadRequestException(`Method with id '${method}' already has indicator '${properties.name}'`);
            }

            if(properties.display && languages === undefined) {
                throw new BadRequestException(`Indicator is displayed, but doesn't have name and description in any language`);
            }
            const realValidatedFormula = validatedFormula ? validatedFormula : await this.methodService.checkIndicatorsFormulas({
                id: method,
                indicators: (await this.readAll({
                    filter: {
                        methods: [method],
                    },
                    queryRunner: queryRunner,
                })).entities,
                newFormula: {
                    name: properties.name,
                    formula: formula,
                },
                queryRunner: queryRunner,
            })

            if(languages) {
                await this.validateLanguages(languages.map(el => el.language), { queryRunner });
            }

            const createdIndicator = await queryRunner.manager.save(Indicator, {
                method: newMethod,
                realFormula: formula,
                validatedFormula: realValidatedFormula,
                ...properties,
            });

            if(languages) {
                await queryRunner.manager.insert(IndicatorToLanguage, languages.map(languageInfo => ({
                    indicator: createdIndicator,
                    language: { id: languageInfo.language },
                    name: languageInfo.name,
                    description: languageInfo.description,
                })));
            }

            return this.readById(createdIndicator.id, { queryRunner });
        }, options);
    }

    public async readAll(
        options: IReadAllIndicatorsOptions,
    ): Promise<ReadAllResult<Indicator>> {
        return this.execInTransaction<ReadAllResult<Indicator>>(async queryRunner => {

            const languages = options.filter?.languages ? options.filter.languages : [null];

            const queryBuilder = queryRunner.manager.createQueryBuilder();

            queryBuilder
                .select(['indicator.id', 'indicator.realFormula', 'indicator.validatedFormula', 'indicator.display', 'indicator.name'])
                .from(Indicator, 'indicator')
                .leftJoin('indicator.languages', 'indicatorLanguages', 'indicatorLanguages.language.id IN (:...languages)', {
                    languages: languages,
                })
                .leftJoinAndSelect('indicatorLanguages.language', 'indicatorLanguage')
                .leftJoinAndSelect('indicator.method', 'method')
                .leftJoin('method.languages', 'methodLanguages', 'methodLanguages.language.id IN (:...languages)')
                .leftJoinAndSelect('methodLanguages.language', 'methodLanguage')
                .addSelect([
                    'indicatorLanguages.name',
                    'indicatorLanguages.description',
                    'methodLanguages.name',
                    'methodLanguages.description',
                ]);

            if(options.filter) {
                if(options.filter.ids) {
                    queryBuilder.andWhere('indicator.id IN (:...ids)', {
                        ids: options.filter.ids,
                    });
                }
                if(options.filter.methods) {
                    queryBuilder.andWhere('indicator.method.id IN (:...methods)', {
                        methods: options.filter.methods,
                    });
                }
                if(options.filter.results) {
                    queryBuilder.andWhere('indicator.results.result.id IN (:...results)', {
                        results: options.filter.results,
                    });
                }
                if(options.filter.display !== undefined) {
                    queryBuilder.andWhere('indicator.display = :display', {
                        display: options.filter.display,
                    });
                }
                if(options.filter.name) {
                    queryBuilder.andWhere('indicator.name LIKE :name', {
                        name: '%' + options.filter.name + '%',
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

            return createReadAllResultObject<Indicator>(options, count, entities);

        }, options);
    }

    public async readById(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<Indicator> {
        return this.execInTransaction<Indicator>(async queryRunner => {
                const existingIndicator = await queryRunner.manager.createQueryBuilder()
                .select(['indicator.id', 'indicator.realFormula', 'indicator.validatedFormula', 'indicator.display', 'indicator.name'])
                .from(Indicator, 'indicator')
                .leftJoin('indicator.languages', 'indicatorLanguages')
                .leftJoinAndSelect('indicatorLanguages.language', 'indicatorLanguage')
                .leftJoinAndSelect('indicator.method', 'method')
                .leftJoin('method.languages', 'methodLanguages')
                .leftJoinAndSelect('methodLanguages.language', 'methodLanguage')
                .addSelect([
                    'indicatorLanguages.name',
                    'indicatorLanguages.description',
                    'methodLanguages.name',
                    'methodLanguages.description',
                ])
                .where('indicator.id = :id', {
                    id: id,
                })
                .getOne();

            if(existingIndicator === null) {
                throw new NotFoundException(`Indicator with id '${id}' does not exist`);
            }
            
            return existingIndicator;
        }, options);
    }

    public async update(
        id: number,
        updateIndicatorDto: UpdateIndicatorDto,
        options: ITransactionOptions = {},
    ): Promise<Indicator> {
        return this.execInTransaction<Indicator>(async queryRunner => {

            const existingIndicator = await this.readById(id, { queryRunner });
            if(!existingIndicator) {
                throw new NotFoundException(`Indicator with id '${id}' does not exist`);
            }

            const { languages, formula, ...properties } = updateIndicatorDto;

            if(properties.name) {
                const currentMethod =  existingIndicator.method.id;
                if(await queryRunner.manager.exists(Indicator, {
                    where: {
                        id: Not(id),
                        name: properties.name,
                        method: { id: currentMethod },
                    },
                })) {
                    throw new BadRequestException(`Method with id '${currentMethod}' already has indicator '${properties.name}'`);
                }
            }

            if(updateIndicatorDto.display) {
                if(languages === undefined) {
                    if(!(await queryRunner.manager.exists(IndicatorToLanguage, {
                        where: {
                            indicator: { id: id },
                        },
                    }))) {
                        throw new BadRequestException(`Indicator is displayed, but doesn't have name and description in any language`);
                    }
                }
            }

            if(languages) {
                await this.validateLanguages(languages.map(el => el.language), { queryRunner });

                await queryRunner.manager.save(IndicatorToLanguage, languages.map(languageInfo => ({
                    indicator: { id: id },
                    language: { id: languageInfo.language },
                    name: languageInfo.name,
                    description: languageInfo.description,
                })));
            }

            let validatedFormula = undefined;
            //if formula or name has changed, checks if we need to update other formulas in method
            if(formula || properties.name) {
                const currentFormula = formula ? formula : existingIndicator.realFormula;
                const currentName = properties.name ? properties.name : existingIndicator.name;
                const currentMethod = existingIndicator.method.id;

                let currentIndicators = (await this.readAll({
                    filter: {
                        methods: [currentMethod],
                    },
                    queryRunner: queryRunner,
                })).entities;

                const currentQuestions = (await this.questionService.readAll({
                    filter: {
                        methods: [currentMethod],
                    },
                    queryRunner: queryRunner,
                })).entities;

                let formulas = currentIndicators.map(el => ({
                    name: el.id === id ? currentName : el.name,
                    formula: el.id === id ? currentFormula : el.realFormula,
                }));

                const validatedFormulas = validateFormulas(formulas, currentQuestions.map(el => el.index));
                validatedFormula = validatedFormulas[validatedFormulas.findIndex(el => el.name === currentName)].formula;

                for(let indicator of currentIndicators) {
                    const newValidatedFormula = validatedFormulas[validatedFormulas.findIndex(el => el.name === indicator.name)].formula;
                    if(indicator.validatedFormula !== newValidatedFormula) {
                        await queryRunner.manager.update(Indicator, indicator.id, {
                            validatedFormula: newValidatedFormula,
                        });
                    }
                }
            }
            
            await queryRunner.manager.update(Indicator, id, {
                realFormula: formula,
                validatedFormula: validatedFormula,
                ...properties,
            });

            return this.readById(id, { queryRunner });
        }, options);
    }

    public async delete(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<void> {
        return this.execInTransaction<void>(async queryRunner => {
            const existingIndicator = await queryRunner.manager.createQueryBuilder()
                .select('indicator.id')
                .from(Indicator, 'indicator')
                .leftJoinAndSelect('indicator.criteria', 'criteria')
                .where('indicator.id = :id', {
                    id: id,
                })
                .getOne();
            
            if(!existingIndicator) {
                throw new NotFoundException(`Indicator with id '${id}' does not exist`);
            }

            await queryRunner.manager.delete(IndicatorToLanguage, { indicator: existingIndicator });
            for(let criterion of existingIndicator.criteria) {
                await this.criterionService.delete(criterion.id, { queryRunner });
            }

            await queryRunner.manager.delete(Indicator, id);
        }, options);
    }

    public async readOneBy(
        readOneIndicatorDto: ReadOneIndicatorDto,
        options: ITransactionOptions = {},
    ): Promise<Indicator> {
        return this.execInTransaction<Indicator>(async queryRunner => {
            let isPropDefined = false;
            for(let prop in readOneIndicatorDto) {
                if(prop) {
                    isPropDefined = true;
                    break;
                }
            }
            if(!isPropDefined) {
                throw new BadRequestException(`One of properties must be defined`);
            }

            const languages = readOneIndicatorDto.languages ? readOneIndicatorDto.languages : [null];

            const queryBuilder = queryRunner.manager.createQueryBuilder();

            queryBuilder
                .select(['indicator.id', 'indicator.realFormula', 'indicator.validatedFormula', 'indicator.display', 'indicator.name'])
                .from(Indicator, 'indicator')
                .leftJoin('indicator.languages', 'indicatorLanguages', 'indicatorLanguages.language.id IN (:...languages)', {
                    languages: languages,
                })
                .leftJoinAndSelect('indicatorLanguages.language', 'indicatorLanguage')
                .leftJoinAndSelect('indicator.method', 'method')
                .leftJoin('method.languages', 'methodLanguages', 'methodLanguages.language.id IN (:...languages)')
                .leftJoinAndSelect('methodLanguages.language', 'methodLanguage')
                .addSelect([
                    'indicatorLanguages.name',
                    'indicatorLanguages.description',
                    'methodLanguages.name',
                    'methodLanguages.description',
                ]);

            if(readOneIndicatorDto.display) {
                queryBuilder.andWhere('indicator.display = :display', {
                    display: readOneIndicatorDto.display,
                });
            }
            if(readOneIndicatorDto.formula) {
                queryBuilder.andWhere('indicator.realFormula LIKE :formula', {
                    formula: '%' + readOneIndicatorDto.formula + '%',
                });
            }
            if(readOneIndicatorDto.method) {
                queryBuilder.andWhere('method.id = :method', {
                    method: readOneIndicatorDto.method,
                });
            }
            if(readOneIndicatorDto.name) {
                queryBuilder.andWhere('indicator.name LIKE :name', {
                    display: '%' + readOneIndicatorDto.name + '%',
                });
            }
            if(readOneIndicatorDto.id) {
                queryBuilder.andWhere('indicator.id = :id', {
                    id: readOneIndicatorDto.id,
                });
            }

            const existingIndicator = await queryBuilder.getOne();

            if(existingIndicator === null) {
                throw new NotFoundException(`Such indicator does not exist`);
            }
            
            return existingIndicator;
        }, options);
    }
}