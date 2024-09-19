import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Not } from "typeorm";

import { Question } from "../entities/question.entity";
import { CreateQuestionDto, ReadOneQuestionDto, UpdateQuestionDto } from "../dto/question.dto";
import { ITransactionOptions } from "src/common/types/transaction.types";
import { createReadAllResultObject, ReadAllResult } from "src/common/types/read-all-result.types";
import { IReadAllQuestionsOptions } from "../types/question.options";
import { MethodService } from "./method.service";
import { LanguageService } from "./language.service";
import { QuestionToLanguage } from "../entities/question-to-language.entity";
import { AnswerService } from "./answer.service";
import { BaseLanguagesService } from "./common/base-languages.service";

@Injectable()
export class QuestionService extends BaseLanguagesService {
    constructor(
        protected dataSource: DataSource,
        @Inject(forwardRef(() => MethodService))
        private methodService: MethodService,
        protected languageService: LanguageService,
        @Inject(forwardRef(() => AnswerService))
        private answerService: AnswerService,
    ) {
        super(dataSource, languageService);
    }

    public async create(
        createQuestionDto: CreateQuestionDto,
        options: ITransactionOptions = {},
    ): Promise<Question> {
        return this.execInTransaction<Question>(async queryRunner => {
            const { languages, method, ...properties } = createQuestionDto;

            const existingMethod = await this.methodService.readById(method, { queryRunner });
            if(existingMethod === null) {
                throw new NotFoundException(`Method with id '${method}' does not exist`);
            }

            if(await queryRunner.manager.exists(Question, {
                where: {
                    index: createQuestionDto.index,
                    method: { id: existingMethod.id },
                }
            })) {
                throw new BadRequestException(`Method with id '${existingMethod.id}' already has question with index '${properties.index}'`);
            }

            await this.validateLanguages(languages.map(el => el.language), { queryRunner });

            const createdQuestion = await queryRunner.manager.save(Question, {
                method: existingMethod,
                ...properties,
            });

            let newQuestionToLanguages = [];
            for(let languageInfo of languages) {
                newQuestionToLanguages.push({
                    question: createdQuestion,
                    language: { id: languageInfo.language },
                    name: languageInfo.name,
                });
            }

            await queryRunner.manager.insert(QuestionToLanguage, newQuestionToLanguages);

            return this.readById(createdQuestion.id, { queryRunner });
            
        }, options);
    }

    public async readAll(
        options: IReadAllQuestionsOptions,
    ): Promise<ReadAllResult<Question>> {
        return this.execInTransaction<ReadAllResult<Question>>(async queryRunner => {

            const languages = options.filter?.languages ? options.filter.languages : [null];

            const queryBuilder = queryRunner.manager.createQueryBuilder();

            queryBuilder
                .select(['question.id', 'question.index'])
                .from(Question, 'question')
                .leftJoin('question.languages', 'questionLanguages', 'questionLanguages.language.id IN (:...languages)', {
                    languages: languages,
                })
                .leftJoinAndSelect('questionLanguages.language', 'questionLanguage')
                .leftJoinAndSelect('question.method', 'method')
                .leftJoin('method.languages', 'methodLanguages', 'methodLanguages.language.id IN (:...languages)')
                .leftJoinAndSelect('methodLanguages.language', 'methodLanguage')
                .addSelect([ 
                    'questionLanguages.name',
                    'methodLanguages.name',
                    'methodLanguages.description'
                ]);

            if(options.filter) {
                if(options.filter.ids) {
                    queryBuilder.andWhere('question.id IN (:...ids)', {
                        ids: options.filter.ids,
                    });
                }
                if(options.filter.methods) {
                    queryBuilder.andWhere('question.method.id IN (:...methods)', {
                        methods: options.filter.methods,
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

            return createReadAllResultObject<Question>(options, count, entities);

        }, options);
    }

    public async readById(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<Question> {
        return this.execInTransaction<Question>(async queryRunner => {
            const existingQuestion = await queryRunner.manager.createQueryBuilder()
                .select(['question.id', 'question.index'])
                .from(Question, 'question')
                .leftJoin('question.languages', 'questionLanguages')
                .leftJoinAndSelect('questionLanguages.language', 'questionLanguage')
                .leftJoinAndSelect('question.method', 'method')
                .leftJoin('method.languages', 'methodLanguages')
                .leftJoinAndSelect('methodLanguages.language', 'methodLanguage')
                .addSelect([ 
                    'questionLanguages.name',
                    'methodLanguages.name',
                    'methodLanguages.description'
                ])
                .where('question.id = :id', {
                    id: id,
                })
                .getOne();
            
            if(existingQuestion === null) {
                throw new NotFoundException(`Question with id '${id}' does not exist`);
            }
            
            return existingQuestion;
        }, options);
    }

    public async update(
        id: number,
        updateQuestionDto: UpdateQuestionDto,
        options: ITransactionOptions = {},
    ): Promise<Question> {
        return this.execInTransaction<Question>(async queryRunner => {

            const existingQuestion = await this.readById(id, { queryRunner });

            if(!existingQuestion) {
                throw new NotFoundException(`Question with id '${id}' does not exist`);
            }

            const { languages, method, ...properties } = updateQuestionDto;

            if(method) {
                const existingMethod = await this.methodService.readById(method, { queryRunner });
                if(existingMethod === null) {
                    throw new NotFoundException(`Method with id '${method}' does not exist`);
                }
            }

            if(properties.index) {
                const currentMethod = method ? method : existingQuestion.method.id;
                if((await queryRunner.manager.exists(Question, {
                    where: {
                        id: Not(id),
                        index: properties.index,
                        method: { id: currentMethod },
                    }
                }))) {
                    throw new BadRequestException(`Method with id '${currentMethod}' already has question with index '${properties.index}'`);
                }
            }

            if(languages) {
                await this.validateLanguages(languages.map(el => el.language), { queryRunner });

                await queryRunner.manager.save(QuestionToLanguage, languages.map(languageInfo => ({
                    question: { id: id },
                    language: { id: languageInfo.language },
                    name: languageInfo.name,
                })));
            }

            await queryRunner.manager.update(Question, id, {
                method: updateQuestionDto.method ? { id: updateQuestionDto.method} : undefined,
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
            const existingQuestion = await queryRunner.manager.createQueryBuilder()
                .select('question.id')
                .from(Question, 'question')
                .leftJoinAndSelect('question.answers', 'answers')
                .where('question.id = :id', {
                    id: id,
                })
                .getOne();
            
            if(!existingQuestion) {
                throw new NotFoundException(`Question with id '${id}' does not exist`);
            }

            await queryRunner.manager.delete(QuestionToLanguage, { question: { id: id } });
            for(let answer of existingQuestion.answers) {
                await this.answerService.delete(answer.id, { queryRunner });
            }
            await queryRunner.manager.delete(Question, id);
        }, options);
    }

    public async readOneBy(
        readOneQuestionDto: ReadOneQuestionDto,
        options: ITransactionOptions = {},
    ): Promise<Question> {
        return this.execInTransaction<Question>(async queryRunner => {
            let isPropDefined = false;
            for(let prop in readOneQuestionDto) {
                if(prop) {
                    isPropDefined = true;
                    break;
                }
            }
            if(!isPropDefined) {
                throw new BadRequestException(`One of properties must be defined`);
            }

            const languages = readOneQuestionDto.languages ? readOneQuestionDto.languages : [null];

            const queryBuilder = queryRunner.manager.createQueryBuilder();

            queryBuilder
                .select(['question.id', 'question.index'])
                .from(Question, 'question')
                .leftJoin('question.languages', 'questionLanguages', 'questionLanguages.language.id IN (:...languages)', {
                    languages: languages,
                })
                .leftJoinAndSelect('questionLanguages.language', 'questionLanguage')
                .leftJoinAndSelect('question.method', 'method')
                .leftJoin('method.languages', 'methodLanguages', 'methodLanguages.language.id IN (:...languages)')
                .leftJoinAndSelect('methodLanguages.language', 'methodLanguage')
                .addSelect([ 
                    'questionLanguages.name',
                    'methodLanguages.name',
                    'methodLanguages.description'
                ]);

            if(readOneQuestionDto.id) {
                queryBuilder.andWhere('question.id = :id', {
                    id: readOneQuestionDto.id,
                });
            }
            if(readOneQuestionDto.index) {
                queryBuilder.andWhere('question.index = :index', {
                    index: readOneQuestionDto.index,
                });
            }
            if(readOneQuestionDto.method) {
                queryBuilder.andWhere('method.id = :method', {
                    method: readOneQuestionDto.method,
                });
            }

            const existingQuestion = await queryBuilder.getOne();

            if(existingQuestion === null) {
                throw new NotFoundException(`Such question does not exist`);
            }
            
            return existingQuestion;
        }, options);
    }
}