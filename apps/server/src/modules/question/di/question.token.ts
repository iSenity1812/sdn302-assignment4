export const QUESTION_TYPES = {
  Service: Symbol.for("Question.Service"),
  Repository: Symbol.for("Question.Repository"),
  QueryRepository: Symbol.for("Question.QueryRepository"),
  Controller: Symbol.for("Question.Controller"),
  UseCase: {
    CreateQuestion: Symbol.for("Question.UseCase.CreateQuestion"),
    GetQuestion: Symbol.for("Question.UseCase.GetQuestion"),
    GetAllQuestion: Symbol.for("Question.UseCase.GetAllQuestion"),
    SearchQuestion: Symbol.for("Question.UseCase.SearchQuestion"),
    ShuffleQuestion: Symbol.for("Question.UseCase.ShuffleQuestion"),
    UpdateQuestion: Symbol.for("Question.UseCase.UpdateQuestion"),
    RemoveQuestion: Symbol.for("Question.UseCase.RemoveQuestion"),
    ArchiveQuestion: Symbol.for("Question.UseCase.ArchiveQuestion"),
  },
};
