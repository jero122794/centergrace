// apps/web/components/grading/SubmissionReviewer.tsx
'use client';

import { GradeBadge } from '@/components/grading/GradeBadge';
import { GradeForm } from '@/components/grading/GradeForm';
import { Card } from '@/components/ui/Card';
import { TipTapRenderer } from '@/components/editor/TipTapRenderer';
import { resolveMediaUrl } from '@/lib/formatters';

export interface SubmissionForReview {
  id: string;
  content: string;
  fileUrl?: string | null;
  status: string;
  user: { name: string; email: string };
  lesson: { title: string; assignmentDescription?: string | null; bodyContent?: unknown };
  grade?: { score: number; feedback?: string | null } | null;
}

interface Props {
  submission: SubmissionForReview;
  submitting: boolean;
  onGrade: (values: { score: number; feedback: string }) => void;
}

export const SubmissionReviewer = ({ submission, submitting, onGrade }: Props) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className="font-display text-2xl text-teal">{submission.user.name}</h2>
        <p className="text-sm text-slate-500">{submission.lesson.title}</p>
      </div>
      <GradeBadge score={submission.grade?.score ?? null} status={submission.status} />
    </div>
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <p className="mb-2 text-xs uppercase tracking-wide text-teal">Asignación</p>
        <p className="mb-3 text-sm text-slate-600">{submission.lesson.assignmentDescription ?? 'Sin descripción'}</p>
        {submission.lesson.bodyContent ? <TipTapRenderer content={submission.lesson.bodyContent} /> : null}
      </Card>
      <Card>
        <p className="mb-2 text-xs uppercase tracking-wide text-teal">Respuesta del estudiante</p>
        <p className="whitespace-pre-wrap text-sm">{submission.content}</p>
        {submission.fileUrl ? (
          <a className="mt-3 inline-block text-sm text-teal" href={resolveMediaUrl(submission.fileUrl)} target="_blank" rel="noreferrer">
            Ver archivo adjunto
          </a>
        ) : null}
      </Card>
    </div>
    <Card>
      <GradeForm
        initialScore={submission.grade?.score}
        initialFeedback={submission.grade?.feedback ?? ''}
        submitting={submitting}
        onSubmit={onGrade}
      />
    </Card>
  </div>
);
