import { Container } from "inversify";
import { QUIZ_TYPES } from "./di/quiz.token";
import type { IQuizRepository } from "./domain/repositories/quiz-repository.interface";
import { QuizRepository } from "./infrastructure/database/mongoose/repositories/quiz.repository";
import type { IQuizQueryRepository } from "./application/repositories/quiz-query-repository.interface";
import { QuizQueryRepository } from "./infrastructure/database/mongoose/repositories/quiz-query.repository";
import { QuizController } from "./presentation/quiz.controller";
import { CreateQuizUseCase } from "./application/usecases/create-quiz.usecase";
import { GetQuizUseCase } from "./application/usecases/get-quiz.usecase";
import { GetAllQuizUseCase } from "./application/usecases/get-all-quiz.usecase";
import { SearchQuizUseCase } from "./application/usecases/search-quiz.usecase";
import { UpdateQuizUseCase } from "./application/usecases/update-quiz.usecase";
import { AddQuizQuestionsUseCase } from "./application/usecases/add-quiz-questions.usecase";
import { RemoveQuizQuestionUseCase } from "./application/usecases/remove-quiz-question.usecase";
import { PublishQuizUseCase } from "./application/usecases/publish-quiz.usecase";
import { ArchiveQuizUseCase } from "./application/usecases/archive-quiz.usecase";

export function registerQuizModule(container: Container) {
  container.bind<IQuizRepository>(QUIZ_TYPES.Repository).to(QuizRepository);
  container
    .bind<IQuizQueryRepository>(QUIZ_TYPES.QueryRepository)
    .to(QuizQueryRepository);

  container.bind<QuizController>(QUIZ_TYPES.Controller).to(QuizController);

  container
    .bind<CreateQuizUseCase>(QUIZ_TYPES.UseCase.CreateQuiz)
    .to(CreateQuizUseCase);
  container.bind<GetQuizUseCase>(QUIZ_TYPES.UseCase.GetQuiz).to(GetQuizUseCase);
  container
    .bind<GetAllQuizUseCase>(QUIZ_TYPES.UseCase.GetAllQuiz)
    .to(GetAllQuizUseCase);
  container
    .bind<SearchQuizUseCase>(QUIZ_TYPES.UseCase.SearchQuiz)
    .to(SearchQuizUseCase);
  container
    .bind<UpdateQuizUseCase>(QUIZ_TYPES.UseCase.UpdateQuiz)
    .to(UpdateQuizUseCase);
  container
    .bind<AddQuizQuestionsUseCase>(QUIZ_TYPES.UseCase.AddQuizQuestions)
    .to(AddQuizQuestionsUseCase);
  container
    .bind<RemoveQuizQuestionUseCase>(QUIZ_TYPES.UseCase.RemoveQuizQuestion)
    .to(RemoveQuizQuestionUseCase);
  container
    .bind<PublishQuizUseCase>(QUIZ_TYPES.UseCase.PublishQuiz)
    .to(PublishQuizUseCase);
  container
    .bind<ArchiveQuizUseCase>(QUIZ_TYPES.UseCase.ArchiveQuiz)
    .to(ArchiveQuizUseCase);
}
