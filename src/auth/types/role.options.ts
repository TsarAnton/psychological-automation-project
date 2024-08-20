import { BaseReadAllOptions } from "src/common/types/read-all-result.types";

export interface IReadAllRolesOptions extends BaseReadAllOptions {
    filter?: {
        ids?: number[];
        name?: string;
    }
}