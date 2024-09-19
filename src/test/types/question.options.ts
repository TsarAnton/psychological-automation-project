import { IBaseReadAllOptions } from "src/common/types/read-all-result.types";

export interface IReadAllQuestionsOptions extends IBaseReadAllOptions {
    filter?: {
        ids?: number[];
        methods?: number[];
        languages?: number[];
    }
}