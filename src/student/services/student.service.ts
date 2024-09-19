import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Like, Not } from "typeorm";
import { CreateStudentDto, ReadOneStudentDto, UpdateStudentDto } from "../dto/student.dto";
import { ITransactionOptions } from "src/common/types/transaction.types";
import { createReadAllResultObject, ReadAllResult } from "src/common/types/read-all-result.types";
import { IReadAllStudentsOptions } from "../types/student.types";
import { BaseService } from "src/common/classes/base-service";
import { Student } from "../entities/student.entity";
import { UserService } from "src/auth/services/user.service";
import { GroupService } from "./group.service";
import { User } from "src/auth/entities/user.entity";

@Injectable()
export class StudentService extends BaseService {
    constructor(
        protected dataSource: DataSource,
        private groupService: GroupService,
        private userService: UserService,
    ) {
        super(dataSource);
    }

    public async create(
        createStudentDto: CreateStudentDto,
        options: ITransactionOptions = {},
    ): Promise<Student> {
        return this.execInTransaction<Student>(async queryRunner => {
            if(await queryRunner.manager.exists(Student, {
                where: {
                    recordBookNumber: createStudentDto.recordBookNumber,
                }
            })) {
                throw new BadRequestException(`Student with record book number '${createStudentDto.recordBookNumber}' already exist`);
            }

            if(await queryRunner.manager.exists(Student, {
                where: {
                    user: { id: createStudentDto.user },
                }
            })) {
                throw new BadRequestException(`Student with user id '${createStudentDto.user}' already exist`);
            }

            const { group, user, ...properties } = createStudentDto;
            const existingStudent = await this.groupService.readById(group, { queryRunner });

            if(existingStudent === null) {
                throw new NotFoundException(`Student with id '${group}' does not exist`);
            }

            const existingUser = await this.userService.readById(user, { queryRunner });
            if(existingUser === null) {
                throw new NotFoundException(`User with id '${user}' does not exist`)
            }

            return queryRunner.manager.save(Student, { 
                group: existingStudent,
                user: existingUser,
                ...properties,
            });
        }, options);
    }

    public async readAll(
        options: IReadAllStudentsOptions,
    ): Promise<ReadAllResult<Student>> {
        return this.execInTransaction<ReadAllResult<Student>>(async queryRunner => {

            const queryBuilder = queryRunner.manager.createQueryBuilder();

            queryBuilder
                .select(['student.id', 'student.name', 'student.surname', 'student.patronymic', 'student.phoneNumber'])
                .from(Student, 'student')
                .leftJoinAndSelect('student.group', 'group')
                .leftJoinAndSelect('group.faculty', 'faculty')
                .leftJoin('student.user', 'user')
                .addSelect([
                    'user.id',
                    'user.login'
                ]);

            if(options.filter) {
                if(options.filter.recordBookNumber) {
                    queryBuilder.andWhere('student.recordBookNumber LIKE :recordBookNumber', {
                        recordBookNumber: '%' + options.filter.recordBookNumber + '%',
                    })
                }
                if(options.filter.name) {
                    queryBuilder.andWhere('student.name LIKE :name', {
                        name: '%' + options.filter.name + '%',
                    })
                }
                if(options.filter.surname) {
                    queryBuilder.andWhere('student.surname LIKE :surname', {
                        surname: '%' + options.filter.surname + '%',
                    })
                }
                if(options.filter.patronymic) {
                    queryBuilder.andWhere('student.patronymic LIKE :patronymic', {
                        patronymic: '%' + options.filter.patronymic + '%',
                    })
                }
                if(options.filter.phoneNumber) {
                    queryBuilder.andWhere('student.phoneNumber LIKE :phoneNumber', {
                        phoneNumber: '%' + options.filter.phoneNumber + '%',
                    })
                }
                if(options.filter.ids) {
                    queryBuilder.andWhere('student.id IN (:...ids)', {
                        ids: options.filter.ids,
                    })
                }
                if(options.filter.faculties) {
                    queryBuilder.andWhere('faculty.id IN (:...facultyIds)', {
                        facultyIds: options.filter.faculties,
                    });
                }
                if(options.filter.groups) {
                    queryBuilder.andWhere('group.id IN (:...groupIds)', {
                        groupIds: options.filter.groups,
                    });
                }
                if(options.filter.users) {
                    queryBuilder.andWhere('user.id IN (:...userIds)', {
                        userIds: options.filter.users,
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

            return createReadAllResultObject<Student>(options, count, entities);

        }, options);
    }

    public async readById(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<Student> {
        return this.execInTransaction<Student>(async queryRunner => {
            const existingStudent = await queryRunner.manager.findOneBy(Student, { id });
            if(existingStudent === null) {
                throw new NotFoundException(`Student with id '${id}' does not exist`);
            }
            
            return existingStudent;
        }, options);
    }

    public async update(
        id: number,
        updateStudentDto: UpdateStudentDto,
        options: ITransactionOptions = {},
    ): Promise<Student> {
        return this.execInTransaction<Student>(async queryRunner => {

            if(updateStudentDto.recordBookNumber && (await queryRunner.manager.exists(Student, {
                where: {
                    id: Not(id),
                    recordBookNumber: updateStudentDto.recordBookNumber,
                }
            }))) {
                throw new BadRequestException(`Student with record book number '${updateStudentDto.recordBookNumber}' already exists`);
            }

            if(updateStudentDto.user && (await queryRunner.manager.exists(Student, {
                where: {
                    id: Not(id),
                    user: { id: updateStudentDto.user },
                }
            }))) {
                throw new BadRequestException(`Student with user id '${updateStudentDto.user}' already exist`);
            }

            if(!(await queryRunner.manager.exists(Student, {
                where: { id },
            }))) {
                throw new NotFoundException(`Student with id '${id}' does not exist`);
            }

            const { group, user, ...properties } = updateStudentDto;

            if(group) {
                const existingStudent = await this.groupService.readById(group, { queryRunner });
                if(existingStudent === null) {
                    throw new NotFoundException(`Student with id '${group}' does not exist`);
                }
            }
            if(user) {
                const existingUser = await this.userService.readById(user, { queryRunner });
                if(existingUser === null) {
                    throw new NotFoundException(`User with id '${user}' does not exist`);
                }
            }
            
            await queryRunner.manager.update(Student, id, {
                ...properties,
                user: user ? { id: user } : undefined,
                group: group ? { id: group } : undefined,
            });
            return this.readById(id, { queryRunner });
        }, options);
    }

    public async delete(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<void> {
        return this.execInTransaction<void>(async queryRunner => {
            const existingStudent = await this.readById(id, { queryRunner });
            if(!existingStudent) {
                throw new NotFoundException(`Student with id '${id}' does not exist`);
            }

            await queryRunner.manager.delete(Student, id);
        }, options);
    }

    public async readOneBy(
        readOneStudentDto: ReadOneStudentDto,
        options: ITransactionOptions = {},
    ): Promise<Student> {
        return this.execInTransaction<Student>(async queryRunner => {
            let isPropDefined = false;
            for(let prop in readOneStudentDto) {
                if(prop) {
                    isPropDefined = true;
                    break;
                }
            }
            if(!isPropDefined) {
                throw new BadRequestException(`One of properties must be defined`);
            }

            const queryBuilder = queryRunner.manager.createQueryBuilder()
                .select(['student.id', 'student.name', 'student.patronymic', 'student.surname', 'student.phoneNumber', 'student.recordBookNumber'])
                .from(Student, 'student')
                .leftJoinAndSelect('student.group', 'group')
                .leftJoinAndSelect('student.user', 'user');

            if(readOneStudentDto.id) {
                queryBuilder.andWhere('student.id = :id', {
                    id: readOneStudentDto.id,
                });
            }
            if(readOneStudentDto.name) {
                queryBuilder.andWhere('student.name LIKE :name', {
                    name: '%' + readOneStudentDto.name + '%',
                });
            }
            if(readOneStudentDto.surname) {
                queryBuilder.andWhere('student.surname LIKE :surname', {
                    surname: '%' + readOneStudentDto.surname + '%',
                });
            }
            if(readOneStudentDto.patronymic) {
                queryBuilder.andWhere('student.patronymic LIKE :patronymic', {
                    patronymic: '%' + readOneStudentDto.patronymic + '%',
                });
            }
            if(readOneStudentDto.recordBookNumber) {
                queryBuilder.andWhere('student.recordBookNumber = :recordBookNumber', {
                    recordBookNumber: readOneStudentDto.recordBookNumber,
                });
            }
            if(readOneStudentDto.phoneNumber) {
                queryBuilder.andWhere('student.phoneNumber = :phoneNumber', {
                    phoneNumber: readOneStudentDto.phoneNumber,
                });
            }
            if(readOneStudentDto.user) {
                queryBuilder.andWhere('user.id = :user', {
                    user: readOneStudentDto.user,
                });
            }
            
            const existingStudent = await queryBuilder.getOne();

            if(!existingStudent) {
                throw new NotFoundException(`Such student does not exist`);
            }

            return existingStudent;
        }, options);
    }
}