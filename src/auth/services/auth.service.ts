import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { BaseService } from 'src/common/classes/base-service';
import { DataSource } from 'typeorm';
import { VerifyUserDto } from '../dto/user.dto';
import { ITransactionOptions } from 'src/common/types/transaction.types';
import { AccessToken, JwtPayload } from '../types/auth.options';
import { VerifyStudentByNameDto, VerifyStudentByPhoneNumberDto } from '../dto/auth.dto';
import { StudentService } from 'src/student/services/student.service';

@Injectable()
export class AuthService extends BaseService {
    constructor(
        private JwtService: JwtService,
        private userService: UserService,
        private studentService: StudentService,
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

    async validateStudentByName(
        verifyStudentByNameDto: VerifyStudentByNameDto,   
        options: ITransactionOptions = {},
    ): Promise<JwtPayload> {
        return this.execInTransaction<JwtPayload>(async queryRunner => {
            const existingStudent = await this.studentService.readOneBy({
                name: verifyStudentByNameDto.name,
                surname: verifyStudentByNameDto.surname,
                recordBookNumber: verifyStudentByNameDto.recordBookNumber,
            }, { queryRunner });

            if(!existingStudent) {
                throw new BadRequestException(`Incorrect name, surname or record book number`);
            }

            const existingUser = await this.userService.readOneBy({ id: existingStudent.user.id }, { queryRunner });

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

    async validateStudentByPhonenumber(
        verifyStudentByPhoneNumberDto: VerifyStudentByPhoneNumberDto,   
        options: ITransactionOptions = {},
    ): Promise<JwtPayload> {
        return this.execInTransaction<JwtPayload>(async queryRunner => {
            const existingStudent = await this.studentService.readOneBy({
                phoneNumber: verifyStudentByPhoneNumberDto.phoneNumber,
            }, { queryRunner });

            if(!existingStudent) {
                throw new BadRequestException(`Incorrect phone number`);
            }

            const existingUser = await this.userService.readOneBy({ id: existingStudent.user.id }, { queryRunner });

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
