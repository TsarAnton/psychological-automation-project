import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadWithRefreshToken } from '../types/auth.options';

export const GetJwtToken = createParamDecorator(
    (data: keyof JwtPayloadWithRefreshToken | undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.replace('Bearer', '').trim();
        return token;
    },
);