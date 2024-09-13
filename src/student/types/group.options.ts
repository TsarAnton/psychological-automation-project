import { IBaseReadAllOptions } from "src/common/types/read-all-result.types";

export interface IReadAllGroupsOptions extends IBaseReadAllOptions {
    filter?: {
        ids?: number[];
        name?: string;
        faculties?: number[];
    }
}