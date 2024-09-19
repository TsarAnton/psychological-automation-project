import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Student } from "src/student/entities/student.entity";
import { Method } from "./method.entity";

@Entity({ name: 'available_methods', engine: 'InnoDB' })
export class AvailableMethod {
    @PrimaryColumn({ name: 'method_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Method,
        method => method.availableStudents,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'method_id', referencedColumnName: 'id' })
    method: Method;

    @PrimaryColumn({ name: 'student_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Student,
        student => student.availableMethods,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'student_id', referencedColumnName: 'id' })
    student: Student;

    @Column({ nullable: false, type: 'timestamp', name: 'date_end' })
	dateEnd: Date;
}