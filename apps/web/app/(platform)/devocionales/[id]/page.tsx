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
    <article className="mx-auto max-w-[720px] space-y-8 px-0 md:px-6">
      <header>
        <p className="text-[13px] text-muted">{formatLongDateBogota(item.date ?? new Date())}</p>
        <h1 className="mt-2 font-display text-h1 leading-[1.15] text-dark">{item.title}</h1>
      </header>
      {item.verse ? (
        <blockquote className="rounded-r-xl border-l-[5px] border-gold bg-warm px-6 py-5 font-display text-xl italic text-muted">
          {item.verse}
        </blockquote>
      ) : null}
      {item.mediaType === 'audio' && item.mediaUrl ? (
        <div className="rounded-xl border border-primary p-4">
          <audio className="w-full" controls src={resolveMediaUrl(item.mediaUrl)}>
            Tu navegador no reproduce audio.
          </audio>
        </div>
      ) : null}
      {youtubeId ? <VideoPlayer youtubeId={youtubeId} title={item.title} /> : null}
      <TipTapRenderer content={item.content} />
      <p className="inline-flex items-center gap-1 text-sm text-muted">
        <Users className="h-4 w-4" aria-hidden />
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
