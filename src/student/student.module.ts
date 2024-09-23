import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Faculty } from "./entities/faculty.entity";
import { Group } from "./entities/group.entity";
import { Student } from "./entities/student.entity";

import { FacultyService } from "./services/faculty.service";
import { GroupService } from "./services/group.service";
import { StudentService } from "./services/student.service";

import { FacultyController } from "./controllers/faculty.controller";
import { GroupController } from "./controllers/group.controller";
import { StudentController } from "./controllers/student.controller";
import { AuthModule } from "src/auth/auth.module";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Faculty,
            Group,
            Student,
        ]),
        forwardRef(() => AuthModule),
    ],
    controllers: [
        FacultyController,
        GroupController,
        StudentController,
    ],
    providers: [
        FacultyService,
        GroupService,
        StudentService,
        JwtService,
    ],
    exports: [
        FacultyService,
        GroupService,
        StudentService,
    ]
})
export class StudentModule {}