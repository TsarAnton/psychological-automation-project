import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Student } from "../entities/student.entity";
import { StudentService } from "../services/student.service";
import { CreateStudentDto, ReadAllStudentsDto, ReadOneStudentDto, UpdateStudentDto } from "../dto/student.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HasRoles } from "src/auth/decorators/has-role.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { AuthGuard } from "@nestjs/passport";

@ApiTags('Student [available for admins, specialists]')
@ApiBearerAuth('JWT authorization')
@HasRoles("admin", "specialist")
@UseGuards(RolesGuard)
@UseGuards(AuthGuard("jwt"))
@Controller('students')
export class StudentController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private studentService: StudentService,
    ) {
        super(dataSource);
    }

    @ApiOperation({ summary: "Return all students with provided pagination, sorting, filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Students have succesfully returned", type: ReadAllResult })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
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

    @ApiOperation({ summary: "Returns a student with provided filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Student has succesfully returned", type: Student })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Such student does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "One of properties must be defined" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get('/one')
    @HttpCode(HttpStatus.OK)
    public async getOneByAction(
        @Query() readOneStudentDto: ReadOneStudentDto,
    ): Promise<Student> {
        return await this.studentService.readOneBy(readOneStudentDto);
    }

    @ApiOperation({ summary: "Returns a student with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Student has succesfully returned", type: Student })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Student with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Student> {
        return await this.studentService.readById(id);
    }

    @ApiOperation({ summary: "Create a new student" })
    @ApiResponse({ status: HttpStatus.OK, description: "Student has succesfully created", type: Student })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Group with provided id does not exist; Student with provided record book number already exists" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createStudentDto: CreateStudentDto,
    ): Promise<Student> {
        return this.studentService.create(createStudentDto);
    }

    @ApiOperation({ summary: "Update a student with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Student has succesfully updated", type: Student })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Student with such id does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Group with provided id does not exist; Student with provided record book number already exists" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateStudentDto: UpdateStudentDto,
    ): Promise<Student> {
        return this.studentService.update(id, updateStudentDto);
    }

    @ApiOperation({ summary: "Delete a student with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Student has succesfully deleted" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Student with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.studentService.delete(id);
    }
}