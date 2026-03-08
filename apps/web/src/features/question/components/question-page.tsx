"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateQuestion } from "@/features/question/hooks/create-question.hook";
import { useRemoveQuestion } from "@/features/question/hooks/remove-question.hook";
import { useSearchQuestions } from "@/features/question/hooks/search-question.hook";
import { useUpdateQuestion } from "@/features/question/hooks/update-question.hook";
import { QuestionDto, Difficulty, QuestionStatus } from "@/features/question/types/question.dto";
import { QuestionSearchQuery } from "@/features/question/types/question-search.query";
import { QuestionDialog } from "./question-dialog";
import { QuestionFormDialog, QuestionFormPayload } from "./question-form-dialog";

type DifficultyFilter = "ALL" | Difficulty;
type StatusFilter = "ALL" | QuestionStatus;

const badgeBase =
  "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide";

const difficultyBadgeClass: Record<Difficulty, string> = {
  EASY: "border-emerald-300 bg-emerald-50 text-emerald-700",
  MEDIUM: "border-amber-300 bg-amber-50 text-amber-700",
  HARD: "border-rose-300 bg-rose-50 text-rose-700",
};

const statusBadgeClass: Record<QuestionStatus, string> = {
  ACTIVE: "border-sky-300 bg-sky-50 text-sky-700",
  ARCHIVED: "border-stone-300 bg-stone-100 text-stone-600",
};

const formatTypeBadge = (type: string) => {
  if (type === "MULTIPLE_CHOICE") {
    return "MC";
  }

  return type;
};

export function QuestionPageView() {
  const createQuestionMutation = useCreateQuestion();
  const updateQuestionMutation = useUpdateQuestion();
  const removeQuestionMutation = useRemoveQuestion();

  const [keyword, setKeyword] = React.useState("");
  const [tagsFilter, setTagsFilter] = React.useState("");
  const [difficultyFilter, setDifficultyFilter] = React.useState<DifficultyFilter>("ALL");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("ALL");
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(12);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editingQuestion, setEditingQuestion] = React.useState<QuestionDto | null>(null);
  const [deletingQuestion, setDeletingQuestion] = React.useState<QuestionDto | null>(null);

  const searchParams = React.useMemo<QuestionSearchQuery | undefined>(() => {
    const params: QuestionSearchQuery = {};

    if (difficultyFilter !== "ALL") {
      params.difficulty = difficultyFilter;
    }

    if (statusFilter !== "ALL") {
      params.status = statusFilter;
    }

    if (tagsFilter.trim()) {
      params.tags = tagsFilter
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    params.page = page;
    params.limit = limit;

    return Object.keys(params).length > 0 ? params : undefined;
  }, [difficultyFilter, statusFilter, tagsFilter, page, limit]);

  React.useEffect(() => {
    setPage(1);
  }, [difficultyFilter, statusFilter, tagsFilter, limit]);

  const questionsQuery = useSearchQuestions(searchParams);

  const questions = React.useMemo(() => {
    if (!questionsQuery.data?.success) {
      return [];
    }

    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) {
      return questionsQuery.data.data;
    }

    return questionsQuery.data.data.filter((question) => {
      const matchesContent = question.content.toLowerCase().includes(normalizedKeyword);
      const matchesOptions = question.options.some((option) => option.toLowerCase().includes(normalizedKeyword));
      const matchesTags = question.tags.some((tag) => tag.toLowerCase().includes(normalizedKeyword));
      return matchesContent || matchesOptions || matchesTags;
    });
  }, [keyword, questionsQuery.data]);

  const pagination = questionsQuery.data?.meta?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.page ?? page;
  const hasPrev = pagination?.hasPrev ?? currentPage > 1;
  const hasNext = pagination?.hasNext ?? currentPage < totalPages;

  const onCreate = async ({ create }: QuestionFormPayload) => {
    const response = await createQuestionMutation.mutateAsync(create);
    if (response.success) {
      toast.success(response.message || "Question created successfully");
      setCreateOpen(false);
      return;
    }

    toast.error(response.error.message || "Failed to create question");
  };

  const onEdit = async ({ update }: QuestionFormPayload) => {
    if (!editingQuestion) {
      return;
    }

    const response = await updateQuestionMutation.mutateAsync({
      id: editingQuestion.id,
      data: update,
    });

    if (response.success) {
      toast.success(response.message || "Question updated successfully");
      setEditingQuestion(null);
      return;
    }

    toast.error(response.error.message || "Failed to update question");
  };

  const confirmDelete = async () => {
    if (!deletingQuestion) {
      return;
    }

    const response = await removeQuestionMutation.mutateAsync(deletingQuestion.id);
    if (response.success) {
      toast.success(response.message || "Question deleted successfully");
      setDeletingQuestion(null);
      return;
    }

    toast.error(response.error.message || "Failed to delete question");
  };

  return (
    <div className="min-h-screen bg-[#f4f8f1] px-4 py-8 text-stone-900 sm:px-6">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <section className="rounded-2xl border border-stone-300 bg-white p-6 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-(--font-baloo) text-3xl">Question Bank</h1>
              <p className="mt-1 text-sm text-stone-600">Create, edit, search, and delete questions.</p>
            </div>
            <Button className="bg-stone-900 text-white hover:bg-stone-800" onClick={() => setCreateOpen(true)}>
              Create Question
            </Button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search by content, option, or tag"
              className="border-stone-300"
            />

            <Input
              value={tagsFilter}
              onChange={(event) => setTagsFilter(event.target.value)}
              placeholder="Filter tags: math, easy"
              className="border-stone-300"
            />

            <select
              value={difficultyFilter}
              onChange={(event) => setDifficultyFilter(event.target.value as DifficultyFilter)}
              className="h-9 rounded-md border border-stone-300 bg-white px-3 text-sm"
            >
              <option value="ALL">All difficulty</option>
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              className="h-9 rounded-md border border-stone-300 bg-white px-3 text-sm"
            >
              <option value="ALL">All status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {questionsQuery.isLoading ? <p>Loading questions...</p> : null}
          {questionsQuery.isError ? <p className="text-red-700">Failed to load questions.</p> : null}

          {!questionsQuery.isLoading && !questionsQuery.isError && questions.length === 0 ? (
            <p className="text-stone-600">No matching questions.</p>
          ) : null}

          {questions.map((question, index) => (
            <motion.article
              key={question.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
              className="rounded-xl border border-stone-300 bg-white p-4 shadow"
            >
              <div className="flex flex-wrap gap-1.5">
                <span className={`${badgeBase} border-indigo-300 bg-indigo-50 text-indigo-700`}>
                  Type: {formatTypeBadge(question.type)}
                </span>
                <span className={`${badgeBase} ${difficultyBadgeClass[question.difficulty]}`}>
                  {question.difficulty}
                </span>
                <span className={`${badgeBase} ${statusBadgeClass[question.status || "ACTIVE"]}`}>
                  {question.status || "ACTIVE"}
                </span>
              </div>

              <h2 className="mt-1 line-clamp-3 text-sm font-medium text-stone-800">{question.content}</h2>

              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className={`${badgeBase} border-violet-300 bg-violet-50 text-violet-700`}>
                  Correct: {question.correctAnswer}
                </span>

                {question.tags.length > 0 ? (
                  question.tags.map((tag) => (
                    <span key={`${question.id}-${tag}`} className={`${badgeBase} border-teal-300 bg-teal-50 text-teal-700`}>
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className={`${badgeBase} border-stone-300 bg-stone-100 text-stone-500`}>No tags</span>
                )}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-stone-300"
                  onClick={() => setEditingQuestion(question)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => setDeletingQuestion(question)}
                >
                  Delete
                </Button>
              </div>
            </motion.article>
          ))}
        </section>

        <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-300 bg-white p-3">
          <div className="text-sm text-stone-600">
            Page {currentPage} / {Math.max(totalPages, 1)}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={(event) => setLimit(Number(event.target.value))}
              className="h-8 rounded-md border border-stone-300 bg-white px-2 text-xs"
            >
              <option value={6}>6 / page</option>
              <option value={12}>12 / page</option>
              <option value={24}>24 / page</option>
            </select>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-stone-300"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={!hasPrev || questionsQuery.isFetching}
            >
              Prev
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-stone-300"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!hasNext || questionsQuery.isFetching}
            >
              Next
            </Button>
          </div>
        </section>
      </main>

      <QuestionFormDialog
        open={createOpen}
        mode="create"
        isSubmitting={createQuestionMutation.isPending}
        onOpenChange={setCreateOpen}
        onSubmit={onCreate}
      />

      <QuestionFormDialog
        open={Boolean(editingQuestion)}
        mode="edit"
        initialQuestion={editingQuestion}
        isSubmitting={updateQuestionMutation.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setEditingQuestion(null);
          }
        }}
        onSubmit={onEdit}
      />

      <QuestionDialog
        open={Boolean(deletingQuestion)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingQuestion(null);
          }
        }}
        title="Delete Question"
        description={
          deletingQuestion
            ? `This will permanently remove the question: "${deletingQuestion.content}"`
            : undefined
        }
      >
        <div className="mt-3 flex justify-end gap-2">
          <Button type="button" variant="outline" className="border-stone-300" onClick={() => setDeletingQuestion(null)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={confirmDelete}
            disabled={removeQuestionMutation.isPending}
          >
            {removeQuestionMutation.isPending ? "Deleting..." : "Confirm Delete"}
          </Button>
        </div>
      </QuestionDialog>
    </div>
  );
}
