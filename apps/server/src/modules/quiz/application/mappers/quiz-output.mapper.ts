import { Quiz } from "@/modules/quiz/domain/entities/quiz";
import { ResponseQuiz } from "../dto/response-quiz.dto";

export class QuizOutputMapper {
  static toResponse(quiz: Quiz): ResponseQuiz {
    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      createdBy: quiz.createdBy,
      status: quiz.status,
      questions: quiz.questions.map((question) => ({
        id: question.id,
        content: question.content,
        options: question.options.map((option) => option.value),
        correctAnswer: question.correctAnswer,
        difficulty: question.difficulty,
        type: question.type,
        explanation: question.explanation,
      })),
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    };
  }
}
