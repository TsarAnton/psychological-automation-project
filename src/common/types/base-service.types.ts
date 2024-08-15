import { QueryRunner } from "typeorm";
import { ITransactionOptions } from "./transaction.types";

export type ServiceMethod<T> = (
	queryRunner: QueryRunner,
) => Promise<T>;