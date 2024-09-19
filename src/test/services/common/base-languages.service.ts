import { BaseService } from "src/common/classes/base-service";
import { DataSource } from "typeorm";
import { LanguageService } from "../language.service";
import { ITransactionOptions } from "src/common/types/transaction.types";
import { BadRequestException } from "@nestjs/common";

export abstract class BaseLanguagesService extends BaseService {
    constructor(
        protected dataSource: DataSource,
        protected languageService: LanguageService,
    ) {
        super(dataSource);
    }

    protected validateLanguages(
        languages: number[],
        options: ITransactionOptions = {},
    ): Promise<void> {
        return this.execInTransaction<void>(async queryRunner => {
            if(new Set(languages).size !== languages.length) {
                throw new BadRequestException(`Languages array has duplicate language values`);
            }

            if(languages.length !== (await this.languageService.readAll({
                filter: {
                    ids: languages,
                },
                queryRunner: queryRunner,
            })).entities.length) {
                throw new BadRequestException(`One or several languages of languages array do not exist`);
            }
        }, options);
    }
}