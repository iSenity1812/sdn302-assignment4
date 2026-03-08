import * as React from "react";

import { QuizDto } from "@/features/quiz/types/quiz.dto";
import { ActiveExam, ExamSummary } from "../types/exam";

const initialState: ActiveExam = {
  quiz: {} as QuizDto,
  currentIndex: 0,
  answers: {},
  stage: "catalog",
};

export function useExamSession() {
  const [activeExam, setActiveExam] = React.useState<ActiveExam>(initialState);

  const currentQuestion = React.useMemo(() => {
    if (activeExam.stage !== "attempt") {
      return null;
    }

    return activeExam.quiz.questions[activeExam.currentIndex] ?? null;
  }, [activeExam]);

  const summary: ExamSummary = React.useMemo(() => {
    if (activeExam.stage === "catalog") {
      return { score: 0, total: 0, percent: 0 };
    }

    const total = activeExam.quiz.questions.length;
    const score = activeExam.quiz.questions.reduce((acc, question) => {
      return (
        acc +
        (activeExam.answers[question.id] === question.correctAnswer ? 1 : 0)
      );
    }, 0);

    const percent = total > 0 ? Math.round((score / total) * 100) : 0;

    return { score, total, percent };
  }, [activeExam]);

  function startExam(quiz: QuizDto) {
    setActiveExam({
      quiz,
      currentIndex: 0,
      answers: {},
      stage: "attempt",
    });
  }

  function backToCatalog() {
    setActiveExam(initialState);
  }

  function chooseAnswer(questionId: string, answer: string) {
    setActiveExam((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }));
  }

  function nextQuestion() {
    setActiveExam((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
    }));
  }

  function finishExam() {
    setActiveExam((prev) => ({
      ...prev,
      stage: "result",
    }));
  }

  function retryExam() {
    setActiveExam((prev) => ({
      ...prev,
      currentIndex: 0,
      answers: {},
      stage: "attempt",
    }));
  }

  return {
    activeExam,
    currentQuestion,
    summary,
    startExam,
    backToCatalog,
    chooseAnswer,
    nextQuestion,
    finishExam,
    retryExam,
  };
}
