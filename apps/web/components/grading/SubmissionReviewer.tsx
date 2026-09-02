// apps/web/components/grading/SubmissionReviewer.tsx
'use client';

import { Download } from 'lucide-react';
import { GradeBadge } from '@/components/grading/GradeBadge';
import { GradeForm } from '@/components/grading/GradeForm';
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

/**
 * Side-by-side student work and grading form.
 */
export const SubmissionReviewer = ({ submission, submitting, onGrade }: Props) => (
  <div className="grid gap-6 lg:grid-cols-2">
    <div className="max-h-[70vh] overflow-y-auto rounded-xl bg-surface p-6">
      <p className="font-semibold text-dark">{submission.user.name}</p>
      <p className="text-sm text-muted">{submission.lesson.title}</p>
      <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-dark">{submission.content}</p>
      {submission.fileUrl ? (
        <a
          className="mt-4 inline-flex items-center gap-2 rounded-pill border-[1.5px] border-primary-d bg-surface px-6 py-2.5 text-sm font-semibold text-accent"
          href={resolveMediaUrl(submission.fileUrl)}
          target="_blank"
          rel="noreferrer"
        >
          <Download className="h-4 w-4" />
          Descargar adjunto
        </a>
      ) : null}
    </div>
    <div className="lg:sticky lg:top-24">
      <div className="mb-4 flex justify-center">
        <GradeBadge score={submission.grade?.score ?? null} status={submission.status} large />
      </div>
      <GradeForm
        initialScore={submission.grade?.score}
        initialFeedback={submission.grade?.feedback ?? ''}
        submitting={submitting}
        onSubmit={onGrade}
      />
    </div>
  </div>
);
