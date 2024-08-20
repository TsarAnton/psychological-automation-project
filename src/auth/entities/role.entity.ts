import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./user.entity";

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
}