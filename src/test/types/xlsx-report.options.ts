import { IBaseReadAllOptions } from "src/common/types/read-all-result.types";

export interface IReadXlsxReportData extends IBaseReadAllOptions {
    filter?: {
        period?: {
            minDate?: Date;
            maxDate?: Date;
        },
        faculties?: number[];
        groups?: number[];
        students?: number[];
        methods?: number[];
        language: number;
    }
}