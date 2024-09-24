import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Answer } from "../entities/answer.entity";
import { AnswerService } from "../services/answer.service";
import { CreateAnswerDto, ReadAllAnswersDto, ReadOneAnswerDto, UpdateAnswerDto } from "../dto/answer.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HasRoles } from "src/auth/decorators/has-role.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { AuthGuard } from "@nestjs/passport";

@ApiTags('Answer [available for admins, specialists]')
@ApiBearerAuth('JWT authorization')
@HasRoles("admin", "specialist")
@UseGuards(RolesGuard)
@UseGuards(AuthGuard("jwt"))
@Controller('answers')
export class AnswerController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private answerService: AnswerService,
    ) {
        super(dataSource);
    }

    @ApiOperation({ summary: "Return all answers with provided pagination, sorting, filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Answers have succesfully returned", type: ReadAllResult })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
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

    @ApiOperation({ summary: "Returns an answer with provided filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Answer has succesfully returned", type: Answer })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Such answer does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "One of properties must be defined" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get('/one')
    @HttpCode(HttpStatus.OK)
    public async getOneByAction(
        @Query() readOneAnswerDto: ReadOneAnswerDto,
    ): Promise<Answer> {
        return await this.answerService.readOneBy(readOneAnswerDto);
    }

    @ApiOperation({ summary: "Returns an answer with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Answer has succesfully returned", type: Answer })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Answer with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Answer> {
        return await this.answerService.readById(id);
    }

    @ApiOperation({ summary: "Create a new answer" })
    @ApiResponse({ status: HttpStatus.OK, description: "Answer has succesfully created", type: Answer })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Question with provided id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createAnswerDto: CreateAnswerDto,
    ): Promise<Answer> {
        return this.answerService.create(createAnswerDto);
    }

    @ApiOperation({ summary: "Update an answer with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Answer has succesfully updated", type: Answer })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Answer with such id does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Question with provided id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateAnswerDto: UpdateAnswerDto,
    ): Promise<Answer> {
        return this.answerService.update(id, updateAnswerDto);
    }

    @ApiOperation({ summary: "Delete an answer with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Answer has succesfully deleted" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Answer with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.answerService.delete(id);
    }
}