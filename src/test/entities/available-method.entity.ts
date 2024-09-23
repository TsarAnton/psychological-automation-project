import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Student } from "src/student/entities/student.entity";
import { Method } from "./method.entity";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('Method', 'Student')
@Entity({ name: 'available_methods', engine: 'InnoDB' })
export class AvailableMethod {
    @ApiProperty({ description: "Method related to this entity", required: true, type: () => Method })
    @PrimaryColumn({ name: 'method_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Method,
        method => method.availableStudents,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'method_id', referencedColumnName: 'id' })
    method: Method;

    @ApiProperty({ description: "Student related to this entity", required: true, type: () => Student })
    @PrimaryColumn({ name: 'student_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Student,
        student => student.availableMethods,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'student_id', referencedColumnName: 'id' })
    student: Student;

    @ApiProperty({ description: "Date until which this student can perform this method", required: true, type: Date })
    @Column({ nullable: false, type: 'timestamp', name: 'date_end' })
	dateEnd: Date;

    @ApiProperty({ description: "If result will be displayed to user", required: true })
    @Column({ nullable: false, type: 'bool', name: 'display_result' })
	displayResult: boolean;

    @ApiProperty({ description: "If the student is overdue for the performing testing", required: true })
    @Column({ nullable: false, type: 'bool', name: 'is_overdue' })
	isOverdue: boolean;
}