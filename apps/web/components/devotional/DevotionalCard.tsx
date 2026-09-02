// apps/web/components/devotional/DevotionalCard.tsx
import { Users } from 'lucide-react';
import { TipTapRenderer } from '@/components/editor/TipTapRenderer';
import { Card } from '@/components/ui/Card';
import { VideoPlayer } from '@/components/courses/VideoPlayer';
import type { ReactNode } from 'react';

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
 * Featured daily-devotional presentation card.
 */
export const DevotionalCard = ({ title, verse, dateLabel, content, youtubeId, participants, action }: Props) => (
  <Card variant="devotional">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{dateLabel}</p>
    <h2 className="mt-2 font-display text-h2 font-bold text-dark">{title}</h2>
    {verse ? (
      <blockquote className="mt-4 border-l-4 border-gold pl-4 font-display text-[17px] italic text-muted">{verse}</blockquote>
    ) : null}
    {youtubeId ? <div className="mt-5"><VideoPlayer youtubeId={youtubeId} title={title} /></div> : null}
    {content ? (
      <div className="mt-5">
        <TipTapRenderer content={content} />
      </div>
    ) : null}
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
      {typeof participants === 'number' ? (
        <p className="inline-flex items-center gap-1 text-xs text-muted">
          <Users className="h-3.5 w-3.5" />
          {participants} personas han participado hoy
        </p>
      ) : (
        <span />
      )}
      {action}
    </div>
  </Card>
);
