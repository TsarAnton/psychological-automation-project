import { IBaseReadAllOptions } from "src/common/types/read-all-result.types";

export interface IReadAllStudentsOptions extends IBaseReadAllOptions {
    filter?: {
        ids?: number[];
        recordBookNumber?: string;
        name?: string;
        surname?: string;
        patronymic?: string;
        phoneNumber?: string;
        users?: number[];
        groups?: number[];
        faculties?: number[];
    }
}