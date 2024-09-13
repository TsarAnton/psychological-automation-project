import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Group } from "../entities/group.entity";
import { GroupService } from "../services/group.service";
import { CreateGroupDto, ReadAllGroupsDto, UpdateGroupDto } from "../dto/group.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";

@Controller('groups')
export class GroupController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private groupService: GroupService,
    ) {
        super(dataSource);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAllAction(
        @Query() readAllGroupsDto: ReadAllGroupsDto,
    ): Promise<ReadAllResult<Group>> {
        const { pagination, sorting, ...filter } = readAllGroupsDto;
        return this.groupService.readAll({
            pagination,
            sorting,
            filter,
        });
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Group> {
        return await this.groupService.readById(id);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createGroupDto: CreateGroupDto,
    ): Promise<Group> {
        return this.groupService.create(createGroupDto);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateGroupDto: UpdateGroupDto,
    ): Promise<Group> {
        return this.groupService.update(id, updateGroupDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.groupService.delete(id);
    }
}