import { CreateIndicatorInMethodDto } from "src/test/dto/indicator.dto";
import { CreateFullMethodDto } from "src/test/dto/method.dto";

function createDefaultYesNoMethod(
    method: CreateFullMethodDto,
    questions: string[],
): CreateFullMethodDto {
    const newMethod = { ...method };
    const yesNoAnswers = [
        {
            point: 1,
            languages: [{
                language: 1,
                name: "Да",
            }],
        },
        {
            point: 0,
            languages: [{
                language: 1,
                name: "Нет",
            }],
        },
    ];

    for(let i = 0; i < questions.length; i++) {
        newMethod.questions.push({
            index: i + 1,
            languages: [
                {
                    language: 1,
                    name: questions[i],
                },
            ],
            answers: yesNoAnswers,
        })
    }

    return newMethod;
}

const methodPsychologicalAdaptabilityWithoutQuestions = {
    timer: null,
    languages: [
        {
            language: 1,
            name: "Самооценка психологической адаптивности",
            description: "Инструкция: Если Вы безусловно согласны с утверждением, напишите ответ «да», если не согласны, — напишите ответ «нет».",
        },
    ],
    questions: [],
    indicators: [
        {
            formula: "[1:10]",
            display: 0,
            name: "A",
        },
        {
            formula: "[11:15]",
            display: 0,
            name: "B",
        },
        {
            formula: "{A} - {B}",
            display: 1,
            name: "Displayed",
            languages: [
                {
                    language: 1,
                    name: "Показатель психологической гибкости в процессе деятельности",
                },
            ],
            criteria: [
                {
                    alarming: 2,
                    minValue: 0,
                    maxValue: 3,
                    languages: [
                        {
                            language: 1,
                            name: "Низкий",
                        }
                    ],
                },
                {
                    alarming: 1,
                    minValue: 4,
                    maxValue: 4,
                    languages: [
                        {
                            language: 1,
                            name: "Ниже среднего",
                        }
                    ],
                },
                {
                    alarming: 0,
                    minValue: 5,
                    maxValue: 5,
                    languages: [
                        {
                            language: 1,
                            name: "Средний",
                        }
                    ],
                },
                {
                    alarming: 0,
                    minValue: 6,
                    maxValue: 7,
                    languages: [
                        {
                            language: 1,
                            name: "Выше среднего",
                        }
                    ],
                },
                {
                    alarming: 0,
                    minValue: 8,
                    maxValue: 10,
                    languages: [
                        {
                            language: 1,
                            name: "Высокий",
                        }
                    ],
                },
            ],
        }
    ],
};

export const methodPsychologicalAdaptability = createDefaultYesNoMethod(methodPsychologicalAdaptabilityWithoutQuestions,
    [
        'Я часто испытываю тягу к новым впечатлениям',
        'Мне нравится работа, которая требует быстрого и частого переключения с одной операции на другую, с одного дела на другое',
        'Я могу быстро перейти от покоя (отдыха) к интенсивной деятельности',
        'Я быстро схожусь с новыми людьми',
        'Я быстро засыпаю и пробуждаюсь',
        'Я быстро осваиваюсь в новой обстановке, включаюсь в новое для себя дело',
        'Мне нравится, когда на работе появляются новые люди',
        'Я люблю бывать в новом для себя обществе',
        'Мне приходится, слышать от окружающих и друзей, что я человек очень деятельный и подвижный',
        'Новый для меня учебный материал я обычно запоминаю и усваиваю очень быстро, хотя иногда способен так же быстро его забывать',
        'Я не люблю заводить новых знакомств',
        'Мне очень трудно расстаться с какой-либо мыслью, в которую я когда-то поверил, хотя много убедительных доводов против этой мысли',
        'Новые навыки в какой-либо деятельности, новые привычки формируются- у меня медленно, но зато очень прочно',
        'Меня иногда называют флегматичным (или упрекают в медлительности)',
        'Я не люблю подвижных игр',
    ]
);