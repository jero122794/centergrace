// apps/web/components/devotional/ParticipationForm.tsx
'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';

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
 * Daily reflection form with numbered questions and a main textarea.
 *
 * @example
 * <ParticipationForm questions={[]} submitting={false} onSubmit={send} />
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
      <Card variant="surface" className="bg-success">
        <p className="inline-flex items-center gap-2 font-display text-lg italic text-success-d">
          <CheckCircle2 className="h-5 w-5" aria-hidden />
          Tu reflexión fue compartida
        </p>
        <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-dark">{existing.content}</p>
        {canEdit ? (
          <Button variant="ghost" className="mt-4" onClick={() => setEditing(true)}>
            Editar (hasta 24 h)
          </Button>
        ) : null}
      </Card>
    );
  }

  return (
    <form
      className="space-y-5"
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
        <h2 className="text-base font-semibold text-dark">Tu participación</h2>
        <p className="text-sm text-muted">Comparte tu reflexión de hoy</p>
      </div>
      {questions.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Para reflexionar</p>
          {questions.map((question, index) => (
            <Card key={question.id} variant="surface">
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary-d px-2 text-[11px] font-semibold text-white">
                {index + 1}
              </span>
              <p className="mt-2 text-[15px] font-medium text-dark">{question.text}</p>
              <div className="mt-3">
                <Textarea
                  label={`Respuesta ${index + 1}`}
                  minChars={30}
                  maxChars={500}
                  className="min-h-[80px]"
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
        className="min-h-[120px]"
        maxChars={2000}
        placeholder="¿Qué te habló Dios hoy a través de este devocional?"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        required
      />
      <Button type="submit" className="w-full" disabled={submitting || content.trim().length < 3}>
        {submitting ? 'Enviando…' : 'Compartir mi reflexión'}
      </Button>
    </form>
  );
};
