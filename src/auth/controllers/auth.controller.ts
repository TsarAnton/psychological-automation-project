import { Controller, Post, Body, NotFoundException, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { VerifyUserDto } from '../dto/user.dto';

@Controller()
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @Post('user/login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() verifyUserDto: VerifyUserDto,
    ) {
        const token = await this.authService.validateUser(verifyUserDto);
        if(token == null) {
            throw new NotFoundException(`Incorrect login or password`);
        }
        return this.authService.login(token);
  }
}