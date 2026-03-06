import { inject, injectable } from "inversify";
import { QUIZ_TYPES } from "../../di/quiz.token";
import type { IQuizRepository } from "../../domain/repositories/quiz-repository.interface";
import { ResponseQuiz } from "../dto/response-quiz.dto";
import { QuizOutputMapper } from "../mappers/quiz-output.mapper";

@injectable()
export class GetAllQuizUseCase {
  constructor(
    @inject(QUIZ_TYPES.Repository)
    private readonly quizRepository: IQuizRepository,
  ) {}

  async execute(): Promise<ResponseQuiz[]> {
    const quizzes = await this.quizRepository.findAll();
    return quizzes.map(QuizOutputMapper.toResponse);
  }
}
