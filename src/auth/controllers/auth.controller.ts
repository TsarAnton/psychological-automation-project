import { Controller, Post, Body, NotFoundException, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { VerifyUserDto } from '../dto/user.dto';
import { AccessToken } from '../types/auth.options';
import { BaseController } from 'src/common/classes/base-controller';
import { DataSource } from 'typeorm';

@Controller()
export class AuthController extends BaseController {
    constructor(
        private authService: AuthService,
        protected dataSource: DataSource,
    ) {
        super(dataSource);
    }

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