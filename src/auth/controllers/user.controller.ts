import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { DataSource } from "typeorm";

import { User } from "../entities/user.entity";
import { UserService } from "../services/user.service";
import { CreateUserDto, ReadAllUsersDto, ReadOneUserDto, UpdateUserDto } from "../dto/user.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { HasRoles } from "../decorators/has-role.decorator";
import { RolesGuard } from "../guards/roles.guard";

@ApiTags('User')
@ApiBearerAuth()
@HasRoles("admin")
@UseGuards(RolesGuard)
@UseGuards(AuthGuard("jwt"))
@Controller('users')
export class UserController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private userService: UserService,
    ) {
        super(dataSource);
    }

    @ApiOperation({ summary: "Return all users with provided pagination, sorting, filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Users have succesfully returned", type: ReadAllResult })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAllAction(
        @Query() readAllUsersDto: ReadAllUsersDto,
    ): Promise<ReadAllResult<User>> {
        const { pagination, sorting, ...filter } = readAllUsersDto;
        return this.userService.readAll({
            pagination,
            sorting,
            filter,
        });
    }

    @ApiOperation({ summary: "Returns a user with provided filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "User has succesfully returned", type: User })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Such user does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get('/one')
    @HttpCode(HttpStatus.OK)
    public async getOneByAction(
        @Query() readOneUserDto: ReadOneUserDto,
    ): Promise<User> {
        return await this.userService.readOneBy(readOneUserDto);
    }

    @ApiOperation({ summary: "Returns a user with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "User has succesfully returned", type: User })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<User> {
        return await this.userService.readById(id);
    }

    @ApiOperation({ summary: "Create a new user" })
    @ApiResponse({ status: HttpStatus.OK, description: "User has succesfully created", type: User })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createUserDto: CreateUserDto,
    ): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @ApiOperation({ summary: "Update a user with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "User has succesfully updated", type: User })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User with such id does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return this.userService.update(id, updateUserDto);
    }

    @ApiOperation({ summary: "Delete a user with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "User has succesfully deleted" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "User with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.userService.delete(id);
    }
}