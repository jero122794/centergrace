// apps/web/components/courses/LessonView.tsx
import { Check } from 'lucide-react';
import { VideoPlayer } from '@/components/courses/VideoPlayer';
import { TipTapRenderer } from '@/components/editor/TipTapRenderer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  youtubeId?: string | null;
  bodyContent: unknown;
  hasAssignment?: boolean;
  assignmentDescription?: string | null;
  assignmentSlot?: ReactNode;
  completed?: boolean;
  completing?: boolean;
  onComplete: () => void;
}

/**
 * Lesson reading layout: optional video, prose, assignment and complete CTA.
 */
export const LessonView = ({
  title,
  youtubeId,
  bodyContent,
  hasAssignment,
  assignmentDescription,
  assignmentSlot,
  completed,
  completing,
  onComplete,
}: Props) => (
  <article className="space-y-8">
    {youtubeId ? (
      <div className="mb-8">
        <VideoPlayer youtubeId={youtubeId} title={title} />
        <h1 className="mt-8 font-display text-h2 text-dark">{title}</h1>
        <div className="mt-4 px-0 lg:px-2">
          <TipTapRenderer content={bodyContent} />
        </div>
      </div>
    ) : (
      <div>
        <div className="rounded-2xl bg-surface p-8 md:p-10">
          <h1 className="font-display text-h1 text-dark">{title}</h1>
        </div>
        <div className="mt-6">
          <TipTapRenderer content={bodyContent} />
        </div>
      </div>
    )}
    {hasAssignment ? (
      <Card variant="accent" className="mt-8 bg-surface">
        <span className="inline-flex rounded-full bg-accent px-3 py-0.5 text-[11px] font-semibold uppercase text-white">
          Asignación
        </span>
        <p className="mt-3 text-sm text-dark">{assignmentDescription}</p>
        {assignmentSlot}
      </Card>
    ) : null}
    <Button className={`mt-10 w-full ${completed ? 'bg-success-d hover:bg-success-d' : ''}`} onClick={onComplete} disabled={completed || completing}>
      {completed ? (
        <>
          <Check className="h-4 w-4" /> Completada
        </>
      ) : (
        'Marcar como completada'
      )}
    </Button>
  </article>
);
