import { BaseReadAllOptions } from "src/common/types/read-all-result.types";

export interface IReadAllUsersOptions extends BaseReadAllOptions {
    filter?: {
        ids?: number[];
        roles?: number[];
        login?: string;
    }
}