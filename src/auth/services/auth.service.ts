import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { BaseService } from 'src/common/classes/base-service';
import { DataSource } from 'typeorm';
import { VerifyUserDto } from '../dto/user.dto';
import { ITransactionOptions } from 'src/common/types/transaction.types';
import { Tokens, JwtPayload } from '../types/auth.options';
import { VerifyStudentByNameDto, VerifyStudentByPhoneNumberDto } from '../dto/auth.dto';
import { StudentService } from 'src/student/services/student.service';
import { config as dotenvConfig } from 'dotenv';
import { IUpdateStoredRefreshTokenOptions } from '../types/user.options';
import * as argon2 from 'argon2';
import { User } from '../entities/user.entity';
import { Request } from 'express';

dotenvConfig({ path: '.env' });


@Injectable()
export class AuthService extends BaseService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private studentService: StudentService,
        protected dataSource: DataSource,
    ) {
        super(dataSource);
    }

    async loginByUserLoginPassword(
        verifyUserDto: VerifyUserDto,   
        options: ITransactionOptions = {},
    ): Promise<Tokens> {
        return this.execInTransaction<Tokens>(async queryRunner => {
            if(!(await this.userService.verifyPassword(verifyUserDto, { queryRunner }))) {
                throw new BadRequestException(`Incorrect login or password`);
            }

            const existingUser = await this.userService.readOneBy({ login: verifyUserDto.login }, { queryRunner });
            const tokens = await this.getTokens(existingUser);

            await this.updateRefreshToken(existingUser.id, tokens.refreshToken, { queryRunner });
            return tokens;
        }, options);
    }

    async loginByStudentNameSurnameRecBook(
        verifyStudentByNameDto: VerifyStudentByNameDto,   
        options: ITransactionOptions = {},
    ): Promise<Tokens> {
        return this.execInTransaction<Tokens>(async queryRunner => {
            const existingStudent = await this.studentService.readOneBy({
                name: verifyStudentByNameDto.name,
                surname: verifyStudentByNameDto.surname,
                recordBookNumber: verifyStudentByNameDto.recordBookNumber,
            }, { queryRunner });

            if(!existingStudent) {
                throw new BadRequestException(`Incorrect name, surname or record book number`);
            }

            const existingUser = await this.userService.readOneBy({ id: existingStudent.user.id }, { queryRunner });
            const tokens = await this.getTokens(existingUser);

            await this.updateRefreshToken(existingUser.id, tokens.refreshToken, { queryRunner });
            return tokens;
        }, options);
    }

    async loginByStudentPhone(
        verifyStudentByPhoneNumberDto: VerifyStudentByPhoneNumberDto,   
        options: ITransactionOptions = {},
    ): Promise<Tokens> {
        return this.execInTransaction<Tokens>(async queryRunner => {
            const existingStudent = await this.studentService.readOneBy({
                phoneNumber: verifyStudentByPhoneNumberDto.phoneNumber,
            }, { queryRunner });

            if(!existingStudent) {
                throw new BadRequestException(`Incorrect phone number`);
            }

            const existingUser = await this.userService.readOneBy({ id: existingStudent.user.id }, { queryRunner });
            const tokens = await this.getTokens(existingUser);

            await this.updateRefreshToken(existingUser.id, tokens.refreshToken, { queryRunner });
            return tokens;
        }, options);
    }

    async logout(
        token: string,
        options: ITransactionOptions = {},
    ): Promise<void> {
        return this.execInTransaction<void>(async queryRunner => {
            const tokenObj = Object(this.jwtService.decode(token));
            const userId = tokenObj?.id;
            if(!userId) {
                throw new ForbiddenException('Access Denied');
            }
            return this.userService.deleteStoredRefreshToken(userId, { queryRunner });
        }, options);
    }

    async updateRefreshToken(
        userId: number,
        refreshToken: string,
        options: ITransactionOptions = {},
    ): Promise<void> {
        return this.execInTransaction<void>(async queryRunner => {
            await this.userService.updateStoredRefreshToken({
                user: userId,
                refreshToken: refreshToken,
                queryRunner: queryRunner,
            });
        }, options);
    }

    async refreshTokens(
        token: string,
        options: ITransactionOptions = {},
    ): Promise<Tokens> {
        return this.execInTransaction<Tokens>(async queryRunner => {
            const tokenObj = Object(this.jwtService.decode(token));
            const userId = tokenObj?.id;

            const existingStoredRefreshToken = await this.userService.readStoredRefreshTokenByUserId(userId, { queryRunner });

            if(!(await argon2.verify(existingStoredRefreshToken.refreshToken, token))) {
                throw new ForbiddenException(`Access Denied`);
            }

            const existingUser = await this.userService.readById(existingStoredRefreshToken.user.id, { queryRunner });
            const tokens = await this.getTokens(existingUser);
            await this.updateRefreshToken(userId, tokens.refreshToken);

            return tokens;
        }, options);
    }

    async getTokens(user: User): Promise<Tokens> {
        const jwtPayload = {
            id: user.id,
            login: user.login,
            roles: user.roles.map(el => ({
                id: el.id,
                name: el.name,
            })),
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: process.env.ACCESS_TOKEN_SECRET,
                expiresIn: process.env.ACCESS_TOKEN_EXPIRED,
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: process.env.REFRESH_TOKEN_SECRET,
                expiresIn: process.env.REFRESH_TOKEN_EXPIRED,
            })
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    public async validateUser(
        verifyUserDto: VerifyUserDto,
        options: ITransactionOptions = {},
    ): Promise<JwtPayload> {
        return this.execInTransaction<JwtPayload>(async queryRunner => {
            if(!(await this.userService.verifyPassword(verifyUserDto, { queryRunner }))) {
                throw new ForbiddenException(`Access Denied`);
            }
            const existingUser = await this.userService.readOneBy({
                login: verifyUserDto.login,
            }, { queryRunner });
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
}
