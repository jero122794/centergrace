// apps/web/components/grading/GradeForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { GradeBadge } from '@/components/grading/GradeBadge';
import styles from './GradeForm.module.css';

interface Props {
  initialScore?: number;
  initialFeedback?: string;
  submitting: boolean;
  onSubmit: (values: { score: number; feedback: string }) => void;
}

/**
 * Score slider and written feedback for a submission.
 * The badge flips bands as the slider moves; the large number stays in lockstep.
 */
export const GradeForm = ({ initialScore, initialFeedback, submitting, onSubmit }: Props) => {
  const [score, setScore] = useState(initialScore ?? 0);
  const [feedback, setFeedback] = useState(initialFeedback ?? '');
  const editing = typeof initialScore === 'number';

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ score, feedback });
      }}
    >
      {editing ? <p className={styles.hint}>Editando calificación anterior</p> : null}
      <div className={styles.hero}>
        <GradeBadge score={score} status="GRADED" large />
        <p className={styles.score}>{score}</p>
        <input
          aria-label="Puntaje"
          type="range"
          min={0}
          max={100}
          value={score}
          onChange={(event) => setScore(Number(event.target.value))}
          className={styles.slider}
        />
      </div>
      <label>
        <span className={styles.feedbackLabel}>Retroalimentación al estudiante</span>
        <textarea
          className={styles.feedback}
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
        />
        <span className={styles.count}>{feedback.length} caracteres</span>
      </label>
      <Button type="submit" fullWidth disabled={submitting || score <= 0}>
        {submitting ? 'Guardando…' : 'Calificar'}
      </Button>
    </form>
  );
};
