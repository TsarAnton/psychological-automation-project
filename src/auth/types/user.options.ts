import { IBaseReadAllOptions } from "src/common/types/read-all-result.types";

export interface IReadAllUsersOptions extends IBaseReadAllOptions {
    filter?: {
        ids?: number[];
        roles?: number[];
        login?: string;
    }
}