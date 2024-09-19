import { IBaseReadAllOptions } from "src/common/types/read-all-result.types";

export interface IReadAllLanguagesOptions extends IBaseReadAllOptions {
    filter?: {
        ids?: number[];
        name?: string;
        methods?: number[];
        questions?: number[];
        answers?: number[];
        indicators?: number[];
        criteria?: number[];
    }
}