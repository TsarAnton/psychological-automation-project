import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Student } from "../entities/student.entity";
import { StudentService } from "../services/student.service";
import { CreateStudentDto, ReadAllStudentsDto, ReadOneStudentDto, UpdateStudentDto } from "../dto/student.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";

@Controller('students')
export class StudentController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private studentService: StudentService,
    ) {
        super(dataSource);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAllAction(
        @Query() readAllStudentsDto: ReadAllStudentsDto,
    ): Promise<ReadAllResult<Student>> {
        const { pagination, sorting, ...filter } = readAllStudentsDto;
        return this.studentService.readAll({
            pagination,
            sorting,
            filter,
        });
    }

    @Get('/one')
    @HttpCode(HttpStatus.OK)
    public async getOneByAction(
        @Query() readOneStudentDto: ReadOneStudentDto,
    ): Promise<Student> {
        return await this.studentService.readOneBy(readOneStudentDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Student> {
        return await this.studentService.readById(id);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createStudentDto: CreateStudentDto,
    ): Promise<Student> {
        return this.studentService.create(createStudentDto);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateStudentDto: UpdateStudentDto,
    ): Promise<Student> {
        return this.studentService.update(id, updateStudentDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.studentService.delete(id);
    }
}