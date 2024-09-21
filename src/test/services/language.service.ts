import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Not } from "typeorm";

import { Language } from "../entities/language.entity";
import { CreateLanguageDto, ReadOneLanguageDto, UpdateLanguageDto } from "../dto/language.dto";
import { ITransactionOptions } from "src/common/types/transaction.types";
import { createReadAllResultObject, ReadAllResult } from "src/common/types/read-all-result.types";
import { IReadAllLanguagesOptions } from "../types/language.options";
import { BaseService } from "src/common/classes/base-service";
import { AnswerToLanguage } from "../entities/answer-to-language.entity";
import { CriterionToLanguage } from "../entities/criterion-to-language.entity";
import { IndicatorToLanguage } from "../entities/indicator-to-language.entity";
import { MethodToLanguage } from "../entities/method-to-language.entity";
import { QuestionToLanguage } from "../entities/question-to-language.entity";

@Injectable()
export class LanguageService extends BaseService {
    constructor(
        protected dataSource: DataSource,
    ) {
        super(dataSource);
    }

    public async create(
        createLanguageDto: CreateLanguageDto,
        options: ITransactionOptions = {},
    ): Promise<Language> {
        return this.execInTransaction<Language>(async queryRunner => {
            if(await queryRunner.manager.exists(Language, {
                where: {
                    name: createLanguageDto.name,
                }
            })) {
                throw new BadRequestException(`Language with name '${createLanguageDto.name}' already exists`);
            }
            
            return queryRunner.manager.save(Language, createLanguageDto);
        }, options);
    }

    public async readAll(
        options: IReadAllLanguagesOptions,
    ): Promise<ReadAllResult<Language>> {
        return this.execInTransaction<ReadAllResult<Language>>(async queryRunner => {

            const queryBuilder = queryRunner.manager.createQueryBuilder();

            queryBuilder
                .select(['language.id', 'language.name'])
                .from(Language, 'language');

            if(options.filter) {
                if(options.filter.name) {
                    queryBuilder.andWhere('language.name LIKE :name', {
                        name: '%' + options.filter.name + '%',
                    });
                }
                if(options.filter.ids) {
                    queryBuilder.andWhere('language.id IN (:...ids)', {
                        ids: options.filter.ids,
                    });
                }
                if(options.filter.methods) {
                    queryBuilder.andWhere('language.methods.mathod.id IN (:...methods)', {
                        methods: options.filter.methods,
                    });
                }
                if(options.filter.questions) {
                    queryBuilder.andWhere('language.questions.question.id IN (:...questions)', {
                        questions: options.filter.questions,
                    });
                }
                if(options.filter.answers) {
                    queryBuilder.andWhere('language.answers.answer.id IN (:...answers)', {
                        answers: options.filter.answers,
                    });
                }
                if(options.filter.indicators) {
                    queryBuilder.andWhere('language.indicators.indicator.id IN (:...indicators)', {
                        indicators: options.filter.indicators,
                    });
                }
                if(options.filter.criteria) {
                    queryBuilder.andWhere('language.criteria.criterion.id IN (:...criteria)', {
                        criteria: options.filter.criteria,
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

            return createReadAllResultObject<Language>(options, count, entities);

        }, options);
    }

    public async readById(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<Language> {
        return this.execInTransaction<Language>(async queryRunner => {
            const existingLanguage = await queryRunner.manager.findOneBy(Language, { id });
            if(existingLanguage === null) {
                throw new NotFoundException(`Language with id '${id}' does not exist`);
            }
            
            return existingLanguage;
        }, options);
    }

    public async update(
        id: number,
        updateLanguageDto: UpdateLanguageDto,
        options: ITransactionOptions = {},
    ): Promise<Language> {
        return this.execInTransaction<Language>(async queryRunner => {

            if(!(await queryRunner.manager.exists(Language, {
                where: { id },
            }))) {
                throw new NotFoundException(`Language with id '${id}' does not exist`);
            }

            if(updateLanguageDto.name && (await queryRunner.manager.exists(Language, {
                where: {
                    id: Not(id),
                    name: updateLanguageDto.name,
                }
            }))) {
                throw new BadRequestException(`Language with name '${updateLanguageDto.name}' already exists`);
            }

            await queryRunner.manager.update(Language, id, updateLanguageDto);
            return this.readById(id, { queryRunner });
        }, options);
    }

    public async delete(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<void> {
        return this.execInTransaction<void>(async queryRunner => {
            const existingLanguage = await this.readById(id, { queryRunner });
            if(!existingLanguage) {
                throw new NotFoundException(`Language with id '${id}' does not exist`);
            }

            await queryRunner.manager.delete(AnswerToLanguage, { language: existingLanguage });
            await queryRunner.manager.delete(CriterionToLanguage, { language: existingLanguage });
            await queryRunner.manager.delete(IndicatorToLanguage, { language: existingLanguage });
            await queryRunner.manager.delete(MethodToLanguage, { language: existingLanguage });
            await queryRunner.manager.delete(QuestionToLanguage, { language: existingLanguage });

            await queryRunner.manager.delete(Language, id);
        }, options);
    }

    public async readOneBy(
        readOneLanguageDto: ReadOneLanguageDto,
        options: ITransactionOptions = {},
    ): Promise<Language> {
        return this.execInTransaction<Language>(async queryRunner => {
            let isPropDefined = false;
            for(let prop in readOneLanguageDto) {
                if(prop) {
                    isPropDefined = true;
                    break;
                }
            }
            if(!isPropDefined) {
                throw new BadRequestException(`One of properties must be defined`);
            }

            const queryBuilder = queryRunner.manager.createQueryBuilder()
                .select(['language.id', 'language.name'])
                .from(Language, 'language');

            if(readOneLanguageDto.id) {
                queryBuilder.andWhere('language.id = :id', {
                    id: readOneLanguageDto.id,
                });
            }
            if(readOneLanguageDto.name) {
                queryBuilder.andWhere('language.name = :name', {
                    name: readOneLanguageDto.name,
                });
            }

            const existingLanguage = await queryBuilder.getOne();

            if(existingLanguage === null) {
                throw new NotFoundException(`Such language does not exist`);
            }
            
            return existingLanguage;
        }, options);
    }
}