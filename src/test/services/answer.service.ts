import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Not } from "typeorm";

import { Answer } from "../entities/answer.entity";
import { CreateAnswerDto, UpdateAnswerDto } from "../dto/answer.dto";
import { ITransactionOptions } from "src/common/types/transaction.types";
import { createReadAllResultObject, ReadAllResult } from "src/common/types/read-all-result.types";
import { IReadAllAnswersOptions } from "../types/answer.options";
import { QuestionService } from "./question.service";
import { LanguageService } from "./language.service";
import { AnswerToLanguage } from "../entities/answer-to-language.entity";
import { ResultToAnswer } from "../entities/result-to-answer.entity";
import { BaseLanguagesService } from "./common/base-languages.service";

@Injectable()
export class AnswerService extends BaseLanguagesService {
    constructor(
        protected dataSource: DataSource,
        @Inject(forwardRef(() => QuestionService))
        private questionService: QuestionService,
        protected languageService: LanguageService,
    ) {
        super(dataSource, languageService);
    }

    public async create(
        createAnswerDto: CreateAnswerDto,
        options: ITransactionOptions = {},
    ): Promise<Answer> {
        return this.execInTransaction<Answer>(async queryRunner => {
            const { languages, question, ...properties } = createAnswerDto;

            const existingQuestion = await this.questionService.readById(question, { queryRunner });
            if(existingQuestion === null) {
                throw new NotFoundException(`Question with id '${question}' does not exist`);
            }

            await this.validateLanguages(languages.map(el => el.language), { queryRunner });

            const createdAnswer = await queryRunner.manager.save(Answer, {
                question: existingQuestion,
                ...properties,
            });

            await queryRunner.manager.insert(AnswerToLanguage, languages.map(languageInfo => ({
                answer: createdAnswer,
                language: { id: languageInfo.language },
                name: languageInfo.name,
            })));

            return this.readById(createdAnswer.id, { queryRunner });
            
        }, options);
    }

    public async readAll(
        options: IReadAllAnswersOptions,
    ): Promise<ReadAllResult<Answer>> {
        return this.execInTransaction<ReadAllResult<Answer>>(async queryRunner => {

            const languages = options.filter?.languages ? options.filter.languages : [null];

            const queryBuilder = queryRunner.manager.createQueryBuilder();

            queryBuilder
                .select(['answer.id', 'answer.point'])
                .from(Answer, 'answer')
                .leftJoin('answer.languages', 'answerLanguages', 'answerLanguages.language.id IN (:...languages)', {
                    languages: languages,
                })
                .leftJoinAndSelect('answerLanguages.language', 'answerLanguage')
                .leftJoinAndSelect('answer.question', 'question')
                .leftJoin('question.languages', 'questionLanguages', 'questionLanguages.language.id IN (:...languages)')
                .leftJoinAndSelect('questionLanguages.language', 'questionLanguage')
                .addSelect([ 
                    'answerLanguages.name',
                    'questionLanguages.name',
                ]);

            if(options.filter) {
                if(options.filter.ids) {
                    queryBuilder.andWhere('answer.id IN (:...ids)', {
                        ids: options.filter.ids,
                    });
                }
                if(options.filter.questions) {
                    queryBuilder.andWhere('answer.question.id IN (:...questions)', {
                        questions: options.filter.questions,
                    });
                }
                if(options.filter.methods) {
                    queryBuilder.andWhere('question.method.id IN (:...methods)', {
                        methods: options.filter.methods,
                    });
                }
                if(options.filter.results) {
                    queryBuilder.andWhere('answer.results IN (:...results)', {
                        results: options.filter.results,
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

            return createReadAllResultObject<Answer>(options, count, entities);

        }, options);
    }

    public async readById(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<Answer> {
        return this.execInTransaction<Answer>(async queryRunner => {
                const existingAnswer = await queryRunner.manager.createQueryBuilder()
                .select(['answer.id', 'answer.point'])
                .from(Answer, 'answer')
                .leftJoin('answer.languages', 'answerLanguages')
                .leftJoinAndSelect('answerLanguages.language', 'answerLanguage')
                .leftJoinAndSelect('answer.question', 'question')
                .leftJoin('question.languages', 'questionLanguages')
                .leftJoinAndSelect('questionLanguages.language', 'questionLanguage')
                .addSelect([ 
                    'answerLanguages.name',
                    'questionLanguages.name',
                ])
                .where('answer.id = :id', {
                    id: id,
                })
                .getOne();
            
            if(existingAnswer === null) {
                throw new NotFoundException(`Answer with id '${id}' does not exist`);
            }
            
            return existingAnswer;
        }, options);
    }

    public async update(
        id: number,
        updateAnswerDto: UpdateAnswerDto,
        options: ITransactionOptions = {},
    ): Promise<Answer> {
        return this.execInTransaction<Answer>(async queryRunner => {

            if(!(await queryRunner.manager.exists(Answer, {
                where: { id },
            }))) {
                throw new NotFoundException(`Answer with id '${id}' does not exist`);
            }

            const { languages, question, ...properties } = updateAnswerDto;

            if(question) {
                const existingQuestion = await this.questionService.readById(question, { queryRunner });
                if(existingQuestion === null) {
                    throw new NotFoundException(`Question with id '${question}' does not exist`);
                }
            }

            if(languages) {
                await this.validateLanguages(languages.map(el => el.language), { queryRunner });

                await queryRunner.manager.save(AnswerToLanguage, languages.map(languageInfo => ({
                    answer: { id: id },
                    language: { id: languageInfo.language },
                    name: languageInfo.name,
                })));
            }

            await queryRunner.manager.update(Answer, id, {
                question: question ? { id: question} : undefined,
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
            const existingAnswer = await this.readById(id, { queryRunner });
            
            if(!existingAnswer) {
                throw new NotFoundException(`Answer with id '${id}' does not exist`);
            }

            await queryRunner.manager.delete(AnswerToLanguage, { answer: { id: id } });
            await queryRunner.manager.delete(ResultToAnswer, { answer: { id: id }});
            
            await queryRunner.manager.delete(Answer, id);
        }, options);
    }
}