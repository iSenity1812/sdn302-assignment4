"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Difficulty, QuestionDto } from "@/features/question/types/question.dto";
import { QuestionCreateDto } from "@/features/question/types/question-create.dto";
import { QuestionUpdateDto } from "@/features/question/types/question-update.dto";
import { QuestionDialog } from "./question-dialog";

export type QuestionFormPayload = {
  create: QuestionCreateDto;
  update: QuestionUpdateDto;
};

type QuestionFormDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  initialQuestion?: QuestionDto | null;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: QuestionFormPayload) => Promise<void>;
};

const parseOptions = (value: string) =>
  value
    .split("\n")
    .map((option) => option.trim())
    .filter(Boolean);

const parseTags = (value: string) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

export function QuestionFormDialog({
  open,
  mode,
  initialQuestion,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: QuestionFormDialogProps) {
  const [content, setContent] = React.useState("");
  const [optionsText, setOptionsText] = React.useState("");
  const [correctAnswer, setCorrectAnswer] = React.useState("");
  const [difficulty, setDifficulty] = React.useState<Difficulty>("MEDIUM");
  const [tagsText, setTagsText] = React.useState("");
  const [explanation, setExplanation] = React.useState("");
  const [formError, setFormError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit" && initialQuestion) {
      setContent(initialQuestion.content);
      setOptionsText(initialQuestion.options.join("\n"));
      setCorrectAnswer(initialQuestion.correctAnswer);
      setDifficulty(initialQuestion.difficulty);
      setTagsText(initialQuestion.tags.join(", "));
      setExplanation(initialQuestion.explanation || "");
      setFormError(null);
      return;
    }

    setContent("");
    setOptionsText("");
    setCorrectAnswer("");
    setDifficulty("MEDIUM");
    setTagsText("");
    setExplanation("");
    setFormError(null);
  }, [initialQuestion, mode, open]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedOptions = parseOptions(optionsText);
    const parsedTags = parseTags(tagsText);

    if (!content.trim()) {
      setFormError("Question content is required.");
      return;
    }

    if (parsedOptions.length < 2) {
      setFormError("At least 2 options are required.");
      return;
    }

    if (!correctAnswer.trim()) {
      setFormError("Correct answer is required.");
      return;
    }

    if (!parsedOptions.includes(correctAnswer.trim())) {
      setFormError("Correct answer must match one of the options.");
      return;
    }

    const create: QuestionCreateDto = {
      content: content.trim(),
      type: "MULTIPLE_CHOICE",
      options: parsedOptions,
      correctAnswer: correctAnswer.trim(),
      difficulty,
      tags: parsedTags,
      explanation: explanation.trim() || undefined,
    };

    const update: QuestionUpdateDto = {
      content: create.content,
      options: create.options,
      correctAnswer: create.correctAnswer,
      difficulty: create.difficulty,
      tags: create.tags,
      explanation: create.explanation,
    };

    setFormError(null);
    await onSubmit({ create, update });
  };

  return (
    <QuestionDialog
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Create Question" : "Update Question"}
      description="Build multiple-choice questions with options and tags."
    >
      <form onSubmit={submit} className="grid gap-3">
        <label className="grid gap-1 text-sm text-stone-700">
          <span>Question Content</span>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={3}
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500"
            placeholder="Type your question content"
          />
        </label>

        <label className="grid gap-1 text-sm text-stone-700">
          <span>Options (one option per line)</span>
          <textarea
            value={optionsText}
            onChange={(event) => setOptionsText(event.target.value)}
            rows={5}
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500"
            placeholder={"Option A\nOption B\nOption C"}
          />
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-1 text-sm text-stone-700">
            <span>Correct Answer</span>
            <Input value={correctAnswer} onChange={(event) => setCorrectAnswer(event.target.value)} placeholder="Option A" />
          </label>

          <label className="grid gap-1 text-sm text-stone-700">
            <span>Difficulty</span>
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value as Difficulty)}
              className="h-9 rounded-md border border-stone-300 bg-white px-3 text-sm"
            >
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
            </select>
          </label>
        </div>

        <label className="grid gap-1 text-sm text-stone-700">
          <span>Tags (comma-separated)</span>
          <Input value={tagsText} onChange={(event) => setTagsText(event.target.value)} placeholder="math, algebra" />
        </label>

        <label className="grid gap-1 text-sm text-stone-700">
          <span>Explanation (optional)</span>
          <textarea
            value={explanation}
            onChange={(event) => setExplanation(event.target.value)}
            rows={3}
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500"
            placeholder="Explain why the answer is correct"
          />
        </label>

        {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

        <div className="mt-1 flex justify-end gap-2">
          <Button type="button" variant="outline" className="border-stone-300" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" className="bg-stone-900 text-white hover:bg-stone-800" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : mode === "create" ? "Create Question" : "Save Changes"}
          </Button>
        </div>
      </form>
    </QuestionDialog>
  );
}
