import { DeepPartial } from "typeorm";
import { ISortingOptions } from "./sorting.types";
import { IPaginationOptions } from "./pagination.types";
import { ITransactionOptions } from "./transaction.types";

export type ReadAllResult<T> = {
	meta: {
        page: number;
        entitiesCount: number;
        maxPage: number;
    };
	entities: T[];
};

export function createReadAllResultObject<T>(
    options: IBaseReadAllOptions,
    count: number,
    entities: T[],
): ReadAllResult<T> {
    let meta = {
        page: 1,
        maxPage: 1,
        entitiesCount: entities.length,
    }

    if(options.pagination) {
        const pageCount = Math.floor(count / options.pagination.size) - ((count % options.pagination.size === 0) ? 1: 0);
        meta.page = options.pagination.page;
        meta.maxPage = pageCount;
    }

    return {
        meta: meta,
        entities: entities,
    }
}

export interface IBaseReadAllOptions extends ITransactionOptions {
    sorting?: ISortingOptions;
    pagination?: IPaginationOptions;
}