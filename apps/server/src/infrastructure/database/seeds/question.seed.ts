import { PinoLogger } from "@/infrastructure/observability/logging/pino-logger";
import { QuestionModel } from "@/modules/question/infrastructure/database/mongoose/persistence/question.model";
import { Difficulty } from "@/modules/question/domain/value-objects/difficulty.vo";
import { QuestionStatus } from "@/modules/question/domain/value-objects/question-status.vo";
import { buildQuestion } from "./factory/question.factory";
import { faker } from "@faker-js/faker";

export async function seedQuestions(adminIds: string[], logger?: PinoLogger) {
  if (adminIds.length === 0) {
    throw new Error("At least one admin user is required to seed questions");
  }

  const [primaryAdminId, secondaryAdminId = primaryAdminId] = adminIds;
  const adminPool = [primaryAdminId, secondaryAdminId];
  const pickAdmin = () => faker.helpers.arrayElement(adminPool);
  const enhanceExplanation = (base: string) =>
    `${base} Example context: ${faker.helpers.arrayElement([
      "quiz authoring workflow",
      "API endpoint design",
      "content publishing lifecycle",
      "distributed service integration",
    ])}.`;

  const questions = [
    buildQuestion({
      authorId: pickAdmin(),
      content:
        "In Clean Architecture, which layer is responsible for business rules?",
      options: [
        "Domain layer",
        "Presentation layer",
        "Infrastructure layer",
        "Database layer",
      ],
      correctAnswer: "Domain layer",
      difficulty: Difficulty.EASY,
      tags: ["architecture", "clean-architecture", "domain"],
      explanation: enhanceExplanation(
        "The domain layer contains enterprise business rules and is independent from frameworks.",
      ),
    }),
    buildQuestion({
      authorId: pickAdmin(),
      content:
        "What is the main purpose of using dependency injection in a Node.js service?",
      options: [
        "To reduce coupling between components",
        "To improve SQL query speed",
        "To replace async/await",
        "To avoid TypeScript types",
      ],
      correctAnswer: "To reduce coupling between components",
      difficulty: Difficulty.EASY,
      tags: ["di", "testing", "architecture"],
      explanation: enhanceExplanation(
        "Dependency injection helps isolate components and makes code easier to test and maintain.",
      ),
    }),
    buildQuestion({
      authorId: pickAdmin(),
      content:
        "Which HTTP method is most appropriate for partially updating a resource?",
      options: ["POST", "PUT", "PATCH", "GET"],
      correctAnswer: "PATCH",
      difficulty: Difficulty.EASY,
      tags: ["http", "rest", "api"],
      explanation: enhanceExplanation(
        "PATCH is intended for partial updates, while PUT usually replaces the whole resource.",
      ),
    }),
    buildQuestion({
      authorId: pickAdmin(),
      content:
        "Why should password hashes be stored instead of plain passwords?",
      options: [
        "To protect credentials if the database is leaked",
        "To make login faster",
        "To reduce storage size",
        "To simplify frontend validation",
      ],
      correctAnswer: "To protect credentials if the database is leaked",
      difficulty: Difficulty.EASY,
      tags: ["security", "authentication", "password"],
      explanation: enhanceExplanation(
        "Hashing makes it hard to recover original passwords even if attackers get DB access.",
      ),
    }),
    buildQuestion({
      authorId: pickAdmin(),
      content:
        "Which index strategy best supports frequent filtering by `createdBy` and `status`?",
      options: [
        "Compound index on (createdBy, status)",
        "Single index on title only",
        "No index, rely on cache",
        "Unique index on description",
      ],
      correctAnswer: "Compound index on (createdBy, status)",
      difficulty: Difficulty.MEDIUM,
      tags: ["mongodb", "indexing", "query-optimization"],
      explanation: enhanceExplanation(
        "A compound index matching common filter fields significantly improves query performance.",
      ),
    }),
    buildQuestion({
      authorId: pickAdmin(),
      content:
        "When using JWT access tokens, what is a common secure practice?",
      options: [
        "Use short expiry and rotate refresh tokens",
        "Store tokens in plain localStorage forever",
        "Disable token signature verification",
        "Share one token among all users",
      ],
      correctAnswer: "Use short expiry and rotate refresh tokens",
      difficulty: Difficulty.MEDIUM,
      tags: ["jwt", "security", "auth"],
      explanation: enhanceExplanation(
        "Short-lived access tokens and rotated refresh tokens reduce risk after token theft.",
      ),
    }),
    buildQuestion({
      authorId: pickAdmin(),
      content: "What does eventual consistency mean in distributed systems?",
      options: [
        "All replicas converge to the same state over time",
        "Writes are always globally synchronized instantly",
        "Transactions never fail",
        "Data is immutable forever",
      ],
      correctAnswer: "All replicas converge to the same state over time",
      difficulty: Difficulty.MEDIUM,
      tags: ["distributed-system", "consistency", "scalability"],
      explanation: enhanceExplanation(
        "Eventual consistency allows temporary divergence but guarantees convergence later.",
      ),
    }),
    buildQuestion({
      authorId: pickAdmin(),
      content:
        "In MongoDB, which aggregation stage is used to transform each document's shape?",
      options: ["$match", "$project", "$group", "$sort"],
      correctAnswer: "$project",
      difficulty: Difficulty.MEDIUM,
      tags: ["mongodb", "aggregation"],
      explanation: enhanceExplanation(
        "$project selects and computes fields to produce a new document shape.",
      ),
    }),
    buildQuestion({
      authorId: pickAdmin(),
      content: "What is the main trade-off when applying CQRS?",
      options: [
        "Better read/write optimization at the cost of increased complexity",
        "Fewer deployment units but slower reads",
        "No need for authorization rules",
        "Automatic strong consistency between all models",
      ],
      correctAnswer:
        "Better read/write optimization at the cost of increased complexity",
      difficulty: Difficulty.HARD,
      tags: ["cqrs", "architecture", "tradeoff"],
      explanation: enhanceExplanation(
        "CQRS can scale and optimize workloads separately but introduces additional moving parts.",
      ),
    }),
    buildQuestion({
      authorId: pickAdmin(),
      content:
        "Which testing approach verifies interactions between application use cases and external adapters?",
      options: [
        "Integration testing",
        "Snapshot testing only",
        "Linting",
        "Mutation testing",
      ],
      correctAnswer: "Integration testing",
      difficulty: Difficulty.HARD,
      tags: ["testing", "integration", "usecase"],
      explanation: enhanceExplanation(
        "Integration tests validate collaboration boundaries and real adapter behavior.",
      ),
    }),
    buildQuestion({
      authorId: pickAdmin(),
      content:
        "What is the risk of publishing domain events before database persistence succeeds?",
      options: [
        "Consumers may process events for data that does not exist",
        "Lower memory usage",
        "Improved idempotency by default",
        "Faster schema migrations",
      ],
      correctAnswer:
        "Consumers may process events for data that does not exist",
      difficulty: Difficulty.HARD,
      tags: ["domain-event", "reliability", "consistency"],
      explanation: enhanceExplanation(
        "If persistence fails after publishing, downstream systems observe invalid state transitions.",
      ),
    }),
    buildQuestion({
      authorId: pickAdmin(),
      content:
        "A legacy endpoint has been replaced. Which status is suitable for keeping old content hidden but retrievable in admin tools?",
      options: ["ACTIVE", "ARCHIVED", "DELETED", "DRAFT"],
      correctAnswer: "ARCHIVED",
      difficulty: Difficulty.MEDIUM,
      tags: ["lifecycle", "maintenance", "content-management"],
      explanation: enhanceExplanation(
        "ARCHIVED preserves history while removing content from normal active flows.",
      ),
      status: QuestionStatus.ARCHIVED,
    }),
  ];

  const inserted = await QuestionModel.insertMany(questions);
  logger?.info(`Seeded ${inserted.length} questions`, {
    active: inserted.filter(
      (question) => question.status === QuestionStatus.ACTIVE,
    ).length,
    archived: inserted.filter(
      (question) => question.status === QuestionStatus.ARCHIVED,
    ).length,
  });

  return inserted;
}
