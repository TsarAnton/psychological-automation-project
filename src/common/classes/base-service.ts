import { HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";
import { ServiceMethod } from "../types/base-service.types";
import { ITransactionOptions } from "../types/transaction.types";

@Injectable()
export abstract class BaseService {
  constructor(
    protected dataSource: DataSource,
) {}

  async execInTransaction<T>(
    method: ServiceMethod<T>,
    options: ITransactionOptions,
  ): Promise<T> {
    let queryRunner: QueryRunner;

	if (options.queryRunner) {
		queryRunner = options.queryRunner;
	} else {
		queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
	}
        
    try {
        return await method(queryRunner, options);
    } catch (err) {
        if (queryRunner.isTransactionActive) {
    	    await queryRunner.rollbackTransaction();
        }

        if (err instanceof HttpException) {
            throw err;
        } else {
            const internalServerError = {
                ...new InternalServerErrorException(err.message),
                stack: err.stack,
            };

            throw internalServerError;
        }
    } finally {
        if (!options.queryRunner && queryRunner.isTransactionActive) {
            await queryRunner.release();
        }
    }
  }
}