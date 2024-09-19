import { ApiProperty, ApiTags } from "@nestjs/swagger";

export type JwtPayload = {
    id: number;
    login: string;
    roles: RoleObject[];
}

type RoleObject = {
    id: number;
    name: string;
}

@ApiTags('Authorization')
export class AccessToken {
    @ApiProperty({ description: "Access token string", required: false })
    accessToken: string;
}