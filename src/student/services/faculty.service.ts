import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CreateFacultyDto, UpdateFacultyDto } from "../dto/faculty.dto";
import { ITransactionOptions } from "src/common/types/transaction.types";
import { createReadAllResultObject, ReadAllResult } from "src/common/types/read-all-result.types";
import { IReadAllFacultiesOptions } from "../types/faculty.options";
import { BaseService } from "src/common/classes/base-service";
import { Faculty } from "../entities/faculty.entity";

@Injectable()
export class FacultyService extends BaseService {
    constructor(
        protected dataSource: DataSource,
    ) {
        super(dataSource);
    }

    public async create(
        createFacultyDto: CreateFacultyDto,
        options: ITransactionOptions = {},
    ): Promise<Faculty> {
        return this.execInTransaction<Faculty>(async queryRunner => {
            return queryRunner.manager.save(Faculty, createFacultyDto);
        }, options);
    }

    public async readAll(
        options: IReadAllFacultiesOptions,
    ): Promise<ReadAllResult<Faculty>> {
        return this.execInTransaction<ReadAllResult<Faculty>>(async queryRunner => {

            const queryBuilder = queryRunner.manager.createQueryBuilder();

            queryBuilder
                .select(['faculty.id', 'faculty.name'])
                .from(Faculty, 'faculty');

            if(options.filter) {
                if(options.filter.name) {
                    queryBuilder.andWhere('faculty.name LIKE :name', {
                        name: '%' + options.filter.name + '%',
                    })
                }
                if(options.filter.ids) {
                    queryBuilder.andWhere('faculty.id IN (:...ids)', {
                        ids: options.filter.ids,
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

            return createReadAllResultObject<Faculty>(options, count, entities);

        }, options);
    }

    public async readById(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<Faculty> {
        return this.execInTransaction<Faculty>(async queryRunner => {
            const existingFaculty = await queryRunner.manager.findOneBy(Faculty, { id });
            if(existingFaculty === null) {
                throw new NotFoundException(`Faculty with id '${id}' does not exist`);
            }
            
            return existingFaculty;
        }, options);
    }

    public async update(
        id: number,
        updateFacultyDto: UpdateFacultyDto,
        options: ITransactionOptions = {},
    ): Promise<Faculty> {
        return this.execInTransaction<Faculty>(async queryRunner => {

            if(!(await queryRunner.manager.exists(Faculty, {
                where: { id },
            }))) {
                throw new NotFoundException(`Faculty with id '${id}' does not exist`);
            }

            await queryRunner.manager.update(Faculty, id, updateFacultyDto);
            return this.readById(id, { queryRunner });
        }, options);
    }

    public async delete(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<void> {
        return this.execInTransaction<void>(async queryRunner => {
            const existingFaculty = await this.readById(id, { queryRunner });
            if(!existingFaculty) {
                throw new NotFoundException(`Faculty with id '${id}' does not exist`);
            }

            await queryRunner.manager.delete(Faculty, id);
        }, options);
    }
}