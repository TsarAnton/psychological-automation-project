import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Indicator } from "../entities/indicator.entity";
import { IndicatorService } from "../services/indicator.service";
import { CreateIndicatorDto, ReadAllIndicatorsDto, ReadOneIndicatorDto, UpdateIndicatorDto } from "../dto/indicator.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HasRoles } from "src/auth/decorators/has-role.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { AuthGuard } from "@nestjs/passport";

@ApiTags('Indicator [available for admins, specialists]')
@ApiBearerAuth('JWT authorization')
@HasRoles("admin", "specialist")
@UseGuards(RolesGuard)
@UseGuards(AuthGuard("jwt"))
@Controller('indicators')
export class IndicatorController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private indicatorService: IndicatorService,
    ) {
        super(dataSource);
    }

    @ApiOperation({ summary: "Return all indicators with provided pagination, sorting, filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Indicators have succesfully returned", type: ReadAllResult })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAllAction(
        @Query() readAllIndicatorsDto: ReadAllIndicatorsDto,
    ): Promise<ReadAllResult<Indicator>> {
        const { pagination, sorting, ...filter } = readAllIndicatorsDto;
        return this.indicatorService.readAll({
            pagination,
            sorting,
            filter,
        });
    }

    @ApiOperation({ summary: "Returns an indicator with provided filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Indicator has succesfully returned", type: Indicator })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Such indicator does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "One of properties must be defined" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get('/one')
    @HttpCode(HttpStatus.OK)
    public async getOneByAction(
        @Query() readOneIndicatorDto: ReadOneIndicatorDto,
    ): Promise<Indicator> {
        return await this.indicatorService.readOneBy(readOneIndicatorDto);
    }

    @ApiOperation({ summary: "Returns an indicator with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Indicator has succesfully returned", type: Indicator })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Indicator with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Indicator> {
        return await this.indicatorService.readById(id);
    }

    @ApiOperation({ summary: "Create a new indicator" })
    @ApiResponse({ status: HttpStatus.OK, description: "Indicator has succesfully created", type: Indicator })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Method with provided id does not exist; Method already has indicator with provided name; Indicator is displayed, but doesn't have name and description in any language" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createIndicatorDto: CreateIndicatorDto,
    ): Promise<Indicator> {
        return this.indicatorService.create(createIndicatorDto);
    }

    @ApiOperation({ summary: "Update an indicator with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Indicator has succesfully updated", type: Indicator })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Indicator with such id does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Method with provided id does not exist; Method already has indicator with provided name; Indicator is displayed, but doesn't have name and description in any language" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateIndicatorDto: UpdateIndicatorDto,
    ): Promise<Indicator> {
        return this.indicatorService.update(id, updateIndicatorDto);
    }

    @ApiOperation({ summary: "Delete an indicator with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Indicator has succesfully deleted" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Indicator with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.indicatorService.delete(id);
    }
}