import { IBaseReadAllOptions } from "src/common/types/read-all-result.types";
import { ITransactionOptions } from "src/common/types/transaction.types";
import { Indicator } from "../entities/indicator.entity";
import { Formula } from "./common/formula.options";

export interface IReadAllMethodsOptions extends IBaseReadAllOptions {
    filter?: {
        ids?: number[];
        languages?: number[];
        results?: number[];
    }
}

export interface ICheckIndicatorOptions extends ITransactionOptions {
    id: number;
    indicators: Indicator[];
    newFormula?: Formula;
}