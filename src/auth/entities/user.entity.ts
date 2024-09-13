import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Role } from "./role.entity";
import { UserToRole } from "./user-to-role.entity";
import { Student } from "src/student/entities/student.entity";

@Entity({ name: 'users', engine: 'InnoDB' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true, length: 100 })
    login: string;

    @Column({ nullable: false, length: 255, select: false })
    password: string;

    @OneToOne(
		() => Student,
		student => student.user,
	)
	student: Student;

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

    @OneToMany(
		() => UserToRole,
		userToRole => userToRole.user,
	)
	userToRoles: UserToRole[];
}