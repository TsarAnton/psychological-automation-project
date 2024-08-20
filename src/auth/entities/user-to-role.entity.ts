import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { User } from "./user.entity";
import { Role } from "./role.entity";

@Entity({ name: 'users_to_roles', engine: 'InnoDB' })
export class UserToRole {
    @PrimaryColumn({ name: 'user_id' })
    userId: number;

    @PrimaryColumn({ name: 'role_id' })
    roleId: number;

    @ManyToOne(
        () => User,
        user => user.roles,
        { onUpdate: 'RESTRICT', onDelete: 'RESTRICT' },
    )
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
    users: User[];

    @ManyToOne(
        () => Role,
        role => role.users,
        { onUpdate: 'RESTRICT', onDelete: 'RESTRICT' },
    )
    @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
    roles: Role[];
}