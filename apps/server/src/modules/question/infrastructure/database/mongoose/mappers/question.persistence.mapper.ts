import { Question } from "@/modules/question/domain/entities/question";
import { QuestionDocument } from "../persistence/question.model";
import { QuestionType } from "@/modules/question/domain/value-objects/question-type.vo";
import { Option } from "@/modules/question/domain/value-objects/option.vo";
import { Difficulty } from "@/modules/question/domain/value-objects/difficulty.vo";
import { QuestionStatus } from "@/modules/question/domain/value-objects/question-status.vo";

export class QuestionPersistenceMapper {
  static toDomain(doc: QuestionDocument): Question {
    return Question.reconstitute(doc._id.toString(), {
      authorId: doc.authorId,
      content: doc.content,
      type: doc.type as QuestionType,
      options: doc.options.map((opt) => new Option(opt)),
      correctAnswer: doc.correctAnswer,
      difficulty: doc.difficulty as Difficulty,
      tags: doc.tags,
      explanation: doc.explanation,
      status: doc.status as QuestionStatus,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(question: Question) {
    return {
      authorId: question.authorId,
      content: question.content,
      type: question.type,
      options: question.options.map(o => o.value),
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
      tags: question.tags,
      explanation: question["props"].explanation,
      status: question.status,
    }
  }
}
