// apps/web/app/(worship)/worship/repertorio/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { SongCard } from '@/components/worship/SongCard';
import { ChordTransposer } from '@/components/worship/ChordTransposer';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';
import styles from './page.module.css';

interface Song {
  id: string;
  title: string;
  artist?: string;
  originalKey: string;
  tags?: string[];
  chords?: { sections: Array<{ name: string; lines: Array<{ lyrics: string; chords: string[] }> }> };
}

const RepertoirePage = () => {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const query = useQuery({
    queryKey: ['songs'],
    queryFn: async () => (await api.get('/api/worship/songs')).data.data as Song[],
  });
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (query.data ?? []).filter(
      (song) => !term || song.title.toLowerCase().includes(term) || song.originalKey.toLowerCase().includes(term),
    );
  }, [query.data, search]);
  const selected = filtered.find((song) => song.id === selectedId) ?? filtered[0];

  return (
    <div className={styles.page}>
      <PageHeader kicker="Alabanza" title="Repertorio" description="Canciones y cifrados del ministerio." />
      <Input label="Buscar" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Título o tonalidad" />
      {query.isLoading ? <Skeleton lines={3} /> : null}
      {!query.isLoading && filtered.length === 0 ? (
        <EmptyState title="Sin canciones" description="Cuando carguen el repertorio, aparecerá aquí." />
      ) : null}
      <div className={styles.split}>
        <div className={styles.list}>
          {filtered.map((song, index) => (
            <div
              key={song.id}
              onMouseEnter={() => setSelectedId(song.id)}
              onFocus={() => setSelectedId(song.id)}
            >
              <SongCard {...song} selected={selected?.id === song.id} enterDelay={index * 60} />
            </div>
          ))}
        </div>
        {selected?.chords ? (
          <aside className={styles.detail} aria-label="Cifrado">
            <h2 className={styles.detailTitle}>{selected.title}</h2>
            <ChordTransposer originalKey={selected.originalKey} chords={selected.chords} />
          </aside>
        ) : null}
      </div>
    </div>
  );
};

export default RepertoirePage;
