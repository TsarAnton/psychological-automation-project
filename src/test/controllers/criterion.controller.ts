import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Criterion } from "../entities/criterion.entity";
import { CriterionService } from "../services/criterion.service";
import { CreateCriterionDto, ReadAllCriteriaDto, ReadOneCriterionDto, UpdateCriterionDto } from "../dto/criterion.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HasRoles } from "src/auth/decorators/has-role.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { AuthGuard } from "@nestjs/passport";

@ApiTags('Criterion [available for admins, specialists]')
@ApiBearerAuth('JWT authorization')
@HasRoles("admin", "specialist")
@UseGuards(RolesGuard)
@UseGuards(AuthGuard("jwt"))
@Controller('criteria')
export class CriterionController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private criterionService: CriterionService,
    ) {
        super(dataSource);
    }

    @ApiOperation({ summary: "Return all criteria with provided pagination, sorting, filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Criteria have succesfully returned", type: ReadAllResult })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAllAction(
        @Query() readAllCriteriaDto: ReadAllCriteriaDto,
    ): Promise<ReadAllResult<Criterion>> {
        const { pagination, sorting, ...filter } = readAllCriteriaDto;
        return this.criterionService.readAll({
            pagination,
            sorting,
            filter,
        });
    }

    @ApiOperation({ summary: "Returns a criterion with provided filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Criterion has succesfully returned", type: Criterion })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Such criterion does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "One of properties must be defined" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get('/one')
    @HttpCode(HttpStatus.OK)
    public async getOneByAction(
        @Query() readOneCriterionDto: ReadOneCriterionDto,
    ): Promise<Criterion> {
        return await this.criterionService.readOneBy(readOneCriterionDto);
    }

    @ApiOperation({ summary: "Returns a criterion with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Criterion has succesfully returned", type: Criterion })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Criterion with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Criterion> {
        return await this.criterionService.readById(id);
    }

    @ApiOperation({ summary: "Create a new criterion" })
    @ApiResponse({ status: HttpStatus.OK, description: "Criterion has succesfully created", type: Criterion })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Indicator with provided id does not exist; Indicator has overlapped intervals" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createCriterionDto: CreateCriterionDto,
    ): Promise<Criterion> {
        return this.criterionService.create(createCriterionDto);
    }

    @ApiOperation({ summary: "Update a criterion with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Criterion has succesfully updated", type: Criterion })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Criterion with such id does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Indicator with provided id does not exist; Indicator has overlapped intervals" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateCriterionDto: UpdateCriterionDto,
    ): Promise<Criterion> {
        return this.criterionService.update(id, updateCriterionDto);
    }

    @ApiOperation({ summary: "Delete a criterion with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Criterion has succesfully deleted" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Criterion with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.criterionService.delete(id);
    }
}