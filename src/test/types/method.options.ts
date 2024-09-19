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

export interface IReadAvailableMethodsOptions extends IBaseReadAllOptions {
    filter?: {
        methods?: number[];
        languages?: number[];
        students?: number[];
        groups?: number[];
        faculties?: number[];
        period?: {
            minDate?: Date;
            maxDate?: Date;
        }
        date?: Date;
    }
}

export interface IAvailableMethodArrays extends ITransactionOptions{
    methods: number[];
    students?: number[];
    groups?: number[];
    faculties?: number[];
}