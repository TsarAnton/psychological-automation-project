import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Not } from "typeorm";

import { Criterion } from "../entities/criterion.entity";
import { CreateCriterionDto, ReadOneCriterionDto, UpdateCriterionDto } from "../dto/criterion.dto";
import { ITransactionOptions } from "src/common/types/transaction.types";
import { createReadAllResultObject, ReadAllResult } from "src/common/types/read-all-result.types";
import { IReadAllCriteriaOptions } from "../types/criterion.options";
import { IndicatorService } from "./indicator.service";
import { LanguageService } from "./language.service";
import { CriterionToLanguage } from "../entities/criterion-to-language.entity";
import { BaseLanguagesService } from "./common/base-languages.service";
import { isPropertiesDefined } from "src/common/types/check-obj-properties.types";

@Injectable()
export class CriterionService extends BaseLanguagesService {
    constructor(
        protected dataSource: DataSource,
        @Inject(forwardRef(() => IndicatorService))
        private indicatorService: IndicatorService,
        protected languageService: LanguageService,
    ) {
        super(dataSource, languageService);
    }

    public async create(
        createCriterionDto: CreateCriterionDto,
        options: ITransactionOptions = {},
    ): Promise<Criterion> {
        return this.execInTransaction<Criterion>(async queryRunner => {
            const { languages, indicator, ...properties } = createCriterionDto;

            const existingIndicator = await this.indicatorService.readById(indicator, { queryRunner });
            if(existingIndicator === null) {
                throw new NotFoundException(`Indicator with id '${indicator}' does not exist`);
            }

            const overlappedCriteria = await this.readAll({
                filter: {
                    minValue: properties.minValue,
                    maxValue: properties.maxValue,
                    indicators: [indicator],
                },
                queryRunner: queryRunner,
            });

            if(overlappedCriteria.meta.entitiesCount > 0) {
                const overlappedCriterion = overlappedCriteria.entities[0];
                throw new BadRequestException(`Indicator '${existingIndicator.name}' has overlapped criteria intervals: ['${overlappedCriterion.minValue}':'${overlappedCriterion.maxValue}'] and ['${properties.minValue}':'${properties.minValue}']`);
            }

            await this.validateLanguages(languages.map(el => el.language), { queryRunner });

            const createdCriterion = await queryRunner.manager.save(Criterion, {
                indicator: existingIndicator,
                ...properties,
            });

            await queryRunner.manager.insert(CriterionToLanguage, languages.map(languageInfo => ({
                criterion: createdCriterion,
                language: { id: languageInfo.language },
                name: languageInfo.name,
                description: languageInfo.description,
            })));

            return this.readById(createdCriterion.id, { queryRunner });
            
        }, options);
    }

    public async readAll(
        options: IReadAllCriteriaOptions,
    ): Promise<ReadAllResult<Criterion>> {
        return this.execInTransaction<ReadAllResult<Criterion>>(async queryRunner => {

            const languages = options.filter?.languages ? options.filter.languages : [null];

            const queryBuilder = queryRunner.manager.createQueryBuilder();

            queryBuilder
                .select(['criterion.id', 'criterion.minValue', 'criterion.maxValue', 'criterion.alarming'])
                .from(Criterion, 'criterion')
                .leftJoin('criterion.languages', 'criterionLanguages', 'criterionLanguages.language.id IN (:...languages)', {
                    languages: languages,
                })
                .leftJoinAndSelect('criterionLanguages.language', 'criterionLanguage')
                .leftJoinAndSelect('criterion.indicator', 'indicator')
                .leftJoin('indicator.languages', 'indicatorLanguages', 'indicatorLanguages.language.id IN (:...languages)')
                .leftJoinAndSelect('indicatorLanguages.language', 'indicatorLanguage')
                .addSelect([ 
                    'criterionLanguages.name',
                    'criterionLanguages.description',
                    'indicatorLanguages.name',
                    'indicatorLanguages.description',
                ]);

            if(options.filter) {
                if(options.filter.ids) {
                    queryBuilder.andWhere('criterion.id IN (:...ids)', {
                        ids: options.filter.ids,
                    });
                }
                if(options.filter.indicators) {
                    queryBuilder.andWhere('criterion.indicator.id IN (:...indicators)', {
                        indicators: options.filter.indicators,
                    });
                }
                if(options.filter.alarming) {
                    queryBuilder.andWhere('criterion.alarming = :alarming', {
                        alarming: options.filter.alarming,
                    });
                }
                if(options.filter.minValue) {
                    queryBuilder.andWhere('criterion.minValue >= :minValue', {
                        minValue: options.filter.minValue,
                    });
                }
                if(options.filter.maxValue) {
                    queryBuilder.andWhere('criterion.minValue <= :maxValue', {
                        maxValue: options.filter.maxValue,
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

            return createReadAllResultObject<Criterion>(options, count, entities);

        }, options);
    }

    public async readById(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<Criterion> {
        return this.execInTransaction<Criterion>(async queryRunner => {
            const existingCriterion = await queryRunner.manager.createQueryBuilder()
                .select(['criterion.id', 'criterion.minValue', 'criterion.maxValue', 'criterion.alarming'])
                .from(Criterion, 'criterion')
                .leftJoin('criterion.languages', 'criterionLanguages')
                .leftJoinAndSelect('criterionLanguages.language', 'criterionLanguage')
                .leftJoinAndSelect('criterion.indicator', 'indicator')
                .leftJoin('indicator.languages', 'indicatorLanguages')
                .leftJoinAndSelect('indicatorLanguages.language', 'indicatorLanguage')
                .addSelect([ 
                    'criterionLanguages.name',
                    'criterionLanguages.description',
                    'indicatorLanguages.name',
                    'indicatorLanguages.description',
                ])
                .where('criterion.id = :id', {
                    id: id,
                })
                .getOne();
            
            if(existingCriterion === null) {
                throw new NotFoundException(`Criterion with id '${id}' does not exist`);
            }
            
            return existingCriterion;
        }, options);
    }

    public async update(
        id: number,
        updateCriterionDto: UpdateCriterionDto,
        options: ITransactionOptions = {},
    ): Promise<Criterion> {
        return this.execInTransaction<Criterion>(async queryRunner => {
            if(!isPropertiesDefined(updateCriterionDto)) {
                throw new BadRequestException(`One of properties must be defined`);
            }

            if(!(await queryRunner.manager.exists(Criterion, {
                where: { id },
            }))) {
                throw new NotFoundException(`Criterion with id '${id}' does not exist`);
            }

            const { languages, indicator, ...properties } = updateCriterionDto;

            if(indicator) {
                const existingIndicator = await this.indicatorService.readById(indicator, { queryRunner });
                if(existingIndicator === null) {
                    throw new NotFoundException(`Indicator with id '${indicator}' does not exist`);
                }
            }

            if(properties.minValue || properties.maxValue) {
                const existingCriterion = await this.readById(id, { queryRunner });

                const minValue = properties.minValue ? properties.minValue : existingCriterion.minValue;
                const maxValue = properties.maxValue ? properties.maxValue : existingCriterion.maxValue;
                const currentIndicator = indicator ? indicator : existingCriterion.indicator.id;

                let criteriaWithOverlappingIntervals = (await this.readAll({
                    filter: {
                        minValue: minValue,
                        maxValue: maxValue,
                        indicators: [ currentIndicator ]
                    },
                    queryRunner: queryRunner,
                })).entities;

                const currentCriterionIndex = criteriaWithOverlappingIntervals.findIndex(el => el.id === id);
                if(currentCriterionIndex !== -1) {
                    criteriaWithOverlappingIntervals = criteriaWithOverlappingIntervals.slice(0, currentCriterionIndex).concat(criteriaWithOverlappingIntervals.slice(currentCriterionIndex + 1, criteriaWithOverlappingIntervals.length));
                }

                if(criteriaWithOverlappingIntervals.length > 0) {
                    const overlappedCriterion = criteriaWithOverlappingIntervals[0];
                    throw new BadRequestException(`Criterion's interval ['${minValue}':'${maxValue}'] is overlapped with criterion's '${overlappedCriterion.id}' interval ['${overlappedCriterion.minValue}':'${overlappedCriterion.maxValue}']`);
                }
            }

            if(languages) {
                await this.validateLanguages(languages.map(el => el.language), { queryRunner });

                await queryRunner.manager.save(CriterionToLanguage, languages.map(languageInfo => ({
                    criterion: { id: id },
                    language: { id: languageInfo.language },
                    name: languageInfo.name,
                })));
            }

            if(indicator || isPropertiesDefined(properties)) {
                await queryRunner.manager.update(Criterion, id, {
                    indicator: indicator ? { id: indicator} : undefined,
                    ...properties,
                });
            }

            return this.readById(id, { queryRunner });
        }, options);
    }

    public async delete(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<void> {
        return this.execInTransaction<void>(async queryRunner => {
            const existingCriterion = await this.readById(id, { queryRunner });
            
            if(!existingCriterion) {
                throw new NotFoundException(`Criterion with id '${id}' does not exist`);
            }

            await queryRunner.manager.delete(CriterionToLanguage, { criterion: { id: id } });
            
            await queryRunner.manager.delete(Criterion, id);
        }, options);
    }

    public async readOneBy(
        readOneCriterionDto: ReadOneCriterionDto,
        options: ITransactionOptions = {},
    ): Promise<Criterion> {
        return this.execInTransaction<Criterion>(async queryRunner => {
            if(!isPropertiesDefined(readOneCriterionDto)) {
                throw new BadRequestException(`One of properties must be defined`);
            }

            const languages = readOneCriterionDto.languages ? readOneCriterionDto.languages : [null];

            const queryBuilder = queryRunner.manager.createQueryBuilder();

            queryBuilder
                .select(['criterion.id', 'criterion.minValue', 'criterion.maxValue', 'criterion.alarming'])
                .from(Criterion, 'criterion')
                .leftJoin('criterion.languages', 'criterionLanguages', 'criterionLanguages.language.id IN (:...languages)', {
                    languages: languages,
                })
                .leftJoinAndSelect('criterionLanguages.language', 'criterionLanguage')
                .leftJoinAndSelect('criterion.indicator', 'indicator')
                .leftJoin('indicator.languages', 'indicatorLanguages', 'indicatorLanguages.language.id IN (:...languages)')
                .leftJoinAndSelect('indicatorLanguages.language', 'indicatorLanguage')
                .addSelect([ 
                    'criterionLanguages.name',
                    'criterionLanguages.description',
                    'indicatorLanguages.name',
                    'indicatorLanguages.description',
                ]);
            
            if(readOneCriterionDto.alarming) {
                queryBuilder.andWhere('criterion.alarming = :alarming', {
                    alarming: readOneCriterionDto.alarming,
                });
            }
            if(readOneCriterionDto.id) {
                queryBuilder.andWhere('criterion.id = :id', {
                    id: readOneCriterionDto.id,
                });
            }
            if(readOneCriterionDto.indicator) {
                queryBuilder.andWhere('indicator.id = :indicator', {
                    indicator: readOneCriterionDto.indicator,
                });
            }
            if(readOneCriterionDto.maxValue) {
                queryBuilder.andWhere('criterion.maxValue <= :maxValue', {
                    maxValue: readOneCriterionDto.maxValue,
                });
            }
            if(readOneCriterionDto.minValue) {
                queryBuilder.andWhere('criterion.minValue >= :minValue', {
                    minValue: readOneCriterionDto.minValue,
                });
            }

            const existingCriterion = await queryBuilder.getOne();

            if(existingCriterion === null) {
                throw new NotFoundException(`Such criterion does not exist`);
            }
            
            return existingCriterion;
        }, options);
    }
}