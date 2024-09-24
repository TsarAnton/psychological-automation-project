import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { User } from "./user.entity";

@ApiTags('Auth')
@Entity({ name: 'refresh_tokens', engine: 'InnoDB' })
export class StoredRefreshToken {
    @ApiProperty({ description: "User related to this refresh token", required: true, type: () => User })
    @PrimaryColumn({ name: 'user_id', unique: true, type: 'int' })
	@OneToOne(
		() => User,
		user => user.storedRefreshToken,
		{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
	)
	@JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
	user: User;

    @ApiProperty({ description: "Refresh token", required: true })
    @Column({ nullable: false, length: 255 })
    refreshToken: string;
}