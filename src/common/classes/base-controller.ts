import { DataSource } from "typeorm";
import { ControllerMethod } from "../types/base-controller.types";
import { HttpException, InternalServerErrorException } from "@nestjs/common";

export abstract class BaseController {
	constructor(
        protected dataSource: DataSource
    ) {}

	protected async execInTransaction<T>(
        method: ControllerMethod<T>
    ): Promise<T> {
		const queryRunner = this.dataSource.createQueryRunner();

		try {
			await queryRunner.connect();
			await queryRunner.startTransaction();

			const result = await method(queryRunner);

			await queryRunner.commitTransaction();

			return result;
		} catch (error) {
			if (queryRunner.isTransactionActive) {
				await queryRunner.rollbackTransaction();
			}

			if (error instanceof HttpException) {
				throw error;
			} else {
				const internalServerError = {
					...new InternalServerErrorException(error.message),
					stack: error.stack,
				};

				throw internalServerError;
			}
		} finally {
			if (queryRunner.isTransactionActive) {
				await queryRunner.release();
			}
		}
	}
}
