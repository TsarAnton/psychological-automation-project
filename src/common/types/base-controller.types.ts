import { QueryRunner } from "typeorm";

export type ControllerMethod<T> = (
    queryRunner: QueryRunner,
) => Promise<T>;