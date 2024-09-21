import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Question } from "../entities/question.entity";
import { QuestionService } from "../services/question.service";
import { CreateQuestionDto, ReadAllQuestionsDto, ReadOneQuestionDto, UpdateQuestionDto } from "../dto/question.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HasRoles } from "src/auth/decorators/has-role.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/auth/guards/roles.guard";

@ApiTags('Question [available for admins, specialists]')
@ApiBearerAuth()
@HasRoles("admin", "specialist")
@UseGuards(RolesGuard)
@UseGuards(AuthGuard("jwt"))
@Controller('questions')
export class QuestionController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private questionService: QuestionService,
    ) {
        super(dataSource);
    }

    @ApiOperation({ summary: "Return all questions with provided pagination, sorting, filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Questions have succesfully returned", type: ReadAllResult })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
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

    @ApiOperation({ summary: "Returns a question with provided filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Question has succesfully returned", type: Question })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Such question does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "One of properties must be defined" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get('/one')
    @HttpCode(HttpStatus.OK)
    public async getOneByAction(
        @Query() readOneQuestionDto: ReadOneQuestionDto,
    ): Promise<Question> {
        return await this.questionService.readOneBy(readOneQuestionDto);
    }

    @ApiOperation({ summary: "Returns a question with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Question has succesfully returned", type: Question })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Question with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Question> {
        return await this.questionService.readById(id);
    }

    @ApiOperation({ summary: "Create a new question" })
    @ApiResponse({ status: HttpStatus.OK, description: "Question has succesfully created", type: Question })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Method with provided id does not exist; Method already has question with provided index" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createQuestionDto: CreateQuestionDto,
    ): Promise<Question> {
        return this.questionService.create(createQuestionDto);
    }

    @ApiOperation({ summary: "Update an question with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Question has succesfully updated", type: Question })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Question with such id does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Method with provided id does not exist; Method already has question with provided index" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateQuestionDto: UpdateQuestionDto,
    ): Promise<Question> {
        return this.questionService.update(id, updateQuestionDto);
    }

    @ApiOperation({ summary: "Delete an question with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Question has succesfully deleted" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Question with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.questionService.delete(id);
    }
}