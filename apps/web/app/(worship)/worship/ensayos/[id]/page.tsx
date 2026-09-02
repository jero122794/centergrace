// apps/web/app/(worship)/worship/ensayos/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDateTimeBogota } from '@/lib/formatters';
import { SetlistBuilder } from '@/components/worship/SetlistBuilder';

interface RehearsalDetail {
  id: string;
  date: string;
  location?: string | null;
  notes?: string | null;
  songs: Array<{
    songId: string;
    order: number;
    key: string;
    isReady: boolean;
    song: { title: string; originalKey: string };
  }>;
}

const RehearsalDetailPage = () => {
  const params = useParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['rehearsal', params.id],
    queryFn: async () => (await api.get(`/api/worship/rehearsals/${params.id}`)).data.data as RehearsalDetail,
  });

  if (query.isLoading) {
    return <p>Cargando ensayo…</p>;
  }
  if (query.isError || !query.data) {
    return <p className="text-red-600">No se pudo cargar el ensayo.</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-teal">Ensayo</h1>
      <p>{formatDateTimeBogota(query.data.date)}</p>
      {query.data.location ? <p className="text-slate-600">{query.data.location}</p> : null}
      <SetlistBuilder rehearsalId={query.data.id} songs={query.data.songs} />
    </div>
  );
};

export default RehearsalDetailPage;
