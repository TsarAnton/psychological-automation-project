import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Role } from "../entities/role.entity";
import { RoleService } from "../services/role.service";
import { CreateRoleDto, ReadAllRolesDto, ReadOneRoleDto, UpdateRoleDto } from "../dto/role.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HasRoles } from "../decorators/has-role.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../guards/roles.guard";

@ApiTags('Role [available for admins]')
@ApiBearerAuth('JWT authorization')
@HasRoles("admin")
@UseGuards(RolesGuard)
@UseGuards(AuthGuard("jwt"))
@Controller('roles')
export class RoleController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private roleService: RoleService,
    ) {
        super(dataSource);
    }

    @ApiOperation({ summary: "Return all roles with provided pagination, sorting, filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Roles have succesfully returned", type: ReadAllResult })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
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

    @ApiOperation({ summary: "Returns a role with provided filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Role has succesfully returned", type: Role })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Such role does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "One of properties must be defined" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get('/one')
    @HttpCode(HttpStatus.OK)
    public async getOneByAction(
        @Query() readOneRoleDto: ReadOneRoleDto,
    ): Promise<Role> {
        return await this.roleService.readOneBy(readOneRoleDto);
    }

    @ApiOperation({ summary: "Returns a role with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Role has succesfully returned", type: Role })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Role with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Role> {
        return await this.roleService.readById(id);
    }

    @ApiOperation({ summary: "Create a new role" })
    @ApiResponse({ status: HttpStatus.OK, description: "Role has succesfully created", type: Role })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Role with provided name already exists" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createRoleDto: CreateRoleDto,
    ): Promise<Role> {
        return this.roleService.create(createRoleDto);
    }

    @ApiOperation({ summary: "Update a role with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Role has succesfully updated", type: Role })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User with such id does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Role with provided name already exists" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateRoleDto: UpdateRoleDto,
    ): Promise<Role> {
        return this.roleService.update(id, updateRoleDto);
    }

    @ApiOperation({ summary: "Delete a role with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Role has succesfully deleted" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Role with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.roleService.delete(id);
    }
}