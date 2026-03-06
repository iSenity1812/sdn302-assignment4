import { inject, injectable } from "inversify";
import { QUIZ_TYPES } from "../../di/quiz.token";
import type { IQuizRepository } from "../../domain/repositories/quiz-repository.interface";
import { ResponseQuiz } from "../dto/response-quiz.dto";
import { QuizOutputMapper } from "../mappers/quiz-output.mapper";

@injectable()
export class GetQuizUseCase {
  constructor(
    @inject(QUIZ_TYPES.Repository)
    private readonly quizRepository: IQuizRepository,
  ) {}

  async execute(id: string): Promise<ResponseQuiz | null> {
    const quiz = await this.quizRepository.findById(id);
    if (!quiz) {
      return null;
    }

    return QuizOutputMapper.toResponse(quiz);
  }
}
