import { IBaseReadAllOptions } from "src/common/types/read-all-result.types";

export interface IReadAllFacultiesOptions extends IBaseReadAllOptions {
    filter?: {
        ids?: number[];
        name?: string;
    }
}