import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Not } from "typeorm";

import { Method } from "../entities/method.entity";
import { AvailMethodsDto, CreateMethodDto, DisableMethodsDto, UpdateMethodDto } from "../dto/method.dto";
import { ITransactionOptions } from "src/common/types/transaction.types";
import { createReadAllResultObject, ReadAllResult } from "src/common/types/read-all-result.types";
import { IAvailableMethodArrays, ICheckIndicatorOptions, IReadAllMethodsOptions, IReadAvailableMethodsOptions } from "../types/method.options";
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

    public async disableMethod(
        disableMethodDto: DisableMethodsDto,
        options: ITransactionOptions = {},
    ): Promise<void> {
        return this.execInTransaction<void>(async queryRunner => {
            const { methods, students, groups, faculties } = disableMethodDto;

            await this.checkAvailableMethodArrays({
                ...disableMethodDto,
                queryRunner: queryRunner,
            });

            const disabledStudentsIds = (groups || students || faculties) ? (await this.studentService.readAll({
                filter: {
                    ids: students,
                    groups: groups,
                    faculties: faculties,
                },
                queryRunner: queryRunner,
            })).entities.map(el => el.id) : undefined;

            const queryBuilder = queryRunner.manager.createQueryBuilder()
                .delete()
                .from(AvailableMethod, 'availableMethod')
                .where('method.id IN (:...methods)', {
                    methods: methods,
                });

            if(disabledStudentsIds) {
                queryBuilder.andWhere('student.id IN (:...students)', {
                    students: disabledStudentsIds,
                })
            }

            if(disableMethodDto.date) {
                queryBuilder.andWhere('dateEnd = :date', {
                    date: disableMethodDto.date,
                });
            }
            if(disableMethodDto.period) {
                if(disableMethodDto.period.minDate) {
                    queryBuilder.andWhere('dateEnd >= :minDate', {
                        minDate: disableMethodDto.period.minDate,
                    });
                }
                if(disableMethodDto.period.maxDate) {
                    queryBuilder.andWhere('dateEnd <= :maxDate', {
                        maxDate: disableMethodDto.period.maxDate,
                    });
                }
            }

            await queryBuilder.execute();
            
        }, options);
    }

    private async checkAvailableMethodArrays(
        options: IAvailableMethodArrays,
    ): Promise<void> {
        return this.execInTransaction<void>(async queryRunner => {
            const { methods, students, groups, faculties } = options;
            if(faculties) {
                if(new Set(faculties).size !== faculties.length) {
                    throw new BadRequestException(`Faculties array has duplicate language values`);
                }

                const existingFaculties = (await this.facultyService.readAll({
                    filter: {
                        ids: faculties,
                    },
                    queryRunner: queryRunner,
                })).entities;

                if(existingFaculties.length !== faculties.length) {
                    throw new NotFoundException(`One or several faculties do not exist`);
                }
            }

            if(groups) {
                if(new Set(groups).size !== groups.length) {
                    throw new BadRequestException(`Groups array has duplicate language values`);
                }

                const existingGroups = (await this.groupService.readAll({
                    filter: {
                        ids: groups,
                    },
                    queryRunner: queryRunner,
                })).entities;

                if(existingGroups.length !== groups.length) {
                    throw new NotFoundException(`One or several groups do not exist`);
                }
            }

            if(students) {
                if(new Set(students).size !== students.length) {
                    throw new BadRequestException(`Students array has duplicate language values`);
                }

                const existingStudents = (await this.studentService.readAll({
                    filter: {
                        ids: students,
                    },
                    queryRunner: queryRunner,
                })).entities;

                if(existingStudents.length !== students.length) {
                    throw new NotFoundException(`One or several students do not exist`);
                }
            }

            if(new Set(methods).size !== methods.length) {
                throw new BadRequestException(`Methods array has duplicate language values`);
            }
                
            const existingMethods = (await this.readAll({
                filter: {
                    ids: methods,
                },
                queryRunner: queryRunner,
            })).entities;

            if(existingMethods.length !== methods.length) {
                throw new NotFoundException(`One or several methods do not exist`);
            }
        }, options);
    }

    async readAvailableMethods(
        options: IReadAvailableMethodsOptions,
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
                .leftJoin('method.availableStudents', 'availableStudents')
                .leftJoinAndSelect('availableStudents.student', 'student')
                .leftJoinAndSelect('student.group', 'group')
                .leftJoinAndSelect('group.faculty', 'faculty')
                .addSelect([
                    'languages.name', 
                    'languages.description',
                    'availableStudents.dateEnd'
                ]);

            if(options.filter) {
                if(options.filter.methods) {
                    queryBuilder.andWhere('method.id IN (:...methods)', {
                        methods: options.filter.methods,
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
                if(options.filter.date) {
                    queryBuilder.andWhere('availableStudents.dateEnd = :date', {
                        date: options.filter.date,
                    });
                }
                if(options.filter.period) {
                    if(options.filter.period.minDate) {
                        queryBuilder.andWhere('availableStudents.dateEnd >= :minDate', {
                            dateEnd: options.filter.period.minDate,
                        });
                    }
                    if(options.filter.period.maxDate) {
                        queryBuilder.andWhere('availableStudents.dateEnd <= :maxDate', {
                            maxDate: options.filter.period.maxDate,
                        });
                    }
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

    async availMethods(
        availMethodsDto: AvailMethodsDto,
        options: ITransactionOptions = {},
    ): Promise<ReadAllResult<Method>> {
        return this.execInTransaction<ReadAllResult<Method>>(async queryRunner => {
            if(availMethodsDto.dateEnd.getTime() < Date.now()) {
                throw new BadRequestException(`Date end must be greater than current date`);
            }

            const { faculties, groups, students, methods } = availMethodsDto;

            if(!faculties && !groups && !students) {
                throw new BadRequestException(`One or several of faculties, groups, students array must be defined`);
            }

            await this.checkAvailableMethodArrays({
                ...availMethodsDto,
                queryRunner,
            });

            const addedStudentsIds = (await this.studentService.readAll({
                filter: {
                    ids: students,
                    groups: groups,
                    faculties: faculties,
                },
                queryRunner: queryRunner,
            })).entities.map(el => el.id);

            let newAvailableMethods = [];
            for(let student of addedStudentsIds) {
                for(let method of methods) {
                    newAvailableMethods.push({
                        student: { id: student },
                        method: { id: method },
                        dateEnd: availMethodsDto.dateEnd,
                    })
                }
            }

            await queryRunner.manager.save(AvailableMethod, newAvailableMethods);
            return this.readAvailableMethods({
                filter: { ...availMethodsDto },
                queryRunner: queryRunner,
            });

        }, options);
    }

}