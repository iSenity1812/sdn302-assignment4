import { Question } from "@question/domain/entities/question";
import { ResponseQuestion } from "../dto/response-question.dto";
import { plainToInstance } from "class-transformer";

export class QuestionOutputMapper {
  static toResponse(question: Question): ResponseQuestion {
    return plainToInstance(
      ResponseQuestion,
      {
        id: question.id,
        authorId: question.authorId,
        content: question.content,
        type: question.type,
        options: question.options.map((opt) => opt.value),
        correctAnswer: question.correctAnswer,
        difficulty: question.difficulty,
        tags: question.tags,
        explanation: question.explanation,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      },
      { excludeExtraneousValues: true },
    );
  }
}
