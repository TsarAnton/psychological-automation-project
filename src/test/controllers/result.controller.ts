import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Result } from "../entities/result.entity";
import { ResultService } from "../services/result.service";
import { CreateResultDto, ReadAllResultsDto, ReadFullResultsDto, ReadOneResultDto, UpdateResultDto } from "../dto/result.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";

@Controller('results')
export class ResultController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private resultService: ResultService,
    ) {
        super(dataSource);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAllAction(
        @Query() readAllResultsDto: ReadAllResultsDto,
    ): Promise<ReadAllResult<Result>> {
        const { pagination, sorting, ...filter } = readAllResultsDto;
        return this.resultService.readAll({
            pagination,
            sorting,
            filter,
        });
    }

    @Get('/one')
    @HttpCode(HttpStatus.OK)
    public async getOneByAction(
        @Query() readOneResultDto: ReadOneResultDto,
    ): Promise<Result> {
        return await this.resultService.readOneBy(readOneResultDto);
    }

    @Get('/full')
    @HttpCode(HttpStatus.OK)
    public async getOneFullAction(
        @Query() readFullResultDto: ReadFullResultsDto,
    ): Promise<Result> {
        return this.resultService.readFullById(readFullResultDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Result> {
        return await this.resultService.readById(id);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createResultDto: CreateResultDto,
    ): Promise<Result> {
        return this.resultService.create(createResultDto);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateResultDto: UpdateResultDto,
    ): Promise<Result> {
        return this.resultService.update(id, updateResultDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.resultService.delete(id);
    }
}