// apps/web/components/grading/GradeForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { GradeBadge } from '@/components/grading/GradeBadge';

interface Props {
  initialScore?: number;
  initialFeedback?: string;
  submitting: boolean;
  onSubmit: (values: { score: number; feedback: string }) => void;
}

/**
 * Score slider and written feedback for a submission.
 */
export const GradeForm = ({ initialScore, initialFeedback, submitting, onSubmit }: Props) => {
  const [score, setScore] = useState(initialScore ?? 0);
  const [feedback, setFeedback] = useState(initialFeedback ?? '');
  const editing = typeof initialScore === 'number';

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ score, feedback });
      }}
    >
      {editing ? <p className="text-xs font-medium text-muted">Editando calificación anterior</p> : null}
      <div className="text-center">
        <GradeBadge score={score} status="GRADED" large />
        <p className="mt-3 font-display text-[40px] font-bold text-dark">{score}</p>
        <input
          aria-label="Puntaje"
          type="range"
          min={0}
          max={100}
          value={score}
          onChange={(event) => setScore(Number(event.target.value))}
          className="mt-4 w-full accent-[var(--color-accent)]"
        />
      </div>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-muted">Retroalimentación al estudiante</span>
        <textarea
          className="min-h-[120px] w-full resize-y rounded-[10px] border-[1.5px] border-border bg-paper px-3.5 py-2.5 text-[15px] outline-none focus:border-border-f focus:ring-[3px] focus:ring-primary/30"
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
        />
        <span className="mt-1 block text-right text-[11px] text-hint">{feedback.length} caracteres</span>
      </label>
      <Button type="submit" className="w-full" disabled={submitting || score <= 0}>
        {submitting ? 'Guardando…' : 'Calificar'}
      </Button>
    </form>
  );
};
