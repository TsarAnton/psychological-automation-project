import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { VerifyUserDto } from '../dto/user.dto';
import { JwtPayload } from '../types/auth.options';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private AuthService: AuthService,
    ) {
        super();
    }

    async validate(
        verifyUserDto: VerifyUserDto,
    ): Promise<JwtPayload> {
        const user = await this.AuthService.validateUser(verifyUserDto);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
  }
}