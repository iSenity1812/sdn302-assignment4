import { Quiz } from "@/modules/quiz/domain/entities/quiz";
import { QuizOption } from "@/modules/quiz/domain/value-objects/quiz-option.snapshot";
import { QuizQuestion } from "@/modules/quiz/domain/value-objects/quiz-question.snapshot";
import { QuizStatus } from "@/modules/quiz/domain/value-objects/quiz-status.vo";
import { QuizDocument } from "../persistence/quiz.model";

export class QuizPersistenceMapper {
  static toDomain(doc: QuizDocument): Quiz {
    return Quiz.reconstitute(doc._id.toString(), {
      title: doc.title,
      description: doc.description,
      createdBy: doc.createdBy,
      status: doc.status as QuizStatus,
      questions: doc.questions.map(
        (question) =>
          new QuizQuestion({
            id: question.id,
            content: question.content,
            options: question.options.map((value) => new QuizOption({ value })),
            correctAnswer: question.correctAnswer,
            difficulty: question.difficulty,
            type: question.type,
            explanation: question.explanation,
          }),
      ),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(quiz: Quiz) {
    return {
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
    };
  }
}
