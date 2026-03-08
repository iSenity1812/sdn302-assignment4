import { inject, injectable } from "inversify";
import { QUIZ_TYPES } from "../../di/quiz.token";
import type { IQuizRepository } from "../../domain/repositories/quiz-repository.interface";
import { QuizNotFoundError } from "../../domain/errors/quiz.error";

@injectable()
export class RemoveQuizUseCase {
  constructor(
    @inject(QUIZ_TYPES.Repository)
    private readonly quizRepository: IQuizRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const quiz = await this.quizRepository.findById(id);
    if (!quiz) {
      throw new QuizNotFoundError(`Quiz with id ${id} not found`);
    }

    await this.quizRepository.delete(id);
  }
}
