import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Result } from "./result.entity";
import { Answer } from "./answer.entity";

@Entity({ name: 'results_to_answers', engine: 'InnoDB' })
export class ResultToAnswer {
    @PrimaryColumn({ name: 'answer_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Answer,
        answer => answer.answerToResults,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'answer_id', referencedColumnName: 'id' })
    answer: Answer;

    @PrimaryColumn({ name: 'result_id', unique: false, type: 'int' })
    @ManyToOne(
        () => Result,
        result => result.resultToAnswers,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: false },
    )
    @JoinColumn({ name: 'result_id', referencedColumnName: 'id' })
    result: Result;
}