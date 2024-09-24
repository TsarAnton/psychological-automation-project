import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { DataSource } from "typeorm";

import { Method } from "../entities/method.entity";
import { MethodService } from "../services/method.service";
import { AvailMethodsDto, CreateFullMethodDto, CreateMethodDto, DisableMethodsDto, ReadAllMethodsDto, ReadAvailableMethodsDto, ReadFullMethodDto, ReadOneMethodDto, UpdateAvailableMethodsDto, UpdateMethodDto } from "../dto/method.dto";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { BaseController } from "src/common/classes/base-controller";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HasRoles } from "src/auth/decorators/has-role.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { AuthGuard } from "@nestjs/passport";

@ApiTags('Method [available for admins, specialists]')
@ApiBearerAuth('JWT authorization')
@UseGuards(AuthGuard("jwt"))  
@Controller('methods')
export class MethodController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private methodService: MethodService,
    ) {
        super(dataSource);
    }

    @ApiOperation({ summary: "Return all methods with provided pagination, sorting, filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Methods have succesfully returned", type: ReadAllResult })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })  
    @HasRoles("admin", "specialist")
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard("jwt"))
    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAllAction(
        @Query() readAllMethodsDto: ReadAllMethodsDto,
    ): Promise<ReadAllResult<Method>> {
        const { pagination, sorting, ...filter } = readAllMethodsDto;
        return this.methodService.readAll({
            pagination,
            sorting,
            filter,
        });
    }

    @ApiOperation({ summary: "Returns a method with provided filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Method has succesfully returned", type: Method })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Such method does not exist" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "One of properties must be defined" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @HasRoles("admin", "specialist")
    @UseGuards(RolesGuard)
    @Get('/one')
    @HttpCode(HttpStatus.OK)
    public async getOneByAction(
        @Query() readOneMethodDto: ReadOneMethodDto,
    ): Promise<Method> {
        return await this.methodService.readOneBy(readOneMethodDto);
    }

    @ApiOperation({ summary: "[Available for students] Returns a full method (with all questions, answers, indicators, criteria) with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Full method has succesfully returned", type: Method })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Method with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @Get('/full')
    @HttpCode(HttpStatus.OK)
    public async getOneFullAction(
        @Query() readFullMethodDto: ReadFullMethodDto,
    ): Promise<Method> {
        return this.methodService.readFullById(readFullMethodDto);
    }

    @ApiOperation({ summary: "[Available for students] Return all available methods for provided students with provided pagination, sorting, filter" })
    @ApiResponse({ status: HttpStatus.OK, description: "Available methods have succesfully returned", type: ReadAllResult })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @Get('/available')
    @HttpCode(HttpStatus.OK)
    public async getAllAvailableAction(
        @Query() readAvailableMethodsDto: ReadAvailableMethodsDto,
    ): Promise<ReadAllResult<Method>> {
        const { pagination, sorting, ...filter } = readAvailableMethodsDto;
        return this.methodService.readAvailableMethods({
            pagination,
            sorting,
            filter,
        });
    }

    @ApiOperation({ summary: "Avail provided methods for provided students" })
    @ApiResponse({ status: HttpStatus.OK, description: "Methods have succesfully availed for students", type: ReadAllResult })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "One or several of faculties, groups, students array must be defined" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @HasRoles("admin", "specialist")
    @UseGuards(RolesGuard) 
    @Post("/available")
    @HttpCode(HttpStatus.OK)
    public async createAvailableAction(
        @Body() availMethodsDto: AvailMethodsDto,
    ): Promise<ReadAllResult<Method>> {
        return this.methodService.availMethods(availMethodsDto);
    }

    @ApiOperation({ summary: "Update date_end and display_result properties for provided methods for provided students" })
    @ApiResponse({ status: HttpStatus.OK, description: "Succesfully updated", type: ReadAllResult })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "One or several of faculties, groups, students array must be defined" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @HasRoles("admin", "specialist")
    @UseGuards(RolesGuard) 
    @Put("/available")
    @HttpCode(HttpStatus.OK)
    public async updateAvailableAction(
        @Body() updateAvailableMethodsDto: UpdateAvailableMethodsDto,
    ): Promise<ReadAllResult<Method>> {
        return this.methodService.updateAvailableMethods(updateAvailableMethodsDto);
    }

    @ApiOperation({ summary: "Disable provided methods for provided students" })
    @ApiResponse({ status: HttpStatus.OK, description: "Methods have succesfully disabled for students" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Method with such name already exists" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @HasRoles("admin", "specialist")
    @UseGuards(RolesGuard)
    @Delete('/available')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAvailableAction(
        @Query() disableMethodsDto: DisableMethodsDto,
    ): Promise<void> {
        return this.methodService.disableMethod(disableMethodsDto);
    }

    @ApiOperation({ summary: "Returns a method with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Method has succesfully returned", type: Method })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Method with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @HasRoles("admin", "specialist")
    @UseGuards(RolesGuard)
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getOneAction(
        @Param('id') id: number,
    ): Promise<Method> {
        return await this.methodService.readById(id);
    }

    @ApiOperation({ summary: "Create a new method" })
    @ApiResponse({ status: HttpStatus.OK, description: "Method has succesfully created", type: Method })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @HasRoles("admin", "specialist")
    @UseGuards(RolesGuard)
    @Post()
    @HttpCode(HttpStatus.OK)
    public async createAction(
        @Body() createMethodDto: CreateMethodDto,
    ): Promise<Method> {
        return this.methodService.create(createMethodDto);
    }

    @ApiOperation({ summary: "Create a new full method (with provided questions, answers, indicators and criteria)" })
    @ApiResponse({ status: HttpStatus.OK, description: "Full method has succesfully created", type: Method })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @HasRoles("admin", "specialist")
    @UseGuards(RolesGuard)
    @Post('/full')
    @HttpCode(HttpStatus.OK)
    public async createFullAction(
        @Body() createFullMethodDto: CreateFullMethodDto,
    ): Promise<Method> {
        return this.methodService.createFull(createFullMethodDto);
    }

    @ApiOperation({ summary: "Update a method with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Method has succesfully updated", type: Method })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Method with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @HasRoles("admin", "specialist")
    @UseGuards(RolesGuard) 
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    public async updateAction(
        @Param('id') id: number,
        @Body() updateMethodDto: UpdateMethodDto,
    ): Promise<Method> {
        return this.methodService.update(id, updateMethodDto);
    }

    @ApiOperation({ summary: "Delete an method with provided id" })
    @ApiResponse({ status: HttpStatus.OK, description: "Method has succesfully deleted" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Method with such id does not exist" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @HasRoles("admin", "specialist")
    @UseGuards(RolesGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteAction(
        @Param('id') id: number,
    ): Promise<void> {
        return this.methodService.delete(id);
    }
}