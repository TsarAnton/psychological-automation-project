import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./user.entity";
import { UserToRole } from "./user-to-role.entity";

@Entity({ name: 'roles', engine: 'InnoDB' })
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true, length: 100 })
    name: string;

    @ManyToMany(
        () => User,
        user => user.roles,
        { onUpdate: 'RESTRICT', onDelete: 'RESTRICT' }
    )
    users: User[];

    @OneToMany(
        () => UserToRole,
        userToRole => userToRole.role,
    )
    roleToUsers: UserToRole[];
}