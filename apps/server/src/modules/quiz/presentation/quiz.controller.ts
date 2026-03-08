import { inject, injectable } from "inversify";
import { QUIZ_TYPES } from "../di/quiz.token";
import { CreateQuizUseCase } from "../application/usecases/create-quiz.usecase";
import { GetQuizUseCase } from "../application/usecases/get-quiz.usecase";
import { GetAllQuizUseCase } from "../application/usecases/get-all-quiz.usecase";
import { SearchQuizUseCase } from "../application/usecases/search-quiz.usecase";
import { UpdateQuizUseCase } from "../application/usecases/update-quiz.usecase";
import { AddQuizQuestionsUseCase } from "../application/usecases/add-quiz-questions.usecase";
import { RemoveQuizQuestionUseCase } from "../application/usecases/remove-quiz-question.usecase";
import { PublishQuizUseCase } from "../application/usecases/publish-quiz.usecase";
import { ArchiveQuizUseCase } from "../application/usecases/archive-quiz.usecase";
import { RemoveQuizUseCase } from "../application/usecases/remove-quiz.usecase";
import type { NextFunction, Request, Response } from "express";
import { Role } from "@/shared/security/role.decorator";
import { Role as UserRole } from "@/shared/types/role.enum";
import { ok, paginated } from "@/shared/http/builder/response.factory";
import { QuizValidationError } from "../domain/errors/quiz.error";
import { CreateQuizInput } from "../application/dto/create-quiz.dto";
import { UpdateQuizInput } from "../application/dto/update-quiz.dto";
import { QuizStatus } from "../domain/value-objects/quiz-status.vo";

@injectable()
export class QuizController {
  constructor(
    @inject(QUIZ_TYPES.UseCase.CreateQuiz)
    private readonly createQuizUseCase: CreateQuizUseCase,

    @inject(QUIZ_TYPES.UseCase.GetQuiz)
    private readonly getQuizUseCase: GetQuizUseCase,

    @inject(QUIZ_TYPES.UseCase.GetAllQuiz)
    private readonly getAllQuizUseCase: GetAllQuizUseCase,

    @inject(QUIZ_TYPES.UseCase.SearchQuiz)
    private readonly searchQuizUseCase: SearchQuizUseCase,

    @inject(QUIZ_TYPES.UseCase.UpdateQuiz)
    private readonly updateQuizUseCase: UpdateQuizUseCase,

    @inject(QUIZ_TYPES.UseCase.RemoveQuiz)
    private readonly removeQuizUseCase: RemoveQuizUseCase,

    @inject(QUIZ_TYPES.UseCase.AddQuizQuestions)
    private readonly addQuizQuestionsUseCase: AddQuizQuestionsUseCase,

    @inject(QUIZ_TYPES.UseCase.RemoveQuizQuestion)
    private readonly removeQuizQuestionUseCase: RemoveQuizQuestionUseCase,

    @inject(QUIZ_TYPES.UseCase.PublishQuiz)
    private readonly publishQuizUseCase: PublishQuizUseCase,

    @inject(QUIZ_TYPES.UseCase.ArchiveQuiz)
    private readonly archiveQuizUseCase: ArchiveQuizUseCase,
  ) {}

  @Role(UserRole.ADMIN)
  async createQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, createdBy } = req.body;
      const resolvedCreatedBy =
        typeof createdBy === "string" ? createdBy : req.user?.id;

      if (!resolvedCreatedBy) {
        throw new QuizValidationError("Creator ID is required", {
          location: "body",
          field: "createdBy",
          value: createdBy,
        });
      }

      const input: CreateQuizInput = {
        title,
        description,
        createdBy: resolvedCreatedBy,
      };

      const quiz = await this.createQuizUseCase.execute(input);
      return res
        .status(201)
        .json(ok(quiz, { message: "Quiz created successfully" }));
    } catch (error) {
      return next(error);
    }
  }

  @Role(UserRole.USER, UserRole.ADMIN)
  async getQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.params.id;
      if (typeof quizId !== "string") {
        throw new QuizValidationError("Invalid quiz ID", {
          location: "params",
          field: "id",
          value: quizId,
        });
      }

      const quiz = await this.getQuizUseCase.execute(quizId);
      return res
        .status(200)
        .json(ok(quiz, { message: "Quiz retrieved successfully" }));
    } catch (error) {
      return next(error);
    }
  }

  @Role(UserRole.USER, UserRole.ADMIN)
  async getAllQuizzes(req: Request, res: Response, next: NextFunction) {
    try {
      const quizzes = await this.getAllQuizUseCase.execute();
      return res
        .status(200)
        .json(ok(quizzes, { message: "All quizzes retrieved successfully" }));
    } catch (error) {
      return next(error);
    }
  }

  @Role(UserRole.USER, UserRole.ADMIN)
  async searchQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const toNumber = (value: unknown): number | undefined => {
        if (typeof value !== "string") return undefined;
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
      };

      const result = await this.searchQuizUseCase.execute({
        page: toNumber(req.query.page),
        limit: toNumber(req.query.limit),
        createdBy:
          typeof req.query.createdBy === "string"
            ? req.query.createdBy
            : undefined,
        status:
          typeof req.query.status === "string"
            ? (req.query.status as QuizStatus)
            : undefined,
      });

      return res.status(200).json(
        paginated(result.items, {
          page: result.page,
          limit: result.limit,
          total: result.total,
          message: "Quizzes retrieved successfully",
        }),
      );
    } catch (error) {
      return next(error);
    }
  }

  @Role(UserRole.ADMIN)
  async updateQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.params.id;
      if (typeof quizId !== "string") {
        throw new QuizValidationError("Invalid quiz ID", {
          location: "params",
          field: "id",
          value: quizId,
        });
      }

      const { title, description } = req.body;

      const input: UpdateQuizInput = {
        id: quizId,
        title,
        description,
      };

      const quiz = await this.updateQuizUseCase.execute(input);
      return res
        .status(200)
        .json(ok(quiz, { message: "Quiz updated successfully" }));
    } catch (error) {
      return next(error);
    }
  }

  @Role(UserRole.ADMIN)
  async removeQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.params.id;
      if (typeof quizId !== "string") {
        throw new QuizValidationError("Invalid quiz ID", {
          location: "params",
          field: "id",
          value: quizId,
        });
      }

      await this.removeQuizUseCase.execute(quizId);
      return res
        .status(200)
        .json(
          ok(
            { removed: true, id: quizId },
            { message: "Quiz removed successfully" },
          ),
        );
    } catch (error) {
      return next(error);
    }
  }

  @Role(UserRole.ADMIN)
  async addQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.params.id;
      if (typeof quizId !== "string") {
        throw new QuizValidationError("Invalid quiz ID", {
          location: "params",
          field: "id",
          value: quizId,
        });
      }

      const { questionIds, questions } = req.body;

      if (
        questionIds !== undefined &&
        (!Array.isArray(questionIds) ||
          questionIds.some((questionId) => typeof questionId !== "string"))
      ) {
        throw new QuizValidationError(
          "questionIds must be an array of strings",
          {
            location: "body",
            field: "questionIds",
            value: questionIds,
          },
        );
      }

      if (questions !== undefined && !Array.isArray(questions)) {
        throw new QuizValidationError("questions must be an array", {
          location: "body",
          field: "questions",
          value: questions,
        });
      }

      const authorId = req.user?.id;
      if (!authorId) {
        throw new QuizValidationError("Author ID is required", {
          location: "auth",
          field: "user.id",
        });
      }

      const quiz = await this.addQuizQuestionsUseCase.execute({
        id: quizId,
        questionIds,
        questions,
        authorId,
      });

      return res
        .status(200)
        .json(ok(quiz, { message: "Quiz questions added successfully" }));
    } catch (error) {
      return next(error);
    }
  }

  @Role(UserRole.ADMIN)
  async removeQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.params.id;
      const questionId = req.params.questionId;
      if (typeof quizId !== "string" || typeof questionId !== "string") {
        throw new QuizValidationError("Invalid identifier", {
          location: "params",
          field: "id/questionId",
          value: { quizId, questionId },
        });
      }

      const quiz = await this.removeQuizQuestionUseCase.execute({
        id: quizId,
        questionId,
      });

      return res
        .status(200)
        .json(ok(quiz, { message: "Quiz question removed successfully" }));
    } catch (error) {
      return next(error);
    }
  }

  @Role(UserRole.ADMIN)
  async publishQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.params.id;
      if (typeof quizId !== "string") {
        throw new QuizValidationError("Invalid quiz ID", {
          location: "params",
          field: "id",
          value: quizId,
        });
      }

      const quiz = await this.publishQuizUseCase.execute(quizId);
      return res
        .status(200)
        .json(ok(quiz, { message: "Quiz published successfully" }));
    } catch (error) {
      return next(error);
    }
  }

  @Role(UserRole.ADMIN)
  async archiveQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.params.id;
      if (typeof quizId !== "string") {
        throw new QuizValidationError("Invalid quiz ID", {
          location: "params",
          field: "id",
          value: quizId,
        });
      }

      await this.archiveQuizUseCase.execute(quizId);
      return res
        .status(200)
        .json(
          ok(
            { archived: true, id: quizId },
            { message: "Quiz archived successfully" },
          ),
        );
    } catch (error) {
      return next(error);
    }
  }
}
