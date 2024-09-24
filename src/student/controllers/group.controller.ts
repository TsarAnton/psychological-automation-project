import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Group } from "../entities/group.entity";
import { GroupService } from "../services/group.service";
import { CreateGroupDto, ReadAllGroupsDto, ReadOneGroupDto, UpdateGroupDto } from "../dto/group.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HasRoles } from "src/auth/decorators/has-role.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { AuthGuard } from "@nestjs/passport";

@ApiTags('Group [available for admins, specialists]')
@ApiBearerAuth('JWT authorization')
@HasRoles("admin", "specialist")
@UseGuards(RolesGuard)
@UseGuards(AuthGuard("jwt"))
@Controller('groups')
export class GroupController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private groupService: GroupService,
    ) {
        super(dataSource);
    }

    @ApiOperation({ summary: "Return all groups with provided pagination, sorting, filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Groups have succesfully returned", type: ReadAllResult })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
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

    @ApiOperation({ summary: "Returns a group with provided filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Group has succesfully returned", type: Group })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Such group does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "One of properties must be defined" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get('/one')
    @HttpCode(HttpStatus.OK)
    public async getOneByAction(
        @Query() readOneGroupDto: ReadOneGroupDto,
    ): Promise<Group> {
        return await this.groupService.readOneBy(readOneGroupDto);
    }

    @ApiOperation({ summary: "Returns a group with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Group has succesfully returned", type: Group })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Group with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Group> {
        return await this.groupService.readById(id);
    }

    @ApiOperation({ summary: "Create a new group" })
    @ApiResponse({ status: HttpStatus.OK, description: "Group has succesfully created", type: Group })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Faculty with provided id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createGroupDto: CreateGroupDto,
    ): Promise<Group> {
        return this.groupService.create(createGroupDto);
    }

    @ApiOperation({ summary: "Update a group with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Group has succesfully updated", type: Group })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Group with such id does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Faculty with provided id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateGroupDto: UpdateGroupDto,
    ): Promise<Group> {
        return this.groupService.update(id, updateGroupDto);
    }

    @ApiOperation({ summary: "Delete a group (and it's students) with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Group has succesfully deleted" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Group with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.groupService.delete(id);
    }
}