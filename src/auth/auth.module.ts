import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { User } from "./entities/user.entity";
import { RoleController } from "./controllers/role.controller";
import { UserService } from "./services/user.service";
import { RoleService } from "./services/role.service";
import { UserToRole } from "./entities/user-to-role.entity";
import { UserController } from "./controllers/user.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Role,
            UserToRole,
        ])
    ],
    controllers: [
        UserController,
        RoleController,
    ],
    providers: [
        UserService,
        RoleService,
    ],
    exports: [
        UserService,
        RoleService,
    ]
})
export class AuthModule {}