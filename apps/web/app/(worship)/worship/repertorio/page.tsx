// apps/web/app/(worship)/worship/repertorio/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';

const RepertoirePage = () => {
  const query = useQuery({
    queryKey: ['songs'],
    queryFn: async () => (await api.get('/api/worship/songs')).data.data,
  });
  return (
    <div className="space-y-4">
      <PageHeader kicker="Alabanza" title="Repertorio" description="Canciones y cifrados del ministerio." />
      {query.isLoading ? <Skeleton lines={3} /> : null}
      {!query.isLoading && query.data?.length === 0 ? (
        <EmptyState icon="music" title="Sin canciones" description="Cuando carguen el repertorio, aparecerá aquí." />
      ) : null}
      {query.data?.map((song: { id: string; title: string; artist?: string; originalKey: string }) => (
        <Link key={song.id} href={`/worship/repertorio/${song.id}`}>
          <Card>
            <p className="font-medium">{song.title}</p>
            <p className="text-sm text-slate-500">
              {song.artist} · {song.originalKey}
            </p>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default RepertoirePage;
