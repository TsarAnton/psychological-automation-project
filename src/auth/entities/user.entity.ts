import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Role } from "./role.entity";
import { UserToRole } from "./user-to-role.entity";
import { Student } from "src/student/entities/student.entity";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { StoredRefreshToken } from "./stored-refresh-token.entity";

@ApiTags('User')
@Entity({ name: 'users', engine: 'InnoDB' })
export class User {
    @ApiProperty({ description: "User id", required: true })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: "User login", required: true })
    @Column({ nullable: false, unique: true, length: 100 })
    login: string;

    @ApiProperty({ description: "User password", required: true })
    @Column({ nullable: false, length: 255, select: false })
    password: string;

    @ApiProperty({ description: "Student related to this user", required: false, type: Student })
    @OneToOne(
		() => Student,
		student => student.user,
	)
	student: Student;

    @ApiProperty({ description: "Storedrefresh token related to this user", required: false, type: StoredRefreshToken })
    @OneToOne(
		() => StoredRefreshToken,
		storedRefreshToken => storedRefreshToken.user,
	)
	storedRefreshToken: StoredRefreshToken;

    @ApiProperty({ description: "Array of roles related to this user", required: false, type: [Role] })
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

export { StoredRefreshToken };
