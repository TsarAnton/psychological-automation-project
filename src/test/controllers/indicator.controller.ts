import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Indicator } from "../entities/indicator.entity";
import { IndicatorService } from "../services/indicator.service";
import { CreateIndicatorDto, ReadAllIndicatorsDto, ReadOneIndicatorDto, UpdateIndicatorDto } from "../dto/indicator.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";

@Controller('indicators')
export class IndicatorController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private indicatorService: IndicatorService,
    ) {
        super(dataSource);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAllAction(
        @Query() readAllIndicatorsDto: ReadAllIndicatorsDto,
    ): Promise<ReadAllResult<Indicator>> {
        const { pagination, sorting, ...filter } = readAllIndicatorsDto;
        return this.indicatorService.readAll({
            pagination,
            sorting,
            filter,
        });
    }

    @Get('/one')
    @HttpCode(HttpStatus.OK)
    public async getOneByAction(
        @Query() readOneIndicatorDto: ReadOneIndicatorDto,
    ): Promise<Indicator> {
        return await this.indicatorService.readOneBy(readOneIndicatorDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Indicator> {
        return await this.indicatorService.readById(id);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createIndicatorDto: CreateIndicatorDto,
    ): Promise<Indicator> {
        return this.indicatorService.create(createIndicatorDto);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateIndicatorDto: UpdateIndicatorDto,
    ): Promise<Indicator> {
        return this.indicatorService.update(id, updateIndicatorDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.indicatorService.delete(id);
    }
}