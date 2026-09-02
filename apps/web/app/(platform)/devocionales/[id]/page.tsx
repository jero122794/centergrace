// apps/web/app/(platform)/devocionales/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { api } from '@/lib/api';
import { TipTapRenderer } from '@/components/editor/TipTapRenderer';
import { VideoPlayer } from '@/components/courses/VideoPlayer';
import { ParticipationForm } from '@/components/devotional/ParticipationForm';
import { Skeleton } from '@/components/ui/Skeleton';
import { Alert } from '@/components/ui/Alert';
import { formatLongDateBogota, resolveMediaUrl } from '@/lib/formatters';
import styles from './page.module.css';

interface Question {
  id: string;
  text: string;
}

interface Participation {
  content: string;
  createdAt: string;
  answers?: Array<{ questionId: string; answer: string }>;
}

const youtubeIdFrom = (url?: string | null): string | null => {
  if (!url) {
    return null;
  }
  const match = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return match?.[1] ?? null;
};

const DevotionalDetailPage = () => {
  const params = useParams<{ id: string }>();
  const client = useQueryClient();
  const today = useQuery({
    queryKey: ['devotional-today'],
    queryFn: async () => (await api.get('/api/devotionals/today')).data.data,
  });
  const participate = useMutation({
    mutationFn: async (values: { content: string; answers: Array<{ questionId: string; answer: string }> }) =>
      api.post(`/api/devotionals/${params.id}/participations`, values),
    onSuccess: () => client.invalidateQueries({ queryKey: ['devotional-today'] }),
  });

  if (today.isLoading) {
    return <Skeleton lines={4} />;
  }
  const item = today.data;
  if (!item || item.id !== params.id) {
    return <Alert>No se encontró el devocional.</Alert>;
  }
  const existing = (item.participations as Participation[] | undefined)?.[0];
  const youtubeId = item.mediaType === 'youtube' ? youtubeIdFrom(item.mediaUrl) : null;

  return (
    <article className={styles.article}>
      <header>
        <p className={styles.date}>{formatLongDateBogota(item.date ?? new Date())}</p>
        <h1 className={styles.title}>{item.title}</h1>
      </header>
      {item.verse ? <blockquote className={styles.verse}>{item.verse}</blockquote> : null}
      {item.mediaType === 'audio' && item.mediaUrl ? (
        <div className={styles.audio}>
          <audio className={styles.audioPlayer} controls src={resolveMediaUrl(item.mediaUrl)}>
            Tu navegador no reproduce audio.
          </audio>
        </div>
      ) : null}
      {youtubeId ? <VideoPlayer youtubeId={youtubeId} title={item.title} /> : null}
      <TipTapRenderer content={item.content} />
      <p className={styles.people}>
        <Users className={styles.icon} aria-hidden />
        {item._count?.participations ?? item.participations?.length ?? 0} personas han compartido su reflexión hoy
      </p>
      <ParticipationForm
        key={existing?.createdAt ?? 'new'}
        questions={(item.questions as Question[]) ?? []}
        existing={existing}
        submitting={participate.isPending}
        onSubmit={(values) => participate.mutate(values)}
      />
    </article>
  );
};

export default DevotionalDetailPage;
