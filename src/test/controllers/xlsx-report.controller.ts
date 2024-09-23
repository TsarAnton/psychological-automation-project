import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards, Res } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HasRoles } from "src/auth/decorators/has-role.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { XlsxReportService } from "../services/xlsx-report.service";
import { DataSource } from "typeorm";
import { BaseController } from "src/common/classes/base-controller";
import { ReadAllResult } from "src/common/types/read-all-result.types";
import { ReadXlsxReportDto } from "../dto/xlsx-report.dto";
import { Faculty } from "src/student/entities/faculty.entity";
import { Response } from 'express';

@ApiTags('Xlsx [available for admins, specialists]')
// @ApiBearerAuth()
// @HasRoles("admin", "specialist")
// @UseGuards(RolesGuard)
// @UseGuards(AuthGuard("jwt"))
@Controller('xlsx')
export class XlsxReportController extends BaseController {
    constructor(
        protected dataSource: DataSource,
        private xlsxReportService: XlsxReportService,
    ) {
        super(dataSource);
    }

    @ApiOperation({ summary: "Return data for xlsx report" })
    @ApiResponse({ status: HttpStatus.OK, description: "Data has succesfully returned", type: ReadAllResult })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get()
    @HttpCode(HttpStatus.OK)
    public async getDataAction(
        @Query() readXlsxReportDto: ReadXlsxReportDto,
    ): Promise<ReadAllResult<Faculty>> {
        const {sorting, pagination, ...filter } = readXlsxReportDto;
        return await this.xlsxReportService.readData({
            pagination,
            sorting,
            filter,
        });
    }

    @ApiOperation({ summary: "Get report as xlsx document (pagination is not used)" })
    @ApiResponse({ status: HttpStatus.OK, description: "Xlsx document has succesfully returned", type: Response })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden" })
    @Get('/document')
    @HttpCode(HttpStatus.OK)
    public async getXlsxDocumnetAction(
        @Res() res: Response,
        @Query() readXlsxReportDto: ReadXlsxReportDto,
    ): Promise<Response> {
        const { pagination, sorting, ...filter } = readXlsxReportDto;
        const documnet = await this.xlsxReportService.getXlsxDocument({
            sorting,
            filter,
        });

        const buffer = await documnet.xlsx.writeBuffer();
        return res.set('Content-Disposition', `attachment; filename=example.xlsx`).send(buffer);
    }
}