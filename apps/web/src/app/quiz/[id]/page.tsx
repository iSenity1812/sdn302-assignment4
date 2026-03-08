"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGetAllQuestions } from "@/features/question/hooks/get-all-question.hook"
import { useShuffleQuestions } from "@/features/question/hooks/shuffle-question.hook"
import { Difficulty } from "@/features/question/types/question.dto"
import { QuestionShuffleQuery } from "@/features/question/types/question-shuffle.query"
import { useAddQuizQuestions } from "@/features/quiz/hooks/add-quiz-questions.hook"
import { useArchiveQuiz } from "@/features/quiz/hooks/archive-quiz.hook"
import { useGetQuiz } from "@/features/quiz/hooks/get-quiz.hook"
import { usePublishQuiz } from "@/features/quiz/hooks/publish-quiz.hook"
import { useRemoveQuizQuestion } from "@/features/quiz/hooks/remove-quiz-question.hook"
import { useUpdateQuiz } from "@/features/quiz/hooks/update-quiz.hook"

export default function QuizDetailPage() {
	const params = useParams<{ id: string }>()
	const quizId = params.id

	const quizQuery = useGetQuiz(quizId)
	const questionsQuery = useGetAllQuestions()
	const [shuffleQuery, setShuffleQuery] = React.useState<QuestionShuffleQuery>({ count: 0 })
	const shuffleQuestionsQuery = useShuffleQuestions(shuffleQuery)
	const updateQuizMutation = useUpdateQuiz()
	const addQuestionsMutation = useAddQuizQuestions()
	const removeQuestionMutation = useRemoveQuizQuestion()
	const publishQuizMutation = usePublishQuiz()
	const archiveQuizMutation = useArchiveQuiz()

	const quiz = quizQuery.data?.success ? quizQuery.data.data : null
	const allQuestions = questionsQuery.data?.success ? questionsQuery.data.data : []

	const [title, setTitle] = React.useState("")
	const [description, setDescription] = React.useState("")
	const [selectedQuestionIds, setSelectedQuestionIds] = React.useState<string[]>([])
	const [shuffleCount, setShuffleCount] = React.useState("5")
	const [shuffleDifficulty, setShuffleDifficulty] = React.useState<"" | Difficulty>("")
	const [shuffleTags, setShuffleTags] = React.useState("")
	const [questionSourceMode, setQuestionSourceMode] = React.useState<"all" | "shuffle">("all")

	React.useEffect(() => {
		if (!quiz) {
			return
		}

		setTitle(quiz.title)
		setDescription(quiz.description || "")
	}, [quiz])

	const existingQuestionIds = React.useMemo(() => new Set(quiz?.questions.map((question) => question.id) || []), [quiz])

	const availableQuestions = React.useMemo(
		() => allQuestions.filter((question) => !existingQuestionIds.has(question.id) && question.status !== "ARCHIVED"),
		[allQuestions, existingQuestionIds]
	)

	const shuffledQuestions = React.useMemo(() => {
		if (!shuffleQuestionsQuery.data?.success) {
			return []
		}

		return shuffleQuestionsQuery.data.data.filter(
			(question) => !existingQuestionIds.has(question.id) && question.status !== "ARCHIVED"
		)
	}, [existingQuestionIds, shuffleQuestionsQuery.data])

	const visibleQuestions = React.useMemo(() => {
		if (questionSourceMode === "shuffle") {
			return shuffledQuestions
		}

		return availableQuestions
	}, [availableQuestions, questionSourceMode, shuffledQuestions])

	const handleUpdateQuiz = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!quizId) {
			return
		}

		const response = await updateQuizMutation.mutateAsync({
			id: quizId,
			data: {
				title: title.trim() || undefined,
				description: description.trim() || undefined,
			},
		})

		if (response.success) {
			toast.success(response.message || "Quiz updated")
			return
		}

		toast.error(response.error.message || "Failed to update quiz")
	}

	const toggleQuestionSelection = (questionId: string) => {
		setSelectedQuestionIds((previous) => {
			if (previous.includes(questionId)) {
				return previous.filter((id) => id !== questionId)
			}

			return [...previous, questionId]
		})
	}

	const handleAddSelectedQuestions = async () => {
		if (!quizId || selectedQuestionIds.length === 0) {
			return
		}

		const response = await addQuestionsMutation.mutateAsync({
			id: quizId,
			data: { questionIds: selectedQuestionIds },
		})

		if (response.success) {
			setSelectedQuestionIds([])
			toast.success(response.message || "Questions added to quiz")
			return
		}

		toast.error(response.error.message || "Failed to add questions")
	}

	const handleRemoveQuestion = async (questionId: string) => {
		if (!quizId) {
			return
		}

		const response = await removeQuestionMutation.mutateAsync({
			quizId,
			questionId,
		})

		if (response.success) {
			toast.success(response.message || "Question removed from quiz")
			return
		}

		toast.error(response.error.message || "Failed to remove question from quiz")
	}

	const handlePublishQuiz = async () => {
		if (!quizId) {
			return
		}

		const response = await publishQuizMutation.mutateAsync(quizId)
		if (response.success) {
			toast.success(response.message || "Quiz published")
			return
		}

		toast.error(response.error.message || "Failed to publish quiz")
	}

	const handleArchiveQuiz = async () => {
		if (!quizId) {
			return
		}

		const response = await archiveQuizMutation.mutateAsync(quizId)
		if (response.success) {
			toast.success(response.message || "Quiz archived")
			return
		}

		toast.error(response.error.message || "Failed to archive quiz")
	}

	const handleShuffleQuestions = () => {
		const count = Number.parseInt(shuffleCount, 10)
		if (!Number.isFinite(count) || count <= 0) {
			toast.error("Shuffle count must be greater than 0")
			return
		}

		const tags = shuffleTags
			.split(",")
			.map((tag) => tag.trim())
			.filter(Boolean)

		setShuffleQuery({
			count,
			difficulty: shuffleDifficulty || undefined,
			tags: tags.length > 0 ? tags : undefined,
		})
		setQuestionSourceMode("shuffle")
	}

	const showAllQuestions = () => {
		setQuestionSourceMode("all")
	}

	const addShuffledToSelection = () => {
		if (shuffledQuestions.length === 0) {
			return
		}

		setSelectedQuestionIds((previous) => {
			const merged = new Set(previous)
			for (const question of shuffledQuestions) {
				merged.add(question.id)
			}

			return [...merged]
		})
	}

	if (quizQuery.isLoading) {
		return <div className="px-6 py-8">Loading quiz...</div>
	}

	if (quizQuery.isError || !quiz) {
		return (
			<div className="px-6 py-8">
				<p className="text-red-700">Quiz not found or failed to load.</p>
				<Button asChild variant="outline" className="mt-3">
					<Link href="/quiz">Back to Quiz List</Link>
				</Button>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-[#f9f7f2] px-4 py-8 text-stone-900 sm:px-6">
			<main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
				<section className="rounded-2xl border border-stone-300 bg-white p-6 shadow-lg">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<h1 className="font-(--font-baloo) text-3xl">Quiz Detail</h1>
						<div className="flex flex-wrap items-center gap-2">
							<Button
								type="button"
								variant="secondary"
								className="bg-[#1f7a5a] text-white hover:bg-[#196247]"
								disabled={publishQuizMutation.isPending || quiz.status === "PUBLISHED"}
								onClick={handlePublishQuiz}
							>
								Publish
							</Button>
							<Button
								type="button"
								variant="outline"
								className="border-stone-400"
								disabled={archiveQuizMutation.isPending || quiz.status === "ARCHIVED"}
								onClick={handleArchiveQuiz}
							>
								Archive
							</Button>
							<Button asChild variant="outline" className="border-stone-300">
								<Link href="/quiz">Back to Quiz List</Link>
							</Button>
						</div>
					</div>

					<p className="mt-2 text-sm text-stone-600">
						ID: <span className="font-mono">{quiz.id}</span>
					</p>

					<form onSubmit={handleUpdateQuiz} className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
						<Input value={title} onChange={(event) => setTitle(event.target.value)} className="border-stone-300" />
						<Input
							value={description}
							onChange={(event) => setDescription(event.target.value)}
							placeholder="Description"
							className="border-stone-300"
						/>
						<Button type="submit" className="bg-stone-900 text-white hover:bg-stone-800" disabled={updateQuizMutation.isPending}>
							{updateQuizMutation.isPending ? "Saving..." : "Edit Quiz"}
						</Button>
					</form>

				</section>

				<section className="grid gap-6 lg:grid-cols-2">
					<article className="rounded-2xl border border-stone-300 bg-white p-6 shadow-md">
						<h2 className="font-(--font-baloo) text-2xl">Quiz Questions</h2>
						<p className="mt-1 text-sm text-stone-600">Questions currently inside this quiz.</p>

						<ul className="mt-4 space-y-3">
							{quiz.questions.length === 0 ? (
								<li className="text-sm text-stone-500">No questions in this quiz yet.</li>
							) : (
								quiz.questions.map((question, index) => (
									<li key={question.id} className="rounded-lg border border-stone-200 bg-stone-50 p-3">
										<div className="flex items-start justify-between gap-2">
											<p className="text-xs text-stone-500">Question {index + 1}</p>
											<Button
												type="button"
												variant="outline"
												size="sm"
												className="border-red-300 text-red-700 hover:bg-red-50"
												disabled={removeQuestionMutation.isPending}
												onClick={() => handleRemoveQuestion(question.id)}
											>
												Remove
											</Button>
										</div>
										<p className="mt-1 text-sm font-medium text-stone-800">{question.content}</p>
										<p className="mt-2 text-xs text-stone-500">Difficulty: {question.difficulty}</p>
									</li>
								))
							)}
						</ul>
					</article>

					<article className="rounded-2xl border border-stone-300 bg-white p-6 shadow-md">
						<h2 className="font-(--font-baloo) text-2xl">Add Question to Quiz</h2>
						<p className="mt-1 text-sm text-stone-600">Select existing questions or use shuffle by filters for quick assignment.</p>

						<div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-3">
							<p className="text-sm font-medium text-stone-700">Shuffle questions by filters</p>
							<div className="mt-2 grid gap-2 md:grid-cols-2">
								<Input
									value={shuffleCount}
									onChange={(event) => setShuffleCount(event.target.value)}
									placeholder="Count"
									className="border-stone-300 bg-white"
								/>
								<select
									value={shuffleDifficulty}
									onChange={(event) => setShuffleDifficulty(event.target.value as "" | Difficulty)}
									className="h-9 rounded-md border border-stone-300 bg-white px-3 text-sm"
								>
									<option value="">All difficulty</option>
									<option value="EASY">EASY</option>
									<option value="MEDIUM">MEDIUM</option>
									<option value="HARD">HARD</option>
								</select>
							</div>
							<Input
								value={shuffleTags}
								onChange={(event) => setShuffleTags(event.target.value)}
								placeholder="Tags (comma-separated), e.g. math, algebra"
								className="mt-2 border-stone-300 bg-white"
							/>
							<div className="mt-2 flex flex-wrap gap-2">
								<Button
									type="button"
									onClick={handleShuffleQuestions}
									className="bg-stone-900 text-white hover:bg-stone-800"
								>
									Get shuffled questions
								</Button>
								<Button
									type="button"
									variant="outline"
									className="border-stone-300"
									onClick={addShuffledToSelection}
									disabled={shuffledQuestions.length === 0}
								>
									Select all shuffled ({shuffledQuestions.length})
								</Button>
							</div>
							{shuffleQuestionsQuery.isFetching ? (
								<p className="mt-2 text-xs text-stone-500">Loading shuffled questions...</p>
							) : null}
						</div>

						<div className="mt-4 space-y-2">
							{questionsQuery.isLoading ? <p className="text-sm text-stone-500">Loading questions...</p> : null}
							{questionsQuery.isError ? <p className="text-sm text-red-700">Failed to load questions.</p> : null}
							{questionSourceMode === "shuffle" ? (
								<div className="flex items-center justify-between rounded-md border border-stone-200 bg-white px-3 py-2 text-xs text-stone-600">
									<span>Showing shuffled results only ({shuffledQuestions.length})</span>
									<Button type="button" variant="outline" size="xs" className="border-stone-300" onClick={showAllQuestions}>
										Back to all questions
									</Button>
								</div>
							) : null}

							{!questionsQuery.isLoading && !questionsQuery.isError && visibleQuestions.length === 0 ? (
								<p className="text-sm text-stone-500">No available questions to add.</p>
							) : (
								visibleQuestions.map((question) => {
									const checked = selectedQuestionIds.includes(question.id)

									return (
										<label
											key={question.id}
											className="flex cursor-pointer items-start gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3"
										>
											<input
												type="checkbox"
												className="mt-1"
												checked={checked}
												onChange={() => toggleQuestionSelection(question.id)}
											/>
											<span className="text-sm text-stone-800">{question.content}</span>
										</label>
									)
								})
							)}
						</div>

						<div className="mt-4 flex items-center gap-3">
							<Button
								type="button"
								onClick={handleAddSelectedQuestions}
								disabled={selectedQuestionIds.length === 0 || addQuestionsMutation.isPending}
								className="bg-[#274c77] text-white hover:bg-[#1f3d61]"
							>
								{addQuestionsMutation.isPending ? "Adding..." : `Add Selected (${selectedQuestionIds.length})`}
							</Button>
						</div>
					</article>
				</section>
			</main>
		</div>
	)
}
