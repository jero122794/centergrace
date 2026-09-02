// apps/web/app/(worship)/worship/repertorio/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

const RepertoirePage = () => {
  const query = useQuery({
    queryKey: ['songs'],
    queryFn: async () => (await api.get('/api/worship/songs')).data.data,
  });
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-teal">Repertorio</h1>
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
