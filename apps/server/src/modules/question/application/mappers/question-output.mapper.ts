import { Question } from "@question/domain/entities/question";
import { ResponseQuestion } from "../dto/response-question.dto";

export class QuestionOutputMapper {
  static toResponse(question: Question): ResponseQuestion {
    return {
      id: question.id,
      authorId: question.authorId,
      content: question.content,
      type: question.type,
      options: question.options.map((o) => o.value),
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
      tags: question.tags,
      explanation: question.explanation,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }
}
