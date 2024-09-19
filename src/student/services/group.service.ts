import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Like } from "typeorm";
import { CreateGroupDto, ReadOneGroupDto, UpdateGroupDto } from "../dto/group.dto";
import { ITransactionOptions } from "src/common/types/transaction.types";
import { createReadAllResultObject, ReadAllResult } from "src/common/types/read-all-result.types";
import { IReadAllGroupsOptions } from "../types/group.options";
import { BaseService } from "src/common/classes/base-service";
import { Group } from "../entities/group.entity";
import { FacultyService } from "./faculty.service";

@Injectable()
export class GroupService extends BaseService {
    constructor(
        protected dataSource: DataSource,
        private facultyService: FacultyService,
    ) {
        super(dataSource);
    }

    public async create(
        createGroupDto: CreateGroupDto,
        options: ITransactionOptions = {},
    ): Promise<Group> {
        return this.execInTransaction<Group>(async queryRunner => {
            const { faculty, ...properties } = createGroupDto;
            const existingFaculty = await this.facultyService.readById(faculty, { queryRunner });

            if(existingFaculty === null) {
                throw new NotFoundException(`Faculty with id '${faculty}' does not exist`);
            }

            return queryRunner.manager.save(Group, { 
                faculty: existingFaculty,
                ...properties,
            });
        }, options);
    }

    public async readAll(
        options: IReadAllGroupsOptions,
    ): Promise<ReadAllResult<Group>> {
        return this.execInTransaction<ReadAllResult<Group>>(async queryRunner => {

            const queryBuilder = queryRunner.manager.createQueryBuilder();

            queryBuilder
                .select(['group.id', 'group.name'])
                .from(Group, 'group')
                .leftJoinAndSelect('group.faculty', 'faculty');

            if(options.filter) {
                if(options.filter.name) {
                    queryBuilder.andWhere('group.name LIKE :name', {
                        name: '%' + options.filter.name + '%',
                    })
                }
                if(options.filter.ids) {
                    queryBuilder.andWhere('group.id IN (:...ids)', {
                        ids: options.filter.ids,
                    })
                }
                if(options.filter.faculties) {
                    queryBuilder.andWhere('faculty.id IN (:...facultyIds)', {
                        facultyIds: options.filter.faculties,
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

            return createReadAllResultObject<Group>(options, count, entities);

        }, options);
    }

    public async readById(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<Group> {
        return this.execInTransaction<Group>(async queryRunner => {
            const existingGroup = await queryRunner.manager.findOneBy(Group, { id });
            if(existingGroup === null) {
                throw new NotFoundException(`Group with id '${id}' does not exist`);
            }
            
            return existingGroup;
        }, options);
    }

    public async update(
        id: number,
        updateGroupDto: UpdateGroupDto,
        options: ITransactionOptions = {},
    ): Promise<Group> {
        return this.execInTransaction<Group>(async queryRunner => {

            if(!(await queryRunner.manager.exists(Group, {
                where: { id },
            }))) {
                throw new NotFoundException(`Group with id '${id}' does not exist`);
            }

            const { faculty, ...properties } = updateGroupDto;
            if(faculty) {
                const existingFaculty = await this.facultyService.readById(faculty, { queryRunner });
                if(existingFaculty === null) {
                    throw new NotFoundException(`Faculty with id '${faculty}' does not exist`);
                }
            }

            await queryRunner.manager.update(Group, id, {
                faculty: faculty ? { id: faculty } : undefined,
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
            const existingGroup = await this.readById(id, { queryRunner });
            if(!existingGroup) {
                throw new NotFoundException(`Group with id '${id}' does not exist`);
            }

            await queryRunner.manager.delete(Group, id);
        }, options);
    }

    public async readOneBy(
        readOneGroupDto: ReadOneGroupDto,
        options: ITransactionOptions = {},
    ): Promise<Group> {
        return this.execInTransaction<Group>(async queryRunner => {
            let isPropDefined = false;
            for(let prop in readOneGroupDto) {
                if(prop) {
                    isPropDefined = true;
                    break;
                }
            }
            if(!isPropDefined) {
                throw new BadRequestException(`One of properties must be defined`);
            }

            const queryBuilder = queryRunner.manager.createQueryBuilder()
                .select(['group.id', 'group.name'])
                .from(Group, 'group')
                .leftJoinAndSelect('group.faculty', 'faculty');

            if(readOneGroupDto.id) {
                queryBuilder.andWhere('group.id = :id', {
                    id: readOneGroupDto.id,
                });
            }
            if(readOneGroupDto.name) {
                queryBuilder.andWhere('group.name LIKE :name', {
                    name: readOneGroupDto.name,
                });
            }

            const existingGroup = await queryBuilder.getOne();

            if(existingGroup === null) {
                throw new NotFoundException(`Such group does not exist`);
            }
            
            return existingGroup;
        }, options);
    }
}