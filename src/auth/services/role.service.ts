import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Not } from "typeorm";

import { Role } from "../entities/role.entity";
import { UserToRole } from "../entities/user-to-role.entity";
import { CreateRoleDto, UpdateRoleDto } from "../dto/role.dto";
import { ITransactionOptions } from "src/common/types/transaction.types";
import { createReadAllResultObject, ReadAllResult } from "src/common/types/read-all-result.types";
import { IReadAllRolesOptions } from "../types/role.options";
import { BaseService } from "src/common/classes/base-service";

@Injectable()
export class RoleService extends BaseService {
    constructor(
        protected dataSource: DataSource,
    ) {
        super(dataSource);
    }

    public async create(
        createRoleDto: CreateRoleDto,
        options: ITransactionOptions = {},
    ): Promise<Role> {
        return this.execInTransaction<Role>(async queryRunner => {
            if(await queryRunner.manager.exists(Role, {
                where: {
                    name: createRoleDto.name,
                }
            })) {
                throw new BadRequestException(`Role with name '${createRoleDto.name}' already exists`);
            }
            
            return queryRunner.manager.save(Role, createRoleDto);
        }, options);
    }

    public async readAll(
        options: IReadAllRolesOptions,
    ): Promise<ReadAllResult<Role>> {
        return this.execInTransaction<ReadAllResult<Role>>(async queryRunner => {

            const queryBuilder = queryRunner.manager.createQueryBuilder();

            queryBuilder
                .select(['role.id', 'role.name'])
                .from(Role, 'role');

            if(options.filter) {
                if(options.filter.name) {
                    queryBuilder.andWhere('role.name LIKE :name', {
                        name: '%' + options.filter.name + '%',
                    })
                }
                if(options.filter.ids) {
                    queryBuilder.andWhere('role.id IN (:...ids)', {
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

            return createReadAllResultObject<Role>(options, count, entities);

        }, options);
    }

    public async readById(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<Role> {
        return this.execInTransaction<Role>(async queryRunner => {
            const existingRole = await queryRunner.manager.findOneBy(Role, { id });
            if(existingRole === null) {
                throw new NotFoundException(`Role with id '${id}' does not exist`);
            }
            
            return existingRole;
        }, options);
    }

    public async update(
        id: number,
        updateRoleDto: UpdateRoleDto,
        options: ITransactionOptions = {},
    ): Promise<Role> {
        return this.execInTransaction<Role>(async queryRunner => {

            if(!(await queryRunner.manager.exists(Role, {
                where: { id },
            }))) {
                throw new NotFoundException(`Role with id '${id}' does not exist`);
            }

            if(updateRoleDto.name && (await queryRunner.manager.exists(Role, {
                where: {
                    id: Not(id),
                    name: updateRoleDto.name,
                }
            }))) {
                throw new BadRequestException(`Role with name '${updateRoleDto.name}' already exists`);
            }

            await queryRunner.manager.update(Role, id, updateRoleDto);
            return this.readById(id, { queryRunner });
        }, options);
    }

    public async delete(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<void> {
        return this.execInTransaction<void>(async queryRunner => {
            const existingRole = await this.readById(id, { queryRunner });
            if(!existingRole) {
                throw new NotFoundException(`Role with id '${id}' does not exist`);
            }

            await queryRunner.manager.delete(UserToRole, { role: existingRole });

            await queryRunner.manager.delete(Role, id);
        }, options);
    }
}