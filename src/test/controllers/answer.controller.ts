import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Answer } from "../entities/answer.entity";
import { AnswerService } from "../services/answer.service";
import { CreateAnswerDto, ReadAllAnswersDto, UpdateAnswerDto } from "../dto/answer.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";

@Controller('answers')
export class AnswerController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private answerService: AnswerService,
    ) {
        super(dataSource);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAllAction(
        @Query() readAllAnswersDto: ReadAllAnswersDto,
    ): Promise<ReadAllResult<Answer>> {
        const { pagination, sorting, ...filter } = readAllAnswersDto;
        return this.answerService.readAll({
            pagination,
            sorting,
            filter,
        });
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Answer> {
        return await this.answerService.readById(id);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createAnswerDto: CreateAnswerDto,
    ): Promise<Answer> {
        return this.answerService.create(createAnswerDto);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateAnswerDto: UpdateAnswerDto,
    ): Promise<Answer> {
        return this.answerService.update(id, updateAnswerDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.answerService.delete(id);
    }
}