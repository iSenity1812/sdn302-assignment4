import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { roleGuard } from "@/shared/security/role.guard";
import { UnauthorizedError } from "@/shared/errors/domain.errors";
import { AuthenticatedUser } from "@/shared/security/authenticated-user.interface";
import { QUIZ_PREFIX } from "@/config/api-prefix.config";
import { QuizController } from "./quiz.controller";

export function quizRoutes(quizController: QuizController): Router {
  const router = Router();

  const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: Error | null, user: AuthenticatedUser | false | null) => {
        if (err) return next(err);
        if (!user) return next(new UnauthorizedError("Unauthorized"));
        req.user = user;
        return next();
      },
    )(req, res, next);
  };

  router.post(
    `${QUIZ_PREFIX}`,
    jwtAuth,
    roleGuard(quizController, "createQuiz"),
    quizController.createQuiz.bind(quizController),
  );

  router.get(
    `${QUIZ_PREFIX}`,
    jwtAuth,
    roleGuard(quizController, "searchQuiz"),
    quizController.searchQuiz.bind(quizController),
  );

  router.get(
    `${QUIZ_PREFIX}/all`,
    jwtAuth,
    roleGuard(quizController, "getAllQuizzes"),
    quizController.getAllQuizzes.bind(quizController),
  );

  router.get(
    `${QUIZ_PREFIX}/:id`,
    jwtAuth,
    roleGuard(quizController, "getQuiz"),
    quizController.getQuiz.bind(quizController),
  );

  router.put(
    `${QUIZ_PREFIX}/:id`,
    jwtAuth,
    roleGuard(quizController, "updateQuiz"),
    quizController.updateQuiz.bind(quizController),
  );

  router.post(
    `${QUIZ_PREFIX}/:id/questions`,
    jwtAuth,
    roleGuard(quizController, "addQuestions"),
    quizController.addQuestions.bind(quizController),
  );

  router.delete(
    `${QUIZ_PREFIX}/:id/questions/:questionId`,
    jwtAuth,
    roleGuard(quizController, "removeQuestion"),
    quizController.removeQuestion.bind(quizController),
  );

  router.patch(
    `${QUIZ_PREFIX}/:id/publish`,
    jwtAuth,
    roleGuard(quizController, "publishQuiz"),
    quizController.publishQuiz.bind(quizController),
  );

  router.patch(
    `${QUIZ_PREFIX}/:id/archive`,
    jwtAuth,
    roleGuard(quizController, "archiveQuiz"),
    quizController.archiveQuiz.bind(quizController),
  );

  return router;
}
