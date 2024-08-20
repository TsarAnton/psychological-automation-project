import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { Role } from "./role.entity";

@Entity({ name: 'users', engine: 'InnoDB' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true, length: 100 })
    login: string;

    @Column({ nullable: false, length: 255, select: false })
    password: string;

    @ManyToMany(
        () => Role,
        role => role.users,
        { onUpdate: 'RESTRICT', onDelete: 'RESTRICT'}
    )
    @JoinTable({ 
        name: "users_to_roles",
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
    })
    roles: Role[];
}