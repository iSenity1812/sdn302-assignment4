"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useArchiveQuiz } from "@/features/quiz/hooks/archive-quiz.hook";
import { useCreateQuiz } from "@/features/quiz/hooks/create-quiz.hook";
import { usePublishQuiz } from "@/features/quiz/hooks/publish-quiz.hook";
import { useRemoveQuiz } from "@/features/quiz/hooks/remove-quiz.hook";
import { useSearchQuizzes } from "@/features/quiz/hooks/search-quiz.hook";
import { QuizStatus, QuizDto } from "@/features/quiz/types/quiz.dto";

type StatusFilter = "ALL" | QuizStatus;

export default function QuizPage() {
  const createQuizMutation = useCreateQuiz();
  const publishQuizMutation = usePublishQuiz();
  const archiveQuizMutation = useArchiveQuiz();
  const removeQuizMutation = useRemoveQuiz();

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [keyword, setKeyword] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("ALL");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [deletingQuiz, setDeletingQuiz] = React.useState<QuizDto | null>(null);

  const searchParams = React.useMemo(
    () => (statusFilter === "ALL" ? undefined : { status: statusFilter }),
    [statusFilter],
  );
  const quizzesQuery = useSearchQuizzes(searchParams);

  const quizzes = React.useMemo(() => {
    if (!quizzesQuery.data?.success) {
      return [];
    }

    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) {
      return quizzesQuery.data.data;
    }

    return quizzesQuery.data.data.filter((quiz) => {
      const titleMatch = quiz.title.toLowerCase().includes(normalizedKeyword)
      const descriptionMatch = (quiz.description || "").toLowerCase().includes(normalizedKeyword)
      return titleMatch || descriptionMatch;
    });
  }, [keyword, quizzesQuery.data]);

  const handleCreateQuiz = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Quiz title is required.");
      return;
    }

    const response = await createQuizMutation.mutateAsync({
      title: title.trim(),
      description: description.trim() || undefined,
    });

    if (response.success) {
      toast.success(response.message || "Quiz created successfully");
      setTitle("");
      setDescription("");
      setCreateOpen(false);
      return;
    }

    toast.error(response.error.message || "Could not create quiz");
  };

  const handlePublishQuiz = async (id: string) => {
    const response = await publishQuizMutation.mutateAsync(id);
    if (response.success) {
      toast.success(response.message || "Quiz published");
      return;
    }

    toast.error(response.error.message || "Failed to publish quiz");
  };

  const handleArchiveQuiz = async (id: string) => {
    const response = await archiveQuizMutation.mutateAsync(id);
    if (response.success) {
      toast.success(response.message || "Quiz archived");
      return;
    }

    toast.error(response.error.message || "Failed to archive quiz");
  };

  const handleConfirmDelete = async () => {
    if (!deletingQuiz) {
      return;
    }

    const response = await removeQuizMutation.mutateAsync(deletingQuiz.id);
    if (response.success) {
      toast.success(response.message || "Quiz removed successfully");
      setDeletingQuiz(null);
      return;
    }

    toast.error(response.error.message || "Failed to remove quiz");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f4ef] px-4 py-8 text-stone-900 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-12 top-10 h-56 w-56 rounded-full bg-[#d9e6d0] blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#f0d9c8] blur-3xl" />
      </div>

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-6">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl border border-stone-300 bg-white/80 p-6 shadow-xl backdrop-blur"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-(--font-baloo) text-3xl tracking-tight text-stone-900">Quiz Studio</h1>
              <p className="mt-1 text-sm text-stone-600">Create quizzes, open a quiz, and manage question assignments.</p>
            </div>
            <Button className="bg-stone-900 text-white hover:bg-stone-800" onClick={() => setCreateOpen(true)}>
              Create Quiz
            </Button>
          </div>
        </motion.section>

        <section className="rounded-2xl border border-stone-300 bg-white/80 p-4 shadow-sm backdrop-blur">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search quiz by title or description"
              className="border-stone-300 bg-white"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              className="h-9 rounded-md border border-stone-300 bg-white px-3 text-sm"
            >
              <option value="ALL">All status</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quizzesQuery.isLoading ? (
            <div className="rounded-xl border border-stone-300 bg-white/80 p-5">Loading quizzes...</div>
          ) : null}

          {quizzesQuery.isError ? (
            <div className="rounded-xl border border-red-200 bg-white/80 p-5 text-red-700">Failed to load quizzes.</div>
          ) : null}

          {!quizzesQuery.isLoading && !quizzesQuery.isError && quizzes.length === 0 ? (
            <div className="rounded-xl border border-stone-300 bg-white/80 p-5">No quizzes yet.</div>
          ) : null}

          {quizzes.map((quiz, index) => (
            <motion.article
              key={quiz.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: index * 0.04 }}
              className="rounded-xl border border-stone-300 bg-white/85 p-5 shadow-md"
            >
              <h2 className="font-(--font-baloo) text-xl leading-tight">{quiz.title}</h2>
              <p className="mt-2 line-clamp-2 min-h-10 text-sm text-stone-600">{quiz.description || "No description."}</p>

              <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
                <span>{quiz.questions.length} questions</span>
                <span className="rounded-full border border-stone-300 px-2 py-0.5">{quiz.status}</span>
              </div>

              <div className="mt-4">
                <Button asChild className="w-full bg-[#274c77] text-white hover:bg-[#1f3d61]">
                  <Link href={`/quiz/${quiz.id}`}>Open Quiz</Link>
                </Button>
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-[#1f7a5a] text-white hover:bg-[#196247]"
                  disabled={publishQuizMutation.isPending || quiz.status === "PUBLISHED"}
                  onClick={() => handlePublishQuiz(quiz.id)}
                >
                  Publish
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-stone-400"
                  disabled={archiveQuizMutation.isPending || quiz.status === "ARCHIVED"}
                  onClick={() => handleArchiveQuiz(quiz.id)}
                >
                  Archive
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                  disabled={removeQuizMutation.isPending}
                  onClick={() => setDeletingQuiz(quiz)}
                >
                  Delete
                </Button>
              </div>
            </motion.article>
          ))}
        </section>
      </main>

      {createOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <button
            type="button"
            aria-label="Close create quiz dialog"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={() => setCreateOpen(false)}
          />
          <div className="relative z-10 w-full max-w-xl rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl">
            <h2 className="font-(--font-baloo) text-2xl text-stone-900">Create Quiz</h2>
            <p className="mt-1 text-sm text-stone-600">Add a title and optional description for your quiz.</p>

            <form onSubmit={handleCreateQuiz} className="mt-4 grid gap-3">
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Quiz title"
                className="border-stone-300 bg-white"
              />
              <Input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description (optional)"
                className="border-stone-300 bg-white"
              />

              <div className="mt-1 flex justify-end gap-2">
                <Button type="button" variant="outline" className="border-stone-300" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-stone-900 text-white hover:bg-stone-800"
                  disabled={createQuizMutation.isPending}
                >
                  {createQuizMutation.isPending ? "Creating..." : "Create Quiz"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deletingQuiz ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <button
            type="button"
            aria-label="Close delete confirmation dialog"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={() => setDeletingQuiz(null)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl">
            <h2 className="font-(--font-baloo) text-2xl text-stone-900">Delete Quiz</h2>
            <p className="mt-1 text-sm text-stone-600">
              This action cannot be undone. Do you want to delete <strong>{deletingQuiz.title}</strong>?
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" className="border-stone-300" onClick={() => setDeletingQuiz(null)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={removeQuizMutation.isPending}
              >
                {removeQuizMutation.isPending ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
