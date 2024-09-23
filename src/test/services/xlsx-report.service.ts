import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";

import { BaseService } from "src/common/classes/base-service";
import { ReadXlsxReportDto } from "../dto/xlsx-report.dto";
import { ITransactionOptions } from "src/common/types/transaction.types";
import { Faculty } from "src/student/entities/faculty.entity";
import { Result } from "../entities/result.entity";
import { IReadXlsxReportData } from "../types/xlsx-report.options";
import { createReadAllResultObject, ReadAllResult } from "src/common/types/read-all-result.types";
import { Workbook } from "exceljs";
import { MethodService } from "./method.service";
import * as ExcelJS from 'exceljs';

@Injectable()
export class XlsxReportService extends BaseService {
    constructor(
        protected dataSource: DataSource,
        private methodService: MethodService,
    ) {
        super(dataSource);
    }

    public async readData(
        options: IReadXlsxReportData,
    ): Promise<ReadAllResult<Faculty>> {
        return this.execInTransaction<ReadAllResult<Faculty>>(async queryRunner => {

            const subQuery = queryRunner.manager.createQueryBuilder()
                .select('MAX(subResults.date)')
                .from(Result, 'subResults')
                .where('subResults.student.id = students.id')
                .andWhere('subResults.method.id = results.method.id');

            if(options.filter.period) {
                if(options.filter.period.minDate) {
                    subQuery.andWhere('subResults.date >= :minDate', {
                        minDate: options.filter.period.minDate,
                    });
                }
                if(options.filter.period.maxDate) {
                    subQuery.andWhere('subResults.date <= :maxDate', {
                        maxDate: options.filter.period.maxDate,
                    });
                }
            }

            const queryBuilder = queryRunner.manager.createQueryBuilder()
                .select(['faculty.id', 'faculty.name'])
                .from(Faculty, 'faculty')
                .leftJoinAndSelect('faculty.groups', 'groups')
                .leftJoinAndSelect('groups.students', 'students')
                .leftJoinAndSelect('students.results', 'results', 'results.date = (' + subQuery.getQuery() + ')')
                .leftJoinAndSelect('results.method', 'method')
                .leftJoin('method.languages', 'methodLanguages', 'methodLanguages.language.id = :language', {
                    language: options.filter.language,
                })
                .leftJoin('results.indicators', 'resultIndicators')
                .leftJoinAndSelect('resultIndicators.indicator', 'indicator')
                .leftJoin('indicator.languages', 'indicatorLanguages', 'indicatorLanguages.language.id = :language')
                .leftJoinAndSelect('indicator.criteria', 'criteria', 'criteria.minValue <= resultIndicators.score AND criteria.maxValue >= resultIndicators.score')
                .addSelect([
                    'methodLanguages.name',
                    'resultIndicators.score',
                    'indicatorLanguages.name',

                ])
                .setParameters(subQuery.getParameters())
                .orderBy('faculty.id', 'ASC')
                .addOrderBy('groups.id', 'ASC')
                .addOrderBy('students.id', 'ASC')
                .addOrderBy('method.id', 'ASC')
                .addOrderBy('indicator.id');

            if(options.filter.faculties) {
                queryBuilder.andWhere('faculty.id IN (:...faculties)', {
                    faculties: options.filter.faculties,
                });
            }
            if(options.filter.groups) {
                queryBuilder.andWhere('groups.id IN (:...groupIds)', {
                    groupIds: options.filter.groups,
                });
            }
            if(options.filter.methods) {
                queryBuilder.andWhere('method.id IN (:...methods)', {
                    methods: options.filter.methods,
                });
            }
            if(options.filter.students) {
                queryBuilder.andWhere('students.id IN (:...studentIds)', {
                    studentIds: options.filter.students,
                });
            }

            if(options.sorting) {
                queryBuilder.orderBy(options.sorting.column, options.sorting.direction);
            }

            if(options.pagination) {
                queryBuilder.skip(options.pagination.page * options.pagination.size).take(options.pagination.size);
            }

            const [ entities, count ] = await queryBuilder.getManyAndCount();

            return createReadAllResultObject<Faculty>(options, count, entities);
            
        }, options);
    }

    public async getXlsxDocument(
        options: IReadXlsxReportData,
    ): Promise<Workbook> {
        return this.execInTransaction<Workbook>(async queryRunner => {
            // get methods list
            const methods = (await this.methodService.readAllWithIndicators({
                filter: {
                    languages: [options.filter.language],
                    ids: options.filter.methods,
                },
                queryRunner,
            })).entities;

            // get data
            const faculties = (await this.readData(options)).entities;

            // create xlsx document
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Результаты');

            // add methods name to first row

            // first 4 row's are empty
            let firstRowValues = [,,,,,];

            // first row merged cells numbers
            let firstRowMergeCells = [];

            // current free cell number
            let firstRowCurrentCell = 5;

            methods.forEach((method) => {
                // reserve for the method a number of cells equal to the number of its indicators (they will be in the second line)
                for(let i = 0; i < method.indicators.length; i++) {
                    firstRowValues.push(method.languages[0].name);
                }

                // save cells numbers to be merged
                firstRowMergeCells.push([firstRowCurrentCell, firstRowCurrentCell + method.indicators.length - 1]);
                firstRowCurrentCell += method.indicators.length;
            });

            // add methods names in first row
            worksheet.addRow(firstRowValues);

            // add indicators names to second row

            // map of indicator id to it's cell number
            let indicatorToColumn = new Map();

            // current free cell number
            let indicatorColumnNumber = 5;
            // number of cells to be filled with score
            let scoreColumnNumber = 0;

            let secondRowValues = [,,,,,];
            for(let method of methods) {
                for(let indicator of method.indicators) {
                    //save indicator's names
                    secondRowValues.push(indicator.languages[0].name);
                    indicatorToColumn.set(indicator.id, indicatorColumnNumber);
                    indicatorColumnNumber++;
                    scoreColumnNumber++;
                }
            }

            // add second row
            worksheet.addRow(secondRowValues);

            // merge first row cells
            for(let mergeCell of firstRowMergeCells) {
                worksheet.mergeCells(1, mergeCell[0], 1, mergeCell[1]);
            }

            // merge empty cells (А1:С5)
            worksheet.mergeCells(1, 1, 2, 4);

            // merge first row cells
            worksheet.mergeCells(1, firstRowCurrentCell, 2, firstRowCurrentCell);

            // add students and it's scores to table rows

            // cells numbers to be merged in 1, 2 columns
            let firstColumnMergeCells = [];
            let secondColumnMergeCells = [];

            // free cells numbers in 1, 2 columns
            let firstColumnCurrentCell = 3;
            let secondColumnCurrentCell = 3;

            // bad results cells
            let redAlarmCells = [];
            let yellowAlarmCells = [];

            // current free row number
            let currentRowNumber = 3;

            let badResultsIndicators = new Map();

            for(let facultet of faculties) {
                let studentCount = 0;
                for(let group of facultet.groups) {
                    for(let student of group.students) {
                        const newRow: (string | number)[] = [facultet.name, group.name, student.recordBookNumber, (student.name + " " + student.surname + " " + student.patronymic)];
                        for(let i = 0; i < scoreColumnNumber; i++) {
                            newRow.push("-");
                        }
                        for(let result of student.results) {
                            for(let indicatorToResult of result.indicators) {
                                // find index of indicator in table and insert indicator score
                                newRow[indicatorToColumn.get(indicatorToResult.indicator.id) - 1] = indicatorToResult.score;

                                // checks if indicator score is bad
                                if(indicatorToResult.indicator.criteria[0].alarming === 2) {
                                    redAlarmCells.push([currentRowNumber, (indicatorToColumn.get(indicatorToResult.indicator.id))]);
                                } else if(indicatorToResult.indicator.criteria[0].alarming === 1) {
                                    yellowAlarmCells.push([currentRowNumber, (indicatorToColumn.get(indicatorToResult.indicator.id))]);
                                }
                            }
                        }
                        // go to new row
                        currentRowNumber;
                        worksheet.addRow(newRow);
                    }
                    // save cells to be merged in second column
                    secondColumnMergeCells.push([secondColumnCurrentCell, secondColumnCurrentCell + group.students.length - 1]);
                    secondColumnCurrentCell += group.students.length;
                    studentCount += group.students.length;
                }
                // save cells to be merged in first column
                firstColumnMergeCells.push([firstColumnCurrentCell, firstColumnCurrentCell + studentCount - 1]);
                firstColumnCurrentCell += studentCount;
            }

            // merge cells in 1, 2 columns
            for(let cellNumber of firstColumnMergeCells) {
                worksheet.mergeCells(cellNumber[0], 1, cellNumber[1], 1);
            }
            for(let cellNumber of secondColumnMergeCells) {
                worksheet.mergeCells(cellNumber[0], 2, cellNumber[1], 2);
            }

            worksheet.eachRow((row, rowNumber) => {

                // set alignment in cells to center
                row.alignment = { 
                    horizontal: 'center', 
                    vertical: 'middle',
                };
        
                // set border to all cells
                row.eachCell((cell, colNumber) => {
                    cell.border = {
                        top: {style:'thin'},
                        left: {style:'thin'},
                        bottom: {style:'thin'},
                        right: {style:'thin'},
                    };
                });
            });

            // set 3 and 4 columns width according to content
            worksheet.columns.forEach((col, index) => {
                if((index >= 2 && index <= 3) || index === firstRowCurrentCell - 1) {
                    let maxWidth = 0;
                    col.eachCell((cell) => {
                        let cellWidth = cell.value ? cell.value.toString().length : 10;
                        if(maxWidth < cellWidth) {
                            maxWidth = cellWidth;
                        }
                    });
                    col.width = maxWidth * 1.4;
                }
            });

            // because the remaining columns have merged columns (with names of methods)
            // then calculate their width as the maximum of [method name] / [number of method indicators] and [indicator name]
            for(let i = 0; i < firstRowMergeCells.length; i++) {
                const currentMethod = methods[i];

                for(let j = firstRowMergeCells[i][0], k = 0; j <= firstRowMergeCells[i][1]; j++, k++) {
                    const columnWidth = (currentMethod.languages[0].name.length / currentMethod.indicators.length) > currentMethod.indicators[k].languages[0].name.length ?
                        (currentMethod.languages[0].name.length / currentMethod.indicators.length) :
                        currentMethod.indicators[k].languages[0].name.length;

                    worksheet.getColumn(j).width = columnWidth * 1.4;
                }
            }

            // because in the first two columns there are merged cells with the names of the faculty and group
            // then calculate the height of the rows as the maximum of [name of faculty] / [number of rows allocated to the faculty] and [name of group] / [number of rows per group]
            for(let i = 0, currentGroupIndex = 0, currentCell = 3; i < faculties.length; i++) {
                const currentFacultyCellsCount = firstColumnMergeCells[i][1] - firstColumnMergeCells[i][0] + 1;
                const currentFaculty = faculties[i];
                for(let j = 0; j < currentFaculty.groups.length; j++, currentGroupIndex++) {
                    const currentGroupCellsCount = secondColumnMergeCells[currentGroupIndex][1] - secondColumnMergeCells[currentGroupIndex][0] + 1;
                    const currentGroup = currentFaculty.groups[j];

                    const rowHeigth = (currentFaculty.name.length / currentFacultyCellsCount) > (currentGroup.name.length / currentGroupCellsCount) ?
                        (currentFaculty.name.length / currentFacultyCellsCount) :
                        (currentGroup.name.length / currentGroupCellsCount);

                    for(let k = 0; k < currentGroup.students.length; k++, currentCell++) {
                        worksheet.getRow(currentCell).height = (rowHeigth * 10) > 14 ? rowHeigth * 10 : 14;
                    }
                }
            }

            // rotate first 2 columns text to 90 degrees
            worksheet.getColumn(1).alignment = {
                horizontal: 'center', 
                vertical: 'middle',
                textRotation: 90,
            };
            worksheet.getColumn(2).alignment = {
                horizontal: 'center', 
                vertical: 'middle',
                textRotation: 90,
            };

            // paint cells with bad results
            for(let redAlarmCell of redAlarmCells) {
                worksheet.getCell(redAlarmCell[0], redAlarmCell[1]).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF0000' },
                };
            }
            for(let yellowAlarmCell of yellowAlarmCells) {
                worksheet.getCell(yellowAlarmCell[0], yellowAlarmCell[1]).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFF00' },
                };
            }

            // freeze first 4 columns and 2 rows
            worksheet.views = [
                {
                    state: 'frozen',
                    xSplit: 4,
                    ySplit: 2,
                    topLeftCell: 'E3',
                },
            ];

            return workbook;
        }, options);
    }
}