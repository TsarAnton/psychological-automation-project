export interface IPaginationOptions {
	page: number;
	size: number;
}

export const defaultPagination: IPaginationOptions = {
	page: 0,
	size: 20,
};
