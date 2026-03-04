import { Router, Request, Response, NextFunction } from "express";
import { QuestionController } from "./question.controller";
import { QUESTION_PREFIX } from "@/config/api-prefix.config";
import passport from "passport";
import { roleGuard } from "@/shared/security/role.guard";
import { UnauthorizedError } from "@/shared/errors/domain.errors";
import { AuthenticatedUser } from "@/shared/security/authenticated-user.interface";

export function questionRoutes(questionController: QuestionController): Router {
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
    `${QUESTION_PREFIX}`,
    jwtAuth,
    roleGuard(questionController, "createQuestion"),
    questionController.createQuestion.bind(questionController),
  );

  router.get(
    `${QUESTION_PREFIX}`,
    jwtAuth,
    roleGuard(questionController, "searchQuestion"),
    questionController.searchQuestion.bind(questionController),
  );

  router.get(
    `${QUESTION_PREFIX}/all`,
    jwtAuth,
    roleGuard(questionController, "getAllQuestions"),
    questionController.getAllQuestions.bind(questionController),
  )

  router.get(
    `${QUESTION_PREFIX}/shuffle`,
    jwtAuth,
    roleGuard(questionController, "shuffleQuestion"),
    questionController.shuffleQuestion.bind(questionController),
  );

  router.get(
    `${QUESTION_PREFIX}/:id`,
    jwtAuth,
    roleGuard(questionController, "getQuestion"),
    questionController.getQuestion.bind(questionController),
  );

  router.put(
    `${QUESTION_PREFIX}/:id`,
    jwtAuth,
    roleGuard(questionController, "updateQuestion"),
    questionController.updateQuestion.bind(questionController),
  );

  router.patch(
    `${QUESTION_PREFIX}/:id/archive`,
    jwtAuth,
    roleGuard(questionController, "archiveQuestion"),
    questionController.archiveQuestion.bind(questionController),
  );

  return router;

}
