import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, In, Not } from "typeorm";

import { User } from "../entities/user.entity";
import { UserToRole } from "../entities/user-to-role.entity";
import { RoleService } from "./role.service";
import { CreateUserDto, UpdateUserDto, VerifyUserDto } from "../dto/user.dto";
import { ITransactionOptions } from "src/common/types/transaction.types";
import { IReadAllUsersOptions } from "../types/user.options";
import { createReadAllResultObject, ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseService } from "src/common/classes/base-service";

import * as argon2 from 'argon2';

@Injectable()
export class UserService extends BaseService {
    constructor(
        protected dataSource: DataSource,
        private roleService: RoleService,
    ) {
        super(dataSource);
    }

    public async create(
        createUserDto: CreateUserDto,
        options: ITransactionOptions = {},
    ): Promise<User> {
        return this.execInTransaction<User>(async queryRunner => {
            if(await queryRunner.manager.exists(User, {
                where: {
                    login: createUserDto.login,
                }
            })) {
                throw new BadRequestException(`User with login '${createUserDto.login}' already exist`);
            }

            if((new Set(createUserDto.roles)).size !== createUserDto.roles.length) {
                throw new BadRequestException(`Roles array has duplicate values`);
            }

            const roleEntities = (await this.roleService.readAll({
                filter: {
                    ids: createUserDto.roles,
                },
                queryRunner: queryRunner,
            })).entities;

            if(roleEntities.length !== createUserDto.roles.length) {
                throw new BadRequestException(`One or several roles of roles array do not exist`);
            }

            const { roles, ...userFields } = createUserDto;
            let newUser = {
                ...userFields,
                roles: roleEntities,
            }
            newUser.password = await argon2.hash(newUser.password);
            const createdUser = await queryRunner.manager.save(User, newUser);

            //remove password from user entity
            return this.readById(createdUser.id, { queryRunner });
            
        }, options);
    }

    public async readAll(
        options: IReadAllUsersOptions,
    ): Promise<ReadAllResult<User>> {
        return this.execInTransaction<ReadAllResult<User>>(async queryRunner => {
            
            const queryBuilder = queryRunner.manager.createQueryBuilder();

            queryBuilder
                .select(['user.id', 'user.login'])
                .from(User, 'user')
                .leftJoin('user.roles', 'role')
                .addSelect([
                    'role.id',
                    'role.name',
                ]);

            if(options.filter) {
                if(options.filter.login) {
                    queryBuilder.andWhere('user.login LIKE :login', {
                        login: '%' + options.filter.login + '%',
                    });
                }
                if(options.filter.ids) {
                    queryBuilder.andWhere('user.id IN (:...ids)', {
                        ids: options.filter.ids,
                    });
                }
                if(options.filter.roles) {
                    //add all user's roles to user with roles in options.filter.roles
                    const usersWithRoles = await queryRunner.manager.find(UserToRole, {
                        where: {
                            role: In(options.filter.roles),
                        }
                    });
                    
                    queryBuilder.andWhere('user.id IN (:...usersWithRoles)', {
                        usersWithRoles: usersWithRoles.map(el => el.user),
                    });
                }
            }

            if(options.pagination) {
                queryBuilder.offset(options.pagination.page * options.pagination.size).limit(options.pagination.size);
            }
    
            if(options.sorting) {
                queryBuilder.addOrderBy(options.sorting.column, options.sorting.direction);
            }

            const [ entities, count ] = await queryBuilder.getManyAndCount();

            return createReadAllResultObject<User>(options, count, entities);
        }, options);
    }

    public async readById(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<User> {
        return this.execInTransaction<User>(async queryRunner => {
            const existingUser = await queryRunner.manager.findOne(User, {
                where: { id },
                relations: ['roles'],
            });
            if(existingUser === null) {
                throw new NotFoundException(`User with id '${id}' does not exist`);
            }
            return existingUser;
        }, options);
    }

    public async update(
        id: number,
        updateUserDto: UpdateUserDto,
        options: ITransactionOptions = {},
    ): Promise<User> {
        return this.execInTransaction<User>(async queryRunner => {

            const existingUser = await queryRunner.manager.findOneBy(User, { id });
		    if(!existingUser) {
			    throw new NotFoundException(`User with id '${id}' does not exist`);
		    }

            if(updateUserDto.login && (await queryRunner.manager.exists(User, {
                where: {
                    id: Not(id),
                    login: updateUserDto.login,
                }
            }))) {
                throw new BadRequestException(`User with login '${updateUserDto.login}' already exists`);
            }

            if(updateUserDto.password) {
                if(!(await this.verifyPassword({
                    login: existingUser.login,
                    password: updateUserDto.currentPassword ? updateUserDto.currentPassword : '',
                }, { queryRunner }))) {
                    throw new BadRequestException('Current password is incorrect');
                }
            }

            if(updateUserDto.roles) {
                if(new Set(updateUserDto.roles).size !== updateUserDto.roles.length) {
                    throw new BadRequestException(`Roles array has duplicate values`);
                }

                const roleEntities = (await this.roleService.readAll({
                    filter: {
                        ids: updateUserDto.roles,
                    },
                    queryRunner: queryRunner,
                })).entities;

                if(roleEntities.length !== updateUserDto.roles.length) {
                    throw new BadRequestException(`One or several roles of roles array do not exist`);
                }

                await queryRunner.manager.delete(UserToRole, { user: existingUser });

                await queryRunner.manager.createQueryBuilder()
                    .insert()
                    .into(UserToRole)
                    .values(roleEntities.map(el => ({
                        user: existingUser,
                        role: el,
                    })))
                    .execute();
            }

            const { roles, currentPassword, ...userFields } = updateUserDto;
            let updatedUser = {
                ...userFields,
            }
            if(updateUserDto.password) {
                updatedUser.password = await argon2.hash(updatedUser.password);
            }

            await queryRunner.manager.update(User, id, updatedUser);
            return this.readById(id, { queryRunner });
        }, options);
    }

    public async delete(
        id: number,
        options: ITransactionOptions = {},
    ): Promise<void> {
        return this.execInTransaction<void>(async queryRunner => {
            const existingUser = await this.readById(id, { queryRunner });
            if(!existingUser) {
                throw new NotFoundException(`User with id '${id}' does not exist`);
            }

            await queryRunner.manager.delete(UserToRole, { user: existingUser });

            await queryRunner.manager.delete(User, id);
        }, options);
    }

    public async verifyPassword(
        verifyUserDto: VerifyUserDto,
        options: ITransactionOptions = {},
    ): Promise<boolean> {
        return this.execInTransaction<boolean>(async queryRunner => {
            const existingUser = await queryRunner.manager.findOne(User, {
                select: ['id', 'login', 'password'],
                where: {
                    login: verifyUserDto.login,
                }
            });
		    if(!existingUser) {
			    throw new NotFoundException(`User with login '${verifyUserDto.login}' does not exist`);
		    }  
            return await argon2.verify(existingUser.password, verifyUserDto.password);
        }, options);
    }

    public async readByLogin(
        login: string,
        options: ITransactionOptions = {},
    ): Promise<User> {
        return this.execInTransaction<User>(async queryRunner => {
            const existingUser = await queryRunner.manager.findOne(User, {
                where: { login },
                relations: ['roles'],
            });
            if(existingUser === null) {
                throw new NotFoundException(`User with login '${login}' does not exist`);
            }
            return existingUser;
        }, options);
    }
}

