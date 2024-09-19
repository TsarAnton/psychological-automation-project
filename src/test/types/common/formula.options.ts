import { BadRequestException } from "@nestjs/common";
import { evaluate } from "mathjs";

export type Formula = {
    name: string;
    formula: string;
}

function isFormulaVariablesExist(formulas: Formula[]): boolean {
    return formulas.filter(el => el.formula.indexOf("{") !== -1).length > 0;
}

function validateFormulasVariables(formulas: Formula[]): Formula[] {
    if(isFormulaVariablesExist(formulas)) {
        const variablesFormulas = formulas.map((el, index, array) => ({
            name: el.name,
            formula: el.formula.replaceAll(/(\{)([А-Яа-я0-9A-Za-z]+)(\})/g, function(match, p1, p2, p3) {
                const variableFormula = array.find(el => el.name === p2);
                if(variableFormula === undefined) {
                    throw new BadRequestException(`Variable '${p2}' does not exist`);
                }
                return "(" + variableFormula.formula + ")";
            }),
        }));
        return validateFormulasVariables(variablesFormulas);
    }
    return formulas;
}

function getFormulasQuestions(formulas: Formula[]): Number[] {
    let result = [];
    const numberRegex = /\d+/g;
    for(let formulaObj of formulas) {
        const formula = formulaObj.formula;
        const strDigites = formula.match(/(\[)(\d+)(\])/g);
        if(strDigites) {
            result = result.concat(strDigites).map(el => Number(el.match(numberRegex)));
        }
        const strIntervals = formula.match(/(\[)(\d+:\d+)(\])/g);
        if(strIntervals) {
            for(let strInterval of strIntervals) {
                const numberInterval = strInterval.match(numberRegex).map(el => Number(el));
                for(let i = numberInterval[0]; i <= numberInterval[1]; i++) {
                    result.push(i);
                }
            }
        }
    }
    return result;
}

export function validateFormulas(formulas: Formula[], questions: number[]): Formula[] {
    const answerFormulas = formulas.map(el => ({
        name: el.name,
        formula: (el.formula.replaceAll(/(\[)(\d+:\d+)(\])/g, function(match, p1, p2) {
            return "sum(answers[" + p2 + "])";
        })).replaceAll(/(\[)(\d+)(\])/g, function(match, p1, p2) {
            return "answers[" + p2 + "]";
        }),
    }));
    const variablesFormulas = validateFormulasVariables(answerFormulas);
    const formulasQuestions = getFormulasQuestions(variablesFormulas);
    for(let question of formulasQuestions) {
        if(questions.find(el => el === question) === undefined) {
            throw new BadRequestException(`Method does not have question with index '${question}'`);
        }
    }
    try {
        for(let formula of variablesFormulas) {
            evaluate(formula.formula, {
                answers: questions.map(el => 1),
            });
        }
    } catch (err) {
        throw new BadRequestException(`One of formulas has syntax errors`);
    }
    return variablesFormulas;
}