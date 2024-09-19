import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Faculty } from "../entities/faculty.entity";
import { FacultyService } from "../services/faculty.service";
import { CreateFacultyDto, ReadAllFacultiesDto, ReadOneFacultyDto, UpdateFacultyDto } from "../dto/faculty.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HasRoles } from "src/auth/decorators/has-role.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { AuthGuard } from "@nestjs/passport";

@ApiTags('Faculty')
@ApiBearerAuth()
@HasRoles("admin", "specialist")
@UseGuards(RolesGuard)
@UseGuards(AuthGuard("jwt"))
@Controller('faculties')
export class FacultyController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private facultyService: FacultyService,
    ) {
        super(dataSource);
    }

    @ApiOperation({ summary: "Return all faculties with provided pagination, sorting, filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Faculties have succesfully returned", type: ReadAllResult })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAllAction(
        @Query() readAllFacultiesDto: ReadAllFacultiesDto,
    ): Promise<ReadAllResult<Faculty>> {
        const { pagination, sorting, ...filter } = readAllFacultiesDto;
        return this.facultyService.readAll({
            pagination,
            sorting,
            filter,
        });
    }

    @ApiOperation({ summary: "Returns a faculty with provided filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Faculty has succesfully returned", type: Faculty })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Such faculty does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get('/one')
    @HttpCode(HttpStatus.OK)
    public async getOneByAction(
        @Query() readOneFacultyDto: ReadOneFacultyDto,
    ): Promise<Faculty> {
        return await this.facultyService.readOneBy(readOneFacultyDto);
    }

    @ApiOperation({ summary: "Returns a faculty with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Faculty has succesfully returned", type: Faculty })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Faculty with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Faculty> {
        return await this.facultyService.readById(id);
    }

    @ApiOperation({ summary: "Create a new faculty" })
    @ApiResponse({ status: HttpStatus.OK, description: "Faculty has succesfully created", type: Faculty })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createFacultyDto: CreateFacultyDto,
    ): Promise<Faculty> {
        return this.facultyService.create(createFacultyDto);
    }

    @ApiOperation({ summary: "Update a faculty with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Faculty has succesfully updated", type: Faculty })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Faculty with such id does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateFacultyDto: UpdateFacultyDto,
    ): Promise<Faculty> {
        return this.facultyService.update(id, updateFacultyDto);
    }

    @ApiOperation({ summary: "Delete a faculty with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Faculty has succesfully deleted" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Faculty with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.facultyService.delete(id);
    }
}