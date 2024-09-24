import { ApiProperty, ApiTags } from "@nestjs/swagger";

export class JwtPayload {
    id: number;
    login: string;
    roles: RoleObject[];
}

type RoleObject = {
    id: number;
    name: string;
}

@ApiTags('Authorization')
export class Tokens {
    @ApiProperty({ description: "Access token string", required: false })
    accessToken: string;

    @ApiProperty({ description: "Refresh token string", required: false })
    refreshToken: string;
}

export class JwtPayloadWithRefreshToken extends JwtPayload {
    refreshToken: string;
}