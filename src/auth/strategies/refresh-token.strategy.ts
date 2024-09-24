import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';
import { JwtPayload, JwtPayloadWithRefreshToken } from '../types/auth.options';
import { Request } from 'express';

dotenvConfig({ path: '.env' });


@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.REFRESH_TOKEN_SECRET,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
        const refreshToken = req?.get('Authorization')?.replace('Bearer', '').trim();
        if(!refreshToken) {
            throw new ForbiddenException('Refresh token not found');
        }
        return { ...payload, refreshToken };
    }
}