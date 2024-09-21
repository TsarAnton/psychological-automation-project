import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./user.entity";
import { UserToRole } from "./user-to-role.entity";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('Role')
@Entity({ name: 'roles', engine: 'InnoDB' })
export class Role {
    @ApiProperty({ description: "Role id", required: true })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: "Role name", required: true })
    @Column({ nullable: false, unique: true, length: 100 })
    name: string;

    @ApiProperty({ description: "Array of users related to this role", required: false, type: [User] })
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