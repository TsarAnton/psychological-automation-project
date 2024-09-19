import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { BaseService } from 'src/common/classes/base-service';
import { DataSource } from 'typeorm';
import { VerifyUserDto } from '../dto/user.dto';
import { ITransactionOptions } from 'src/common/types/transaction.types';
import { AccessToken, JwtPayload } from '../types/auth.options';

@Injectable()
export class AuthService extends BaseService {
    constructor(
        private JwtService: JwtService,
        private userService: UserService,
        protected dataSource: DataSource,
    ) {
        super(dataSource);
    }

    async validateUser(
        verifyUserDto: VerifyUserDto,   
        options: ITransactionOptions = {},
    ): Promise<JwtPayload> {
        return this.execInTransaction<JwtPayload>(async queryRunner => {
            if(!(await this.userService.verifyPassword(verifyUserDto, { queryRunner }))) {
                throw new BadRequestException(`Incorrect login or password`);
            }

            const existingUser = await this.userService.readOneBy({ login: verifyUserDto.login }, { queryRunner });
            return {
                id: existingUser.id,
                login: existingUser.login,
                roles: existingUser.roles.map(el => ({
                    id: el.id,
                    name: el.name,
                })),
            };
        }, options);
    }

    async login(jwtPayload: JwtPayload): Promise<AccessToken> {
        return {
            accessToken: this.JwtService.sign(jwtPayload),
        };
    }
}
