export const QUIZ_TYPES = {
  Service: Symbol.for("Quiz.Service"),
  Repository: Symbol.for("Quiz.Repository"),
  QueryRepository: Symbol.for("Quiz.QueryRepository"),
  Controller: Symbol.for("Quiz.Controller"),
  UseCase: {
    CreateQuiz: Symbol.for("Quiz.UseCase.CreateQuiz"),
    GetQuiz: Symbol.for("Quiz.UseCase.GetQuiz"),
    GetAllQuiz: Symbol.for("Quiz.UseCase.GetAllQuiz"),
    SearchQuiz: Symbol.for("Quiz.UseCase.SearchQuiz"),
    UpdateQuiz: Symbol.for("Quiz.UseCase.UpdateQuiz"),
    AddQuizQuestions: Symbol.for("Quiz.UseCase.AddQuizQuestions"),
    RemoveQuizQuestion: Symbol.for("Quiz.UseCase.RemoveQuizQuestion"),
    PublishQuiz: Symbol.for("Quiz.UseCase.PublishQuiz"),
    ArchiveQuiz: Symbol.for("Quiz.UseCase.ArchiveQuiz"),
  },
};
