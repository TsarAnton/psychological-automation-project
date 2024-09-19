import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Method } from "../entities/method.entity";
import { MethodService } from "../services/method.service";
import { AvailMethodsDto, CreateFullMethodDto, CreateMethodDto, DisableMethodsDto, ReadAllMethodsDto, ReadAvailableMethodsDto, ReadFullMethodDto, UpdateMethodDto } from "../dto/method.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";

@Controller('methods')
export class MethodController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private methodService: MethodService,
    ) {
        super(dataSource);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAllAction(
        @Query() readAllMethodsDto: ReadAllMethodsDto,
    ): Promise<ReadAllResult<Method>> {
        const { pagination, sorting, ...filter } = readAllMethodsDto;
        return this.methodService.readAll({
            pagination,
            sorting,
            filter,
        });
    }

    @Get('/full')
    @HttpCode(HttpStatus.OK)
    public async getOneFullAction(
        @Query() readFullMethodDto: ReadFullMethodDto,
    ): Promise<Method> {
        return this.methodService.readFullById(readFullMethodDto);
    }

    @Get('/available')
    @HttpCode(HttpStatus.OK)
    public async getAllAvailableAction(
        @Query() readAvailableMethodsDto: ReadAvailableMethodsDto,
    ): Promise<ReadAllResult<Method>> {
        const { pagination, sorting, ...filter } = readAvailableMethodsDto;
        return this.methodService.readAvailableMethods({
            pagination,
            sorting,
            filter,
        });
    }

    @Post("/available")
    @HttpCode(HttpStatus.OK)
    public async createAvailableAction(
        @Body() availMethodsDto: AvailMethodsDto,
    ): Promise<ReadAllResult<Method>> {
        console.log(availMethodsDto)
        return this.methodService.availMethods(availMethodsDto);
    }

    @Delete('/available')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAvailableAction(
        @Query() disableMethodsDto: DisableMethodsDto,
    ): Promise<void> {
        return this.methodService.disableMethod(disableMethodsDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Method> {
        return await this.methodService.readById(id);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createMethodDto: CreateMethodDto,
    ): Promise<Method> {
        return this.methodService.create(createMethodDto);
    }

    @Post('/full')
    @HttpCode(HttpStatus.OK)
    public async createFullAction(
        @Body() createFullMethodDto: CreateFullMethodDto,
    ): Promise<Method> {
        return this.methodService.createFull(createFullMethodDto);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateMethodDto: UpdateMethodDto,
    ): Promise<Method> {
        return this.methodService.update(id, updateMethodDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.methodService.delete(id);
    }
}