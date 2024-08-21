import { IBaseReadAllOptions } from "src/common/types/read-all-result.types";

export interface IReadAllRolesOptions extends IBaseReadAllOptions {
    filter?: {
        ids?: number[];
        name?: string;
    }
}