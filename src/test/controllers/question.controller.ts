import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Question } from "../entities/question.entity";
import { QuestionService } from "../services/question.service";
import { CreateQuestionDto, ReadAllQuestionsDto, UpdateQuestionDto } from "../dto/question.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";

@Controller('questions')
export class QuestionController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private questionService: QuestionService,
    ) {
        super(dataSource);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAllAction(
        @Query() readAllQuestionsDto: ReadAllQuestionsDto,
    ): Promise<ReadAllResult<Question>> {
        const { pagination, sorting, ...filter } = readAllQuestionsDto;
        return this.questionService.readAll({
            pagination,
            sorting,
            filter,
        });
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Question> {
        return await this.questionService.readById(id);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createQuestionDto: CreateQuestionDto,
    ): Promise<Question> {
        return this.questionService.create(createQuestionDto);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateQuestionDto: UpdateQuestionDto,
    ): Promise<Question> {
        return this.questionService.update(id, updateQuestionDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.questionService.delete(id);
    }
}