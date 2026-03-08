"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

type QuestionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function QuestionDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: QuestionDialogProps) {
  React.useEffect(() => {
    if (!open) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-(--font-baloo) text-2xl text-stone-900">{title}</h2>
            {description ? <p className="mt-1 text-sm text-stone-600">{description}</p> : null}
          </div>
          <Button type="button" variant="outline" className="border-stone-300" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>

        <div>{children}</div>

        {footer ? <div className="mt-4">{footer}</div> : null}
      </div>
    </div>
  );
}
