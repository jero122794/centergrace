// apps/web/components/devotional/ParticipationForm.tsx
'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import styles from './ParticipationForm.module.css';

export interface ReflectionQuestion {
  id: string;
  text: string;
}

interface ExistingParticipation {
  content: string;
  createdAt: string;
  answers?: Array<{ questionId: string; answer: string }>;
}

interface Props {
  questions: ReflectionQuestion[];
  existing?: ExistingParticipation | null;
  submitting: boolean;
  onSubmit: (values: { content: string; answers: Array<{ questionId: string; answer: string }> }) => void;
}

const withinEditWindow = (createdAt: string): boolean => {
  return Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000;
};

/**
 * Daily reflection form. Feels like a journal: numbered prompts, then a free page.
 */
export const ParticipationForm = ({ questions, existing, submitting, onSubmit }: Props) => {
  const canEdit = existing ? withinEditWindow(existing.createdAt) : true;
  const [editing, setEditing] = useState(!existing);
  const [content, setContent] = useState(existing?.content ?? '');
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const seed: Record<string, string> = {};
    existing?.answers?.forEach((item) => {
      seed[item.questionId] = item.answer;
    });
    return seed;
  });

  if (existing && !editing) {
    return (
      <Card variant="surface" className={styles.saved}>
        <p className={styles.savedTitle}>
          <CheckCircle2 className={styles.savedIcon} aria-hidden />
          Tu reflexión fue compartida
        </p>
        <p className={styles.savedBody}>{existing.content}</p>
        {canEdit ? (
          <Button variant="ghost" onClick={() => setEditing(true)}>
            Editar (hasta 24 h)
          </Button>
        ) : null}
      </Card>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          content,
          answers: questions.map((question) => ({
            questionId: question.id,
            answer: answers[question.id] ?? '',
          })),
        });
      }}
    >
      <div>
        <h2 className={styles.heading}>Tu participación</h2>
        <p className={styles.sub}>Comparte tu reflexión de hoy</p>
      </div>
      {questions.length > 0 ? (
        <div className={styles.prompts}>
          <p className={styles.promptLabel}>Para reflexionar</p>
          {questions.map((question, index) => (
            <Card key={question.id} variant="surface">
              <span className={styles.number}>{index + 1}</span>
              <p className={styles.question}>{question.text}</p>
              <div className={styles.answer}>
                <Textarea
                  label={`Respuesta ${index + 1}`}
                  minChars={30}
                  maxChars={500}
                  value={answers[question.id] ?? ''}
                  onChange={(event) =>
                    setAnswers((current) => ({ ...current, [question.id]: event.target.value }))
                  }
                />
              </div>
            </Card>
          ))}
        </div>
      ) : null}
      <Textarea
        label="Reflexión"
        maxChars={2000}
        placeholder="¿Qué te habló Dios hoy a través de este devocional?"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        required
      />
      <Button type="submit" fullWidth disabled={submitting || content.trim().length < 3}>
        {submitting ? 'Enviando…' : 'Compartir mi reflexión'}
      </Button>
    </form>
  );
};
