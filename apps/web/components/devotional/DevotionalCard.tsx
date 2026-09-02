// apps/web/components/devotional/DevotionalCard.tsx
import { Users } from 'lucide-react';
import { TipTapRenderer } from '@/components/editor/TipTapRenderer';
import { VideoPlayer } from '@/components/courses/VideoPlayer';
import { Card } from '@/components/ui/Card';
import type { ReactNode } from 'react';
import styles from './DevotionalCard.module.css';

interface Props {
  title: string;
  verse?: string | null;
  dateLabel: string;
  content?: unknown;
  youtubeId?: string | null;
  participants?: number;
  action?: ReactNode;
}

/**
 * Daily page of the journal. The verse reveals after the title — as if being uncovered.
 */
export const DevotionalCard = ({ title, verse, dateLabel, content, youtubeId, participants, action }: Props) => (
  <Card variant="devotional">
    <p className={styles.kicker}>{dateLabel}</p>
    <h2 className={styles.title}>{title}</h2>
    {verse ? <blockquote className={styles.verse}>{verse}</blockquote> : null}
    {youtubeId ? (
      <div className={styles.media}>
        <VideoPlayer youtubeId={youtubeId} title={title} />
      </div>
    ) : null}
    {content ? (
      <div className={styles.body}>
        <TipTapRenderer content={content} />
      </div>
    ) : null}
    <div className={styles.footer}>
      {typeof participants === 'number' ? (
        <p className={styles.people}>
          <Users className={styles.peopleIcon} />
          {participants} personas han participado hoy
        </p>
      ) : (
        <span />
      )}
      {action}
    </div>
  </Card>
);
