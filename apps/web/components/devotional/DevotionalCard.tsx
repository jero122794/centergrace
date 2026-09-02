// apps/web/components/devotional/DevotionalCard.tsx
import { Users } from 'lucide-react';
import { TipTapRenderer } from '@/components/editor/TipTapRenderer';
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
 * Daily page of the journal: ribbon, verse, and a quiet call to participate.
 */
export const DevotionalCard = ({ title, verse, dateLabel, content, youtubeId, participants, action }: Props) => (
  <article className="sheet--ribbon">
    <p className="text-[11px] uppercase tracking-[0.2em] text-gold-d">{dateLabel}</p>
    <h2 className="mt-3 font-display text-[1.85rem] leading-tight text-dark">{title}</h2>
    {verse ? <blockquote className="verse-mark mt-5 max-w-2xl">{verse}</blockquote> : null}
    {youtubeId ? (
      <div className="mt-6 overflow-hidden" style={{ borderRadius: '18px 40px 16px 28px' }}>
        <VideoPlayer youtubeId={youtubeId} title={title} />
      </div>
    ) : null}
    {content ? (
      <div className="mt-6">
        <TipTapRenderer content={content} />
      </div>
    ) : null}
    <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
      {typeof participants === 'number' ? (
        <p className="inline-flex items-center gap-1.5 text-xs text-muted">
          <Users className="h-3.5 w-3.5" />
          {participants} personas han participado hoy
        </p>
      ) : (
        <span />
      )}
      {action}
    </div>
  </article>
);
