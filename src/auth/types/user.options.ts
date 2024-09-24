import { IBaseReadAllOptions } from "src/common/types/read-all-result.types";
import { ITransactionOptions } from "src/common/types/transaction.types";

export interface IReadAllUsersOptions extends IBaseReadAllOptions {
    filter?: {
        ids?: number[];
        roles?: number[];
        login?: string;
    }
}

export interface IUpdateStoredRefreshTokenOptions extends ITransactionOptions {
    refreshToken: string;
    user: number;
}
