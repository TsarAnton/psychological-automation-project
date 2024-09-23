import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AnswerToLanguage } from "./entities/answer-to-language.entity";
import { Answer } from "./entities/answer.entity";
import { AvailableMethod } from "./entities/available-method.entity";
import { CriterionToLanguage } from "./entities/criterion-to-language.entity";
import { Criterion } from "./entities/criterion.entity";
import { IndicatorToLanguage } from "./entities/indicator-to-language.entity";
import { Indicator } from "./entities/indicator.entity";
import { Language } from "./entities/language.entity";
import { MethodToLanguage } from "./entities/method-to-language.entity";
import { Method } from "./entities/method.entity";
import { QuestionToLanguage } from "./entities/question-to-language.entity";
import { Question } from "./entities/question.entity";
import { ResultToAnswer } from "./entities/result-to-answer.entity";
import { ResultToIndicator } from "./entities/result-to-indicator.entity";
import { Result } from "./entities/result.entity";

import { LanguageService } from "./services/language.service";
import { MethodService } from "./services/method.service";
import { QuestionService } from "./services/question.service";
import { AnswerService } from "./services/answer.service";
import { IndicatorService } from "./services/indicator.service";
import { CriterionService } from "./services/criterion.service";
import { ResultService } from "./services/result.service";

import { LanguageController } from "./controllers/language.controller";
import { MethodController } from "./controllers/method.controller";
import { QuestionController } from "./controllers/question.controller";
import { AnswerController } from "./controllers/answer.controller";
import { IndicatorController } from "./controllers/indicator.controller";
import { CriterionController } from "./controllers/criterion.controller";
import { ResultController } from "./controllers/result.controller";

import { StudentModule } from "src/student/student.module";
import { AuthModule } from "src/auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { XlsxReportService } from "./services/xlsx-report.service";
import { XlsxReportController } from "./controllers/xlsx-report.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AnswerToLanguage,
            Answer,
            AvailableMethod,
            CriterionToLanguage,
            Criterion,
            IndicatorToLanguage,
            Indicator,
            Language,
            MethodToLanguage,
            Method,
            QuestionToLanguage,
            Question,
            ResultToAnswer,
            ResultToIndicator,
            Result,
        ]),
        StudentModule,
        AuthModule,
    ],
    controllers: [
        LanguageController,
        MethodController,
        AnswerController,
        QuestionController,
        IndicatorController,
        CriterionController,
        ResultController,
        XlsxReportController,
    ],
    providers: [
        LanguageService,
        MethodService,
        AnswerService,
        QuestionService,
        IndicatorService,
        CriterionService,
        ResultService,
        JwtService,
        XlsxReportService,
    ],
    exports: [
        LanguageService,
        MethodService,
        AnswerService,
        QuestionService,
        IndicatorService,
        CriterionService,
        ResultService,
        XlsxReportService,
    ]
})
export class TestModule {}