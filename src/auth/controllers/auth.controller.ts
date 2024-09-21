import { Controller, Post, Body, NotFoundException, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { VerifyUserDto } from '../dto/user.dto';
import { AccessToken } from '../types/auth.options';
import { BaseController } from 'src/common/classes/base-controller';
import { DataSource } from 'typeorm';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
    async login(
        @Body() verifyUserDto: VerifyUserDto,
    ): Promise<AccessToken> {
        const token = await this.authService.validateUser(verifyUserDto);
        if(token == null) {
            throw new NotFoundException(`Incorrect login or password`);
        }
        return this.authService.login(token);
  }
}