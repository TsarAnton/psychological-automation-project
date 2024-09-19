import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Criterion } from "../entities/criterion.entity";
import { CriterionService } from "../services/criterion.service";
import { CreateCriterionDto, ReadAllCriteriaDto, UpdateCriterionDto } from "../dto/criterion.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";

@Controller('criteria')
export class CriterionController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private criterionService: CriterionService,
    ) {
        super(dataSource);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAllAction(
        @Query() readAllCriteriaDto: ReadAllCriteriaDto,
    ): Promise<ReadAllResult<Criterion>> {
        const { pagination, sorting, ...filter } = readAllCriteriaDto;
        return this.criterionService.readAll({
            pagination,
            sorting,
            filter,
        });
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Criterion> {
        return await this.criterionService.readById(id);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createCriterionDto: CreateCriterionDto,
    ): Promise<Criterion> {
        return this.criterionService.create(createCriterionDto);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateCriterionDto: UpdateCriterionDto,
    ): Promise<Criterion> {
        return this.criterionService.update(id, updateCriterionDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.criterionService.delete(id);
    }
}