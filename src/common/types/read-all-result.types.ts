import { ISortingOptions } from "./sorting.types";
import { IPaginationOptions } from "./pagination.types";
import { ITransactionOptions } from "./transaction.types";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('Base')
class Meta {
    @ApiProperty({ description: "Number of current page", required: true })
    page: number;
    @ApiProperty({ description: "Entitites count on current page", required: true })
    entitiesCount: number;
    @ApiProperty({ description: "Number of last page", required: true })
    maxPage: number;
}

@ApiTags('Base')
export class ReadAllResult<T> {
    @ApiProperty({ description: "Object that describes pagination", required: true, type: Meta })
	meta: Meta;
    @ApiProperty({ description: "Array of returned entities", required: true, type: [] })
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