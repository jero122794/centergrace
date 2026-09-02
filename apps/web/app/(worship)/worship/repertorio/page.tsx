// apps/web/app/(worship)/worship/repertorio/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { SongCard } from '@/components/worship/SongCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';

const RepertoirePage = () => {
  const [search, setSearch] = useState('');
  const query = useQuery({
    queryKey: ['songs'],
    queryFn: async () =>
      (await api.get('/api/worship/songs')).data.data as Array<{
        id: string;
        title: string;
        artist?: string;
        originalKey: string;
        tags?: string[];
      }>,
  });
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (query.data ?? []).filter(
      (song) => !term || song.title.toLowerCase().includes(term) || song.originalKey.toLowerCase().includes(term),
    );
  }, [query.data, search]);

  return (
    <div className="space-y-4">
      <PageHeader kicker="Alabanza" title="Repertorio" description="Canciones y cifrados del ministerio." />
      <Input label="Buscar" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Título o tonalidad" />
      {query.isLoading ? <Skeleton lines={3} /> : null}
      {!query.isLoading && filtered.length === 0 ? (
        <EmptyState title="Sin canciones" description="Cuando carguen el repertorio, aparecerá aquí." />
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((song) => (
          <SongCard key={song.id} {...song} />
        ))}
      </div>
    </div>
  );
};

export default RepertoirePage;
