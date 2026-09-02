// apps/web/app/(worship)/worship/ensayos/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDateTimeBogota } from '@/lib/formatters';

const RehearsalDetailPage = () => {
  const params = useParams<{ id: string }>();
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ['rehearsals'],
    queryFn: async () => (await api.get('/api/worship/rehearsals')).data.data,
  });
  const rehearsal = query.data?.find((item: { id: string }) => item.id === params.id);
  const ready = useMutation({
    mutationFn: async (songId: string) =>
      api.patch(`/api/worship/rehearsals/${params.id}/songs/${songId}`, { isReady: true }),
    onSuccess: () => client.invalidateQueries({ queryKey: ['rehearsals'] }),
  });

  if (!rehearsal) {
    return <p>Cargando ensayo…</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-teal">Ensayo</h1>
      <p>{formatDateTimeBogota(rehearsal.date)}</p>
      {rehearsal.songs?.map((item: { songId: string; key: string; isReady: boolean; song: { title: string } }) => (
        <Card key={item.songId} className="flex items-center justify-between">
          <p>
            {item.song.title} · {item.key}
          </p>
          {item.isReady ? (
            <span>Lista</span>
          ) : (
            <Button onClick={() => ready.mutate(item.songId)}>Marcar lista</Button>
          )}
        </Card>
      ))}
    </div>
  );
};

export default RehearsalDetailPage;
