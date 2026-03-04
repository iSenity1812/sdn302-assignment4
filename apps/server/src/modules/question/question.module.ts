import { Container } from "inversify";
import { QUESTION_TYPES } from "./di/question.token";
import { IQuestionRepository } from "./domain/repositories/question-repository.interface";
import { IQuestionQueryRepository } from "./application/repositories/question-query-repository.interface";
import { QuestionRepository } from "./infrastructure/database/mongoose/repositories/question.repository";
import { questionQueryRepository } from "./infrastructure/database/mongoose/repositories/question-query.repository";
import { QuestionController } from "./presentation/question.controller";
import { CreateQuestionUseCase } from "./application/usecases/create-question.usecase";
import { GetQuestionUseCase } from "./application/usecases/get-question.usecase";
import { SearchQuestionUseCase } from "./application/usecases/search-question.usecase";
import { ShuffleQuestionUseCase } from "./application/usecases/shuffle-question.usecase";
import { UpdateQuestionUseCase } from "./application/usecases/update-question.usecase";
import { ArchiveQuestionUseCase } from "./application/usecases/archive-question.usecase";
import { GetAllQuestionUseCase } from "./application/usecases/get-all-question.usecase";

export function registerQuestionModule(container: Container) {
	container.bind<IQuestionRepository>(QUESTION_TYPES.Repository).to(QuestionRepository);
	container
		.bind<IQuestionQueryRepository>(QUESTION_TYPES.QueryRepository)
		.to(questionQueryRepository);

	container.bind<QuestionController>(QUESTION_TYPES.Controller).to(QuestionController);

	container
		.bind<CreateQuestionUseCase>(QUESTION_TYPES.UseCase.CreateQuestion)
		.to(CreateQuestionUseCase);
	container
		.bind<GetQuestionUseCase>(QUESTION_TYPES.UseCase.GetQuestion)
		.to(GetQuestionUseCase);
  container
    .bind<GetAllQuestionUseCase>(QUESTION_TYPES.UseCase.GetAllQuestion)
    .to(GetAllQuestionUseCase);
	container
		.bind<SearchQuestionUseCase>(QUESTION_TYPES.UseCase.SearchQuestion)
		.to(SearchQuestionUseCase);
	container
		.bind<ShuffleQuestionUseCase>(QUESTION_TYPES.UseCase.ShuffleQuestion)
		.to(ShuffleQuestionUseCase);
	container
		.bind<UpdateQuestionUseCase>(QUESTION_TYPES.UseCase.UpdateQuestion)
		.to(UpdateQuestionUseCase);
	container
		.bind<ArchiveQuestionUseCase>(QUESTION_TYPES.UseCase.ArchiveQuestion)
		.to(ArchiveQuestionUseCase);
}
