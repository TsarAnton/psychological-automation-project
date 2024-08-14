import { QueryRunner } from "typeorm";

export interface ITransactionOptions {
	queryRunner?: QueryRunner;
}