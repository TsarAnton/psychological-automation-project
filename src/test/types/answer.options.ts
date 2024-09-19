import { IBaseReadAllOptions } from "src/common/types/read-all-result.types";

export interface IReadAllAnswersOptions extends IBaseReadAllOptions {
    filter?: {
        ids?: number[];
        languages?: number[];
        questions?: number[];
        methods?: number[];
        results?: number[];
    }
}