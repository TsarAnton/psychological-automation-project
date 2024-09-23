import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { config as dotenvConfig } from 'dotenv';

import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { Role } from "./entities/role.entity";
import { User } from "./entities/user.entity";
import { UserToRole } from "./entities/user-to-role.entity";

import { UserService } from "./services/user.service";
import { RoleService } from "./services/role.service";
import { AuthService } from "./services/auth.service";
import { JwtService } from "@nestjs/jwt";

import { UserController } from "./controllers/user.controller";
import { RoleController } from "./controllers/role.controller";
import { AuthController } from "./controllers/auth.controller";

import { LocalStrategy } from "./strategies/local.startegy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { StudentModule } from "src/student/student.module";
import { StudentService } from "src/student/services/student.service";
import { UserSubscriber } from "./subscribers/user.subscriber";

dotenvConfig({ path: '.env' });

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.ACCESS_TOKEN_SECRET,
            signOptions: { 
                expiresIn: process.env.ACCESS_TOKEN_EXPIRED,
            },
        }),
        TypeOrmModule.forFeature([
            User,
            Role,
            UserToRole,
        ]),
        forwardRef(() => StudentModule),
    ],
    controllers: [
        UserController,
        RoleController,
        AuthController,
    ],
    providers: [
        UserService,
        RoleService,
        AuthService,
        UserSubscriber,
        LocalStrategy,
        JwtStrategy,
    ],
    exports: [
        UserService,
        RoleService,
        AuthService,
    ]
})
export class AuthModule {}