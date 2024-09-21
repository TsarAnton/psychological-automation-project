import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Language } from "../entities/language.entity";
import { LanguageService } from "../services/language.service";
import { CreateLanguageDto, ReadAllLanguagesDto, ReadOneLanguageDto, UpdateLanguageDto } from "../dto/language.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HasRoles } from "src/auth/decorators/has-role.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/auth/guards/roles.guard";

@ApiTags('Language [available for admins, specialists]')
@ApiBearerAuth()
@HasRoles("admin", "specialist")
@UseGuards(RolesGuard)
@UseGuards(AuthGuard("jwt"))
@Controller('languages')
export class LanguageController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private languageService: LanguageService,
    ) {
        super(dataSource);
    }

    @ApiOperation({ summary: "Return all languages with provided pagination, sorting, filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Languages have succesfully returned", type: ReadAllResult })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
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

    @ApiOperation({ summary: "Returns a language with provided filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Language has succesfully returned", type: Language })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Such language does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "One of properties must be defined" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get('/one')
    @HttpCode(HttpStatus.OK)
    public async getOneByAction(
        @Query() readOneLanguageDto: ReadOneLanguageDto,
    ): Promise<Language> {
        return await this.languageService.readOneBy(readOneLanguageDto);
    }

    @ApiOperation({ summary: "Returns a language with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Language has succesfully returned", type: Language })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Language with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Language> {
        return await this.languageService.readById(id);
    }

    @ApiOperation({ summary: "Create a new language" })
    @ApiResponse({ status: HttpStatus.OK, description: "Language has succesfully created", type: Language })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Language with such name already exists" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createLanguageDto: CreateLanguageDto,
    ): Promise<Language> {
        return this.languageService.create(createLanguageDto);
    }

    @ApiOperation({ summary: "Update a language with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Language has succesfully updated", type: Language })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Language with such id does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Language with such name already exists" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateLanguageDto: UpdateLanguageDto,
    ): Promise<Language> {
        return this.languageService.update(id, updateLanguageDto);
    }

    @ApiOperation({ summary: "Delete an language with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Language has succesfully deleted" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Language with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.languageService.delete(id);
    }
}