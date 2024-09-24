import { Controller, Post, Body, NotFoundException, HttpStatus, HttpCode, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { VerifyUserDto } from '../dto/user.dto';
import { Tokens } from '../types/auth.options';
import { BaseController } from 'src/common/classes/base-controller';
import { DataSource } from 'typeorm';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerifyStudentByNameDto, VerifyStudentByPhoneNumberDto } from '../dto/auth.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GetJwtToken } from '../decorators/get-jwt-token.decorator';

@ApiTags('Authorization [available for all]')
@Controller()
export class AuthController extends BaseController {
    constructor(
        private authService: AuthService,
        protected dataSource: DataSource,
    ) {
        super(dataSource);
    }

    @ApiOperation({ summary: "Return jwt access and refresh tokens with provided user login and password" })
    @ApiResponse({ status: HttpStatus.OK, description: "User has succesfully authorizated", type: Tokens })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Incorrect login or password" })
    @Post('login/user')
    @HttpCode(HttpStatus.OK)
    async userLogin(
        @Body() verifyUserDto: VerifyUserDto,
    ): Promise<Tokens> {
        return this.authService.loginByUserLoginPassword(verifyUserDto);
    }

    @ApiOperation({ summary: "Return jwt access and refresh tokens with provided student name, surname, record book number" })
    @ApiResponse({ status: HttpStatus.OK, description: "User has succesfully authorizated", type: Tokens })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Incorrect name, surname or record book number" })
    @Post('login/student')
    @HttpCode(HttpStatus.OK)
    async studentLoginByName(
        @Body() verifyStudentByNameDto: VerifyStudentByNameDto,
    ): Promise<Tokens> {
        return this.authService.loginByStudentNameSurnameRecBook(verifyStudentByNameDto);
    }

    @ApiOperation({ summary: "Return jwt access and refresh tokens with provided student phone number" })
    @ApiResponse({ status: HttpStatus.OK, description: "User has succesfully authorizated", type: Tokens })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Incorrect phone number" })
    @Post('login/student/phone')
    @HttpCode(HttpStatus.OK)
    async studentLoginByPhoneNumber(
        @Body() verifyStudentByPhoneNumberDto: VerifyStudentByPhoneNumberDto,
    ): Promise<Tokens> {
        return this.authService.loginByStudentPhone(verifyStudentByPhoneNumberDto);
    }

    @ApiOperation({ summary: "Delete user stored refresh token" })
    @ApiResponse({ status: HttpStatus.OK, description: "User has succesfully logout", type: Tokens })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Access Denied" })
    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(
        @GetJwtToken() token: string,
    ): Promise<void> {
        this.authService.logout(token);
    }

    @ApiOperation({ summary: "Refresh user's jwt acces and refresh tokens" })
    @ApiResponse({ status: HttpStatus.OK, description: "Tokens has succesfully refreshed", type: Tokens })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Access Denied" })
    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(
        @GetJwtToken() token: string,
    ): Promise<Tokens> {
        return this.authService.refreshTokens(token);
  }
}