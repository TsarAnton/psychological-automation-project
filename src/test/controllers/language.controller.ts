import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Language } from "../entities/language.entity";
import { LanguageService } from "../services/language.service";
import { CreateLanguageDto, ReadAllLanguagesDto, UpdateLanguageDto } from "../dto/language.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";

@Controller('languages')
export class LanguageController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private languageService: LanguageService,
    ) {
        super(dataSource);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAllAction(
        @Query() readAllLanguagesDto: ReadAllLanguagesDto,
    ): Promise<ReadAllResult<Language>> {
        const { pagination, sorting, ...filter } = readAllLanguagesDto;
        return this.languageService.readAll({
            pagination,
            sorting,
            filter,
        });
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Language> {
        return await this.languageService.readById(id);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createLanguageDto: CreateLanguageDto,
    ): Promise<Language> {
        return this.languageService.create(createLanguageDto);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateLanguageDto: UpdateLanguageDto,
    ): Promise<Language> {
        return this.languageService.update(id, updateLanguageDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.languageService.delete(id);
    }
}