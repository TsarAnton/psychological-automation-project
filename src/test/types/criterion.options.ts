import { IBaseReadAllOptions } from "src/common/types/read-all-result.types";

export interface IReadAllCriteriaOptions extends IBaseReadAllOptions {
    filter?: {
        ids?: number[];
        languages?: number[];
        indicators?: number[];
        alarming?: number;
        minValue?: number;
        maxValue?: number;
    }
}