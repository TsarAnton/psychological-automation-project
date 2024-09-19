import { IBaseReadAllOptions } from "src/common/types/read-all-result.types";

export interface IReadAllResultsOptions extends IBaseReadAllOptions {
    filter: {
        ids?: number[];
        period?: {
            minDate?: Date;
            maxDate?: Date;
        }
        alarming?: number;
        date?: Date;
        display?: number;
        students?: number[];
        groups?: number[]
        faculties?: number[];
        methods?: number[];
        indicators?: number[];
        languages: number[];
    }
}