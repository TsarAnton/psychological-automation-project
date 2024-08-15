export type ReadAllResult<T> = {
	meta: {
        page: number;
        entitiesCount: number;
        maxPage: number;
    };
	entities: T[];
};