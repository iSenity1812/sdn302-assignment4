"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetAllQuizzes } from "@/features/quiz/hooks/get-all-quiz.hook"
import { useExamSession } from "../hooks/use-exam-session"

export function ExamPageView() {
  const quizzesQuery = useGetAllQuizzes()
  const {
    activeExam,
    currentQuestion,
    summary,
    startExam,
    backToCatalog,
    chooseAnswer,
    nextQuestion,
    finishExam,
    retryExam,
  } = useExamSession()

  const quizzes = React.useMemo(() => {
    if (!quizzesQuery.data?.success) {
      return []
    }

    return quizzesQuery.data.data.filter((quiz) => quiz.status === "PUBLISHED")
  }, [quizzesQuery.data])

  const selectedAnswer = currentQuestion ? activeExam.answers[currentQuestion.id] : undefined
  const isLastQuestion =
    activeExam.stage === "attempt" &&
    activeExam.currentIndex === activeExam.quiz.questions.length - 1

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#fdf2f8] via-[#f0f9ff] to-[#f0fdf4] px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{ duration: 16, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute -left-12 top-8 size-80 rounded-full bg-pink-300/40 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -45, 0],
            y: [0, 35, 0],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute -right-16 bottom-4 size-96 rounded-full bg-sky-300/35 blur-3xl"
        />
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
      </div>

      <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="rounded-3xl border border-white/40 bg-white/35 p-6 shadow-xl backdrop-blur-xl">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Exam Center</h1>
          <p className="mt-2 text-sm text-slate-600">
            Attend published quizzes and get your score instantly. Score is calculated on your device.
          </p>
        </header>

        {activeExam.stage === "catalog" && (
          <section className="grid gap-4 md:grid-cols-2">
            {quizzesQuery.isLoading && (
              <Card className="border-white/40 bg-white/40 backdrop-blur-xl md:col-span-2">
                <CardHeader>
                  <CardTitle>Loading quizzes...</CardTitle>
                </CardHeader>
              </Card>
            )}

            {quizzesQuery.isError && (
              <Card className="border-red-200/70 bg-white/55 backdrop-blur-xl md:col-span-2">
                <CardHeader>
                  <CardTitle>Failed to load quizzes</CardTitle>
                  <CardDescription>Please refresh this page and try again.</CardDescription>
                </CardHeader>
              </Card>
            )}

            {!quizzesQuery.isLoading && !quizzesQuery.isError && quizzes.length === 0 && (
              <Card className="border-white/40 bg-white/40 backdrop-blur-xl md:col-span-2">
                <CardHeader>
                  <CardTitle>No published quiz yet</CardTitle>
                  <CardDescription>An admin needs to publish quizzes first.</CardDescription>
                </CardHeader>
              </Card>
            )}

            {quizzes.map((quiz) => (
              <Card
                key={quiz.id}
                className="border-white/50 bg-white/45 shadow-lg backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-2xl"
              >
                <CardHeader>
                  <CardTitle className="text-slate-800">{quiz.title}</CardTitle>
                  <CardDescription className="text-slate-600">
                    {quiz.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 text-sm text-slate-600">
                  <p>{quiz.questions.length} questions</p>
                  <p>Status: {quiz.status}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="bg-slate-800 text-white hover:bg-slate-700"
                    onClick={() => startExam(quiz)}
                    disabled={quiz.questions.length === 0}
                  >
                    Attend Quiz
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </section>
        )}

        {activeExam.stage === "attempt" && currentQuestion && (
          <Card className="border-white/50 bg-white/50 shadow-2xl backdrop-blur-2xl">
            <CardHeader>
              <CardTitle className="text-slate-800">{activeExam.quiz.title}</CardTitle>
              <CardDescription className="text-slate-600">
                Question {activeExam.currentIndex + 1} of {activeExam.quiz.questions.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-slate-800">{currentQuestion.content}</h2>
              <div className="flex flex-col gap-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option
                  return (
                    <Button
                      key={option}
                      variant={isSelected ? "default" : "outline"}
                      className={
                        isSelected
                          ? "justify-start bg-slate-800 text-white hover:bg-slate-700"
                          : "justify-start border-white/60 bg-white/70 text-slate-700 hover:bg-white"
                      }
                      onClick={() => chooseAnswer(currentQuestion.id, option)}
                    >
                      {option}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3">
              <Button variant="outline" className="border-white/70 bg-white/60" onClick={backToCatalog}>
                Exit
              </Button>
              {isLastQuestion ? (
                <Button
                  className="bg-slate-800 text-white hover:bg-slate-700"
                  onClick={finishExam}
                  disabled={!selectedAnswer}
                >
                  Finish Quiz
                </Button>
              ) : (
                <Button
                  className="bg-slate-800 text-white hover:bg-slate-700"
                  onClick={nextQuestion}
                  disabled={!selectedAnswer}
                >
                  Next Question
                </Button>
              )}
            </CardFooter>
          </Card>
        )}

        {activeExam.stage === "result" && (
          <Card className="border-white/55 bg-white/55 shadow-2xl backdrop-blur-2xl">
            <CardHeader>
              <CardTitle className="text-slate-800">{activeExam.quiz.title} Result</CardTitle>
              <CardDescription className="text-slate-600">Client-side computed score</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="text-4xl font-bold text-slate-800">
                {summary.score} / {summary.total}
              </p>
              <p className="text-slate-600">Accuracy: {summary.percent}%</p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3">
              <Button variant="outline" className="border-white/70 bg-white/60" onClick={backToCatalog}>
                Back to Quiz List
              </Button>
              <Button className="bg-slate-800 text-white hover:bg-slate-700" onClick={retryExam}>
                Retry Quiz
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  )
}
