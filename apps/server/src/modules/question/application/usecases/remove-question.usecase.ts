import { inject, injectable } from "inversify";
import { QUESTION_TYPES } from "../../di/question.token";
import type { IQuestionRepository } from "../../domain/repositories/question-repository.interface";
import { QuestionNotFoundError } from "../../domain/errors/question.error";

@injectable()
export class RemoveQuestionUseCase {
  constructor(
    @inject(QUESTION_TYPES.Repository)
    private readonly questionRepository: IQuestionRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const question = await this.questionRepository.findById(id);
    if (!question) {
      throw new QuestionNotFoundError(id);
    }

    await this.questionRepository.delete(id);
  }
}
