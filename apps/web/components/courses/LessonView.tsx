// apps/web/components/courses/LessonView.tsx
import { Check } from 'lucide-react';
import { VideoPlayer } from '@/components/courses/VideoPlayer';
import { TipTapRenderer } from '@/components/editor/TipTapRenderer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { ReactNode } from 'react';
import styles from './LessonView.module.css';

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
 * With video, the title sits under the player. Without, the title breathes in a surface block.
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
  <article className={styles.article}>
    {youtubeId ? (
      <div>
        <VideoPlayer youtubeId={youtubeId} title={title} />
        <h1 className={styles.videoTitle}>{title}</h1>
        <div className={styles.prose}>
          <TipTapRenderer content={bodyContent} />
        </div>
      </div>
    ) : (
      <div>
        <div className={styles.readingHead}>
          <h1 className={styles.readingTitle}>{title}</h1>
        </div>
        <div className={styles.prose}>
          <TipTapRenderer content={bodyContent} />
        </div>
      </div>
    )}
    {hasAssignment ? (
      <Card variant="accent" className={styles.assignment}>
        <span className={styles.tag}>Asignación</span>
        <p className={styles.assignmentCopy}>{assignmentDescription}</p>
        {assignmentSlot}
      </Card>
    ) : null}
    <Button fullWidth onClick={onComplete} disabled={completed || completing} variant={completed ? 'secondary' : 'primary'}>
      {completed ? (
        <>
          <Check className={styles.doneIcon} /> Completada
        </>
      ) : (
        'Marcar como completada'
      )}
    </Button>
  </article>
);
