export type JwtPayload = {
    id: number;
    login: string;
    roles: RoleObject[];
}

type RoleObject = {
    id: number;
    name: string;
}