// apps/web/components/grading/GradeForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Props {
  initialScore?: number;
  initialFeedback?: string;
  submitting: boolean;
  onSubmit: (values: { score: number; feedback: string }) => void;
}

export const GradeForm = ({ initialScore, initialFeedback, submitting, onSubmit }: Props) => {
  const [score, setScore] = useState(initialScore ?? 0);
  const [feedback, setFeedback] = useState(initialFeedback ?? '');

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ score, feedback });
      }}
    >
      <Input
        label="Puntaje (0-100)"
        type="number"
        min={0}
        max={100}
        value={score}
        onChange={(event) => setScore(Number(event.target.value))}
        required
      />
      <label className="block space-y-1">
        <span className="text-sm font-medium">Retroalimentación</span>
        <textarea
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          rows={4}
        />
      </label>
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Guardando…' : 'Guardar calificación'}
      </Button>
    </form>
  );
};
