import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Faculty } from "../entities/faculty.entity";
import { FacultyService } from "../services/faculty.service";
import { CreateFacultyDto, ReadAllFacultiesDto, UpdateFacultyDto } from "../dto/faculty.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";

@Controller('faculties')
export class FacultyController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private facultyService: FacultyService,
    ) {
        super(dataSource);
    }

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

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Faculty> {
        return await this.facultyService.readById(id);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createFacultyDto: CreateFacultyDto,
    ): Promise<Faculty> {
        return this.facultyService.create(createFacultyDto);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateFacultyDto: UpdateFacultyDto,
    ): Promise<Faculty> {
        return this.facultyService.update(id, updateFacultyDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.facultyService.delete(id);
    }
}