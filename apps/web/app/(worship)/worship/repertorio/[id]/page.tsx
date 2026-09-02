// apps/web/app/(worship)/worship/repertorio/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ChordTransposer } from '@/components/worship/ChordTransposer';

const SongPage = () => {
  const params = useParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['songs'],
    queryFn: async () => (await api.get('/api/worship/songs')).data.data,
  });
  const song = query.data?.find((item: { id: string }) => item.id === params.id);
  if (!song) {
    return <p>Cargando canción…</p>;
  }
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-teal">{song.title}</h1>
      <ChordTransposer originalKey={song.originalKey} chords={song.chords} />
    </div>
  );
};

export default SongPage;
