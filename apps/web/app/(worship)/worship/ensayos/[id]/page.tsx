// apps/web/app/(worship)/worship/ensayos/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDateTimeBogota } from '@/lib/formatters';
import { SetlistBuilder } from '@/components/worship/SetlistBuilder';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { Alert } from '@/components/ui/Alert';
import stack from '@/components/ui/PageStack.module.css';

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
    return <Skeleton lines={3} />;
  }
  if (query.isError || !query.data) {
    return <Alert>No se pudo cargar el ensayo.</Alert>;
  }

  return (
    <div className={stack.tight}>
      <PageHeader kicker="Alabanza" title="Ensayo" description={formatDateTimeBogota(query.data.date)} />
      {query.data.location ? <p className={stack.muted}>{query.data.location}</p> : null}
      <SetlistBuilder rehearsalId={query.data.id} songs={query.data.songs} />
    </div>
  );
};

export default RehearsalDetailPage;
