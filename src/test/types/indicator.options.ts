import { IBaseReadAllOptions } from "src/common/types/read-all-result.types";

export interface IReadAllIndicatorsOptions extends IBaseReadAllOptions {
    filter?: {
        ids?: number[];
        languages?: number[];
        methods?: number[];
        results?: number[];
        display?: number;
        name?: string;
    }
}