import { inject, injectable } from "inversify";
import { QUESTION_TYPES } from "../di/question.token";
import { CreateQuestionUseCase } from "../application/usecases/create-question.usecase";
import { GetQuestionUseCase } from "../application/usecases/get-question.usecase";
import { SearchQuestionUseCase } from "../application/usecases/search-question.usecase";
import { ShuffleQuestionUseCase } from "../application/usecases/shuffle-question.usecase";
import { UpdateQuestionUseCase } from "../application/usecases/update-question.usecase";
import { ArchiveQuestionUseCase } from "../application/usecases/archive-question.usecase";
import { Role as UserRole } from "@/shared/types/role.enum";
import { Role } from "@/shared/security/role.decorator";
import type { Request, Response, NextFunction } from "express";
import { QuestionValidationError } from "../domain/errors/question.error";
import { ok, paginated } from "@/shared/http/builder/response.factory";
import { CreateQuestionInput } from "../application/dto/create-question.dto";
import { UpdateQuestionInput } from "../application/dto/update-question.dto";
import { Difficulty } from "../domain/value-objects/difficulty.vo";
import { QuestionStatus } from "../domain/value-objects/question-status.vo";
import { GetAllQuestionUseCase } from "../application/usecases/get-all-question.usecase";

/**
 * Problem with current implementation:
 * - Inject too many use cases into controller, which violates Single Responsibility Principle
 * - Controller has too much logic for parsing and validating query parameters, which should be handled in use cases or separate validator classes
 * - Try/catch blocks in every controller method, which can be simplified with a global error handling middleware
 * - Lack of consistency in error handling and response formatting across different methods
 * - Some methods have authorization checks, while others don't, which can lead to security issues if not handled properly
 * - No clear separation between admin and user functionalities, which can lead to confusion and potential security risks
 */

/**
 * Overview feature:
 * - Admin can create, update, archive questions
 * - Users can view questions
 * - Questions can be categorized by topics
 */
@injectable()
export class QuestionController {
  constructor(
    @inject(QUESTION_TYPES.UseCase.CreateQuestion)
    private readonly createQuestionUseCase: CreateQuestionUseCase,

    @inject(QUESTION_TYPES.UseCase.GetQuestion)
    private readonly getQuestionUseCase: GetQuestionUseCase,

    @inject(QUESTION_TYPES.UseCase.GetAllQuestion)
    private readonly getAllQuestionUseCase: GetAllQuestionUseCase,

    @inject(QUESTION_TYPES.UseCase.SearchQuestion)
    private readonly searchQuestionUseCase: SearchQuestionUseCase,

    @inject(QUESTION_TYPES.UseCase.ShuffleQuestion)
    private readonly shuffleQuestionUseCase: ShuffleQuestionUseCase,

    @inject(QUESTION_TYPES.UseCase.UpdateQuestion)
    private readonly updateQuestionUseCase: UpdateQuestionUseCase,

    @inject(QUESTION_TYPES.UseCase.ArchiveQuestion)
    private readonly archiveQuestionUseCase: ArchiveQuestionUseCase,
  ) {}

  @Role(UserRole.USER, UserRole.ADMIN)
  async getAllQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const questions = await this.getAllQuestionUseCase.execute();
      return res
        .status(200)
        .json(
          ok(questions, { message: "All questions retrieved successfully" }),
        );
    } catch (error) {
      return next(error);
    }
  }

  @Role(UserRole.ADMIN)
  async createQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        authorId,
        content,
        type,
        options,
        correctAnswer,
        difficulty,
        tags,
        explanation,
      } = req.body;

      const resolvedAuthorId =
        typeof authorId === "string" ? authorId : req.user?.id;

      if (!resolvedAuthorId) {
        throw new QuestionValidationError("Author ID is required", {
          location: "body",
          field: "authorId",
          value: authorId,
        });
      }

      const input: CreateQuestionInput = {
        authorId: resolvedAuthorId,
        content,
        type,
        options,
        correctAnswer,
        difficulty,
        tags,
        explanation,
      };

      const question = await this.createQuestionUseCase.execute(input);

      return res
        .status(201)
        .json(ok(question, { message: "Question created successfully" }));
    } catch (error) {
      return next(error);
    }
  }

  @Role(UserRole.USER, UserRole.ADMIN)
  async getQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = req.params.id;
      if (typeof questionId !== "string") {
        throw new QuestionValidationError("Invalid question ID", {
          location: "params",
          field: "id",
          value: questionId,
        });
      }
      const question = await this.getQuestionUseCase.execute(questionId);
      res
        .status(200)
        .json(ok(question, { message: "Question retrieved successfully" }));
    } catch (error) {
      return next(error);
    }
  }

  @Role(UserRole.USER, UserRole.ADMIN)
  async searchQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const toNumber = (value: unknown): number | undefined => {
        if (typeof value !== "string") return undefined;
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
      };

      const parseTags = (value: unknown): string[] | undefined => {
        if (Array.isArray(value)) {
          return value.filter((tag): tag is string => typeof tag === "string");
        }

        if (typeof value === "string" && value.trim().length > 0) {
          return value
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
        }

        return undefined;
      };

      const result = await this.searchQuestionUseCase.execute({
        page: toNumber(req.query.page),
        limit: toNumber(req.query.limit),
        difficulty:
          typeof req.query.difficulty === "string"
            ? (req.query.difficulty as Difficulty)
            : undefined,
        status:
          typeof req.query.status === "string"
            ? (req.query.status as QuestionStatus)
            : undefined,
        authorId:
          typeof req.query.authorId === "string"
            ? req.query.authorId
            : undefined,
        tags: parseTags(req.query.tags),
      });

      return res.status(200).json(
        paginated(result.items, {
          page: result.page,
          limit: result.limit,
          total: result.total,
          message: "Questions retrieved successfully",
        }),
      );
    } catch (error) {
      return next(error);
    }
  }

  @Role(UserRole.USER, UserRole.ADMIN)
  async shuffleQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const toNumber = (value: unknown): number | undefined => {
        if (typeof value !== "string") return undefined;
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
      };

      const parseTags = (value: unknown): string[] | undefined => {
        if (Array.isArray(value)) {
          return value.filter((tag): tag is string => typeof tag === "string");
        }

        if (typeof value === "string" && value.trim().length > 0) {
          return value
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
        }

        return undefined;
      };

      const count = toNumber(req.query.count);
      if (!count) {
        throw new QuestionValidationError("Count must be greater than 0", {
          field: "count",
          location: "query",
          value: req.query.count,
        });
      }

      const result = await this.shuffleQuestionUseCase.execute({
        count,
        page: toNumber(req.query.page),
        limit: toNumber(req.query.limit),
        difficulty:
          typeof req.query.difficulty === "string"
            ? (req.query.difficulty as Difficulty)
            : undefined,
        tags: parseTags(req.query.tags),
      });

      return res.status(200).json(
        paginated(result.items, {
          page: result.page,
          limit: result.limit,
          total: result.total,
          message: "Shuffled questions retrieved successfully",
        }),
      );
    } catch (error) {
      return next(error);
    }
  }

  @Role(UserRole.ADMIN)
  async updateQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = req.params.id;
      if (typeof questionId !== "string") {
        throw new QuestionValidationError("Invalid question ID", {
          location: "params",
          field: "id",
          value: questionId,
        });
      }

      const { content, options, correctAnswer, difficulty, tags, explanation } =
        req.body;

      const input: UpdateQuestionInput = {
        id: questionId,
        content,
        options,
        correctAnswer,
        difficulty,
        tags,
        explanation,
      };

      const question = await this.updateQuestionUseCase.execute(input);

      return res
        .status(200)
        .json(ok(question, { message: "Question updated successfully" }));
    } catch (error) {
      return next(error);
    }
  }

  @Role(UserRole.ADMIN)
  async archiveQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = req.params.id;
      if (typeof questionId !== "string") {
        throw new QuestionValidationError("Invalid question ID", {
          location: "params",
          field: "id",
          value: questionId,
        });
      }

      await this.archiveQuestionUseCase.execute(questionId);
      return res
        .status(200)
        .json(
          ok(
            { archived: true, id: questionId },
            { message: "Question archived successfully" },
          ),
        );
    } catch (error) {
      return next(error);
    }
  }
}
