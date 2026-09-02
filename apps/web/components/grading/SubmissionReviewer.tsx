// apps/web/components/grading/SubmissionReviewer.tsx
'use client';

import { Download } from 'lucide-react';
import { GradeBadge } from '@/components/grading/GradeBadge';
import { GradeForm } from '@/components/grading/GradeForm';
import { resolveMediaUrl } from '@/lib/formatters';
import styles from './SubmissionReviewer.module.css';

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
 * Desktop: two columns. Mobile: work first, grade sheet sticky at the bottom.
 */
export const SubmissionReviewer = ({ submission, submitting, onGrade }: Props) => (
  <div className={styles.split}>
    <div className={styles.work}>
      <p className={styles.name}>{submission.user.name}</p>
      <p className={styles.lesson}>{submission.lesson.title}</p>
      <p className={styles.content}>{submission.content}</p>
      {submission.fileUrl ? (
        <a
          className={styles.file}
          href={resolveMediaUrl(submission.fileUrl)}
          target="_blank"
          rel="noreferrer"
        >
          <Download className={styles.fileIcon} />
          Descargar adjunto
        </a>
      ) : null}
    </div>
    <div className={styles.grade}>
      <div className={styles.badgeRow}>
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
