import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Role } from "../entities/role.entity";
import { RoleService } from "../services/role.service";
import { CreateRoleDto, ReadAllRolesDto, ReadOneRoleDto, UpdateRoleDto } from "../dto/role.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";

@Controller('roles')
export class RoleController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private roleService: RoleService,
    ) {
        super(dataSource);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAllAction(
        @Query() readAllRolesDto: ReadAllRolesDto,
    ): Promise<ReadAllResult<Role>> {
        const { pagination, sorting, ...filter } = readAllRolesDto;
        return this.roleService.readAll({
            pagination,
            sorting,
            filter,
        });
    }

    @Get('/one')
    @HttpCode(HttpStatus.OK)
    public async getOneByAction(
        @Query() readOneRoleDto: ReadOneRoleDto,
    ): Promise<Role> {
        return await this.roleService.readOneBy(readOneRoleDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Role> {
        return await this.roleService.readById(id);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createRoleDto: CreateRoleDto,
    ): Promise<Role> {
        return this.roleService.create(createRoleDto);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateRoleDto: UpdateRoleDto,
    ): Promise<Role> {
        return this.roleService.update(id, updateRoleDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.roleService.delete(id);
    }
}