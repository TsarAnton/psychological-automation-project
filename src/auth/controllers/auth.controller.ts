import { Controller, Post, Body, NotFoundException, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { VerifyUserDto } from '../dto/user.dto';
import { AccessToken } from '../types/auth.options';
import { BaseController } from 'src/common/classes/base-controller';
import { DataSource } from 'typeorm';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerifyStudentByNameDto, VerifyStudentByPhoneNumberDto } from '../dto/auth.dto';

@ApiTags('Authorization [available for all]')
@Controller()
export class AuthController extends BaseController {
    constructor(
        private authService: AuthService,
        protected dataSource: DataSource,
    ) {
        super(dataSource);
    }

    @ApiOperation({ summary: "Return jwt access token with provided user login and password" })
    @ApiResponse({ status: HttpStatus.OK, description: "User has succesfully authorizated", type: AccessToken })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Incorrect login or password" })
    @Post('user/login')
    @HttpCode(HttpStatus.OK)
    async userLogin(
        @Body() verifyUserDto: VerifyUserDto,
    ): Promise<AccessToken> {
        const token = await this.authService.validateUser(verifyUserDto);
        if(token == null) {
            throw new NotFoundException(`Incorrect login or password`);
        }
        return this.authService.login(token);
    }

    @ApiOperation({ summary: "Return jwt access token with provided student name, surname, record book number" })
    @ApiResponse({ status: HttpStatus.OK, description: "User has succesfully authorizated", type: AccessToken })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Incorrect name, surname or record book number" })
    @Post('student/login')
    @HttpCode(HttpStatus.OK)
    async studentLoginByName(
        @Body() verifyStudentByNameDto: VerifyStudentByNameDto,
    ): Promise<AccessToken> {
        const token = await this.authService.validateStudentByName(verifyStudentByNameDto);
        if(token == null) {
            throw new NotFoundException(`Incorrect name, surname or record book number`);
        }
        return this.authService.login(token);
    }

    @ApiOperation({ summary: "Return jwt access token with provided student phone number" })
    @ApiResponse({ status: HttpStatus.OK, description: "User has succesfully authorizated", type: AccessToken })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Incorrect phone number" })
    @Post('student/login/phone')
    @HttpCode(HttpStatus.OK)
    async studentLoginByPhoneNumber(
        @Body() verifyStudentByPhoneNumberDto: VerifyStudentByPhoneNumberDto,
    ): Promise<AccessToken> {
        const token = await this.authService.validateStudentByPhonenumber(verifyStudentByPhoneNumberDto);
        if(token == null) {
            throw new NotFoundException(`Incorrect phone number`);
        }
        return this.authService.login(token);
    }
}