import { Role } from "src/auth/entities/role.entity";
import { UserToRole } from "src/auth/entities/user-to-role.entity";;
import { Faculty } from "src/student/entities/faculty.entity";
import { Group } from "src/student/entities/group.entity";
import { Student } from "src/student/entities/student.entity";
import { AnswerToLanguage } from "src/test/entities/answer-to-language.entity";
import { Answer } from "src/test/entities/answer.entity";
import { AvailableMethod } from "src/test/entities/available-method.entity";
import { CriterionToLanguage } from "src/test/entities/criterion-to-language.entity";
import { Criterion } from "src/test/entities/criterion.entity";
import { IndicatorToLanguage } from "src/test/entities/indicator-to-language.entity";
import { Indicator } from "src/test/entities/indicator.entity";
import { Language } from "src/test/entities/language.entity";
import { MethodToLanguage } from "src/test/entities/method-to-language.entity";
import { Method } from "src/test/entities/method.entity";
import { QuestionToLanguage } from "src/test/entities/question-to-language.entity";
import { Question } from "src/test/entities/question.entity";
import { ResultToAnswer } from "src/test/entities/result-to-answer.entity";
import { ResultToIndicator } from "src/test/entities/result-to-indicator.entity";
import { Result } from "src/test/entities/result.entity";
import { MigrationInterface, QueryRunner } from "typeorm";
import * as argon2 from "argon2";
import { User } from "src/auth/entities/user.entity";

export class  $npmConfigName1726294311683 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const newRoles = [{ name: 'admin' }, { name: 'specialist' }, { name: 'student' }];
        
        await queryRunner.manager.insert(Role, newRoles);

        const studentRoleId = (await queryRunner.manager.findOne(Role, {
            where: {
                name: 'student'
            }
        })).id;

        const facultyCount = Math.floor(Math.random() * 9) + 1;
        for(let i = 0; i < facultyCount; i++) {
            const newFaculty = await queryRunner.manager.save(Faculty, {
                name: 'faculty' + i,
            });
            const groupCount = Math.floor(Math.random() * 4) + 1;
            for(let j = 0; j < groupCount; j++) {
                const newGroup = await queryRunner.manager.save(Group, {
                    name: 'group' + i + j,
                    faculty: { id: newFaculty.id },
                });
                const studentCount = Math.floor(Math.random() * 19) + 1;
                for(let k = 0; k < studentCount; k++) {
                    const newUser = await queryRunner.manager.save(User, {
                        login: 'user' + i + j + k,
                        password: await argon2.hash('user' + i + j + k)
                    });

                    await queryRunner.manager.save(UserToRole, {
                        user: { id: newUser.id },
                        role: { id: studentRoleId },
                    });

                    await queryRunner.manager.save(Student, {
                        recordBookNumber: 'recordBook' + i + j + k,
                        name: 'name' + i + j + k,
                        surname: 'surname' + i + j + k,
                        patronymic: 'patronymic' + i + j + k,
                        phoneNumber: '+375' + i + j + k,
                        group: { id: newGroup.id },
                        user: { id: newUser.id },
                    })
                }
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(UserToRole, {});
        await queryRunner.manager.delete(Role, {});
        await queryRunner.manager.delete(AvailableMethod, {});
        await queryRunner.manager.delete(ResultToAnswer, {});
        await queryRunner.manager.delete(CriterionToLanguage, {});
        await queryRunner.manager.delete(IndicatorToLanguage, {});
        await queryRunner.manager.delete(MethodToLanguage, {});
        await queryRunner.manager.delete(QuestionToLanguage, {});
        await queryRunner.manager.delete(AnswerToLanguage, {});
        await queryRunner.manager.delete(Language, {});
        await queryRunner.manager.delete(ResultToIndicator, {});
        await queryRunner.manager.delete(ResultToAnswer, {});
        await queryRunner.manager.delete(Result, {});
        await queryRunner.manager.delete(Student, {});
        await queryRunner.manager.delete(Group, {});
        await queryRunner.manager.delete(Faculty, {});
        await queryRunner.manager.delete(Answer, {});
        await queryRunner.manager.delete(Question, {});
        await queryRunner.manager.delete(Criterion, {});
        await queryRunner.manager.delete(Indicator, {});
        await queryRunner.manager.delete(Method, {});
    }

}
