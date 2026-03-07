import { authEndpoints } from "./auth.endpoint";
import { quizEndpoints } from "./quiz.endpoint";
import { questionEndpoints } from "./question.endpoint";
import { userEndpoints } from "./user.endpoint";

/**
 * This file defines the API endpoints for the application. Each endpoint is a string that represents the URL path to the resource.
 */
export const endpoints = {
  user: userEndpoints,
  auth: authEndpoints,
  question: questionEndpoints,
  quiz: quizEndpoints,
};
