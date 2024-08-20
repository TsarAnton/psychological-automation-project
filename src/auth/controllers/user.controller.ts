import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { DataSource } from "typeorm";

import { User } from "../entities/user.entity";
import { UserService } from "../services/user.service";
import { CreateUserDto, ReadAllUsersDto, UpdateUserDto } from "../dto/user.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";

@Controller('users')
export class UserController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private userService: UserService,
    ) {
        super(dataSource);
    }

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

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<User> {
        return await this.userService.readById(id);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createUserDto: CreateUserDto,
    ): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.userService.delete(id);
    }
}