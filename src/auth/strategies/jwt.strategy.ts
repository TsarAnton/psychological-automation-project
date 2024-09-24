import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';
import { JwtPayload } from '../types/auth.options';

dotenvConfig({ path: '.env' });

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.ACCESS_TOKEN_SECRET,
        });
    }

    async validate(payload: JwtPayload) {
        return payload;
    }
}