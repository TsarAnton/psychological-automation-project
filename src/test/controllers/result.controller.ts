import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Result } from "../entities/result.entity";
import { ResultService } from "../services/result.service";
import { CreateResultDto, ReadAllResultsDto, ReadFullResultsDto, ReadOneResultDto, UpdateResultDto } from "../dto/result.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { HasRoles } from "src/auth/decorators/has-role.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";

@ApiTags('Result [available for admins, specialists]')
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))  
@Controller('results')
export class ResultController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private resultService: ResultService,
    ) {
        super(dataSource);
    }

    @ApiOperation({ summary: "[Available for students] Return all results with provided pagination, sorting, filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Results have succesfully returned", type: ReadAllResult })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAllAction(
        @Query() readAllResultsDto: ReadAllResultsDto,
    ): Promise<ReadAllResult<Result>> {
        const { pagination, sorting, ...filter } = readAllResultsDto;
        return this.resultService.readAll({
            pagination,
            sorting,
            filter,
        });
    }

    @ApiOperation({ summary: "[Available for students] Returns a result with provided filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Result has succesfully returned", type: Result })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Such result does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "One of properties must be defined" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get('/one')
    @HttpCode(HttpStatus.OK)
    public async getOneByAction(
        @Query() readOneResultDto: ReadOneResultDto,
    ): Promise<Result> {
        return await this.resultService.readOneBy(readOneResultDto);
    }

    @ApiOperation({ summary: "[Available for students] Returns a full result (with answers) with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Full result has succesfully returned", type: Result })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Result with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get('/full')
    @HttpCode(HttpStatus.OK)
    public async getOneFullAction(
        @Query() readFullResultDto: ReadFullResultsDto,
    ): Promise<Result> {
        return this.resultService.readFullById(readFullResultDto);
    }

    @ApiOperation({ summary: "[Available for students] Returns a result with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Result has succesfully returned", type: Result })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Result with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Result> {
        return await this.resultService.readById(id);
    }

    @ApiOperation({ summary: "[Available for students] Create a new result, delete entry with provided student and method from available_methods table" })
    @ApiResponse({ status: HttpStatus.OK, description: "Result has succesfully created", type: Result })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Method with provided id does not exist; Method already has result with provided index" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createResultDto: CreateResultDto,
    ): Promise<Result> {
        return this.resultService.create(createResultDto);
    }

    @ApiOperation({ summary: "Update an result with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Result has succesfully updated", type: Result })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Result with such id does not exist; Method with such id does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @HasRoles("admin", "specialist")
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard("jwt"))
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateResultDto: UpdateResultDto,
    ): Promise<Result> {
        return this.resultService.update(id, updateResultDto);
    }

    @ApiOperation({ summary: "Delete an result with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Result has succesfully deleted" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Result with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @HasRoles("admin", "specialist")
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard("jwt"))
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.resultService.delete(id);
    }
}