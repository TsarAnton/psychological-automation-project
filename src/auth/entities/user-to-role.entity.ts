import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";

import { User } from "./user.entity";
import { Role } from "./role.entity";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('Role', 'User')
@Entity({ name: 'users_to_roles', engine: 'InnoDB' })
export class UserToRole {
    @PrimaryColumn({ name: 'role_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Role,
        role => role.roleToUsers,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
    role: Role;

    @PrimaryColumn({ name: 'user_id', unique: false, type: 'int' })
    @ManyToOne(
        () => User,
        user => user.userToRoles,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;
}