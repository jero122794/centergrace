// apps/web/components/worship/SetlistBuilder.tsx
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface CatalogSong {
  id: string;
  title: string;
  originalKey: string;
  artist?: string | null;
}

interface SetlistItem {
  songId: string;
  order: number;
  key: string;
  isReady: boolean;
  song: { title: string; originalKey: string };
}

interface Props {
  rehearsalId: string;
  songs: SetlistItem[];
}

export const SetlistBuilder = ({ rehearsalId, songs }: Props) => {
  const client = useQueryClient();
  const [songId, setSongId] = useState('');
  const [key, setKey] = useState('G');
  const catalog = useQuery({
    queryKey: ['songs'],
    queryFn: async () => (await api.get('/api/worship/songs')).data.data as CatalogSong[],
  });
  const toggle = useMutation({
    mutationFn: async (item: SetlistItem) =>
      api.patch(`/api/worship/rehearsals/${rehearsalId}/songs/${item.songId}`, { isReady: !item.isReady }),
    onSuccess: () => client.invalidateQueries({ queryKey: ['rehearsal', rehearsalId] }),
  });
  const add = useMutation({
    mutationFn: async () =>
      api.post(`/api/worship/rehearsals/${rehearsalId}/songs`, {
        songId,
        key,
        order: songs.length + 1,
      }),
    onSuccess: () => {
      setSongId('');
      void client.invalidateQueries({ queryKey: ['rehearsal', rehearsalId] });
    },
  });
  const available = catalog.data?.filter((song) => !songs.some((item) => item.songId === song.id)) ?? [];

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-teal">Setlist</h2>
      {songs.length === 0 ? <p className="text-sm text-slate-500">Aún no hay canciones en este ensayo.</p> : null}
      <ol className="space-y-2">
        {songs.map((item, index) => (
          <li key={item.songId}>
            <Card className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">
                  {index + 1}. {item.song.title}
                </p>
                <p className="text-sm text-slate-500">Tono: {item.key}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={item.isReady ? 'teal' : 'gold'}>{item.isReady ? 'Lista' : 'Pendiente'}</Badge>
                <Button variant="secondary" onClick={() => toggle.mutate(item)}>
                  {item.isReady ? 'Marcar pendiente' : 'Marcar lista'}
                </Button>
              </div>
            </Card>
          </li>
        ))}
      </ol>
      <form
        className="flex flex-col gap-2 md:flex-row md:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          if (songId) {
            add.mutate();
          }
        }}
      >
        <label className="block flex-1 text-sm">
          Canción del repertorio
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 p-2"
            value={songId}
            onChange={(event) => setSongId(event.target.value)}
            required
          >
            <option value="">Selecciona…</option>
            {available.map((song) => (
              <option key={song.id} value={song.id}>
                {song.title} ({song.originalKey})
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Tono
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            required
          />
        </label>
        <Button type="submit" disabled={add.isPending || available.length === 0}>
          Agregar al setlist
        </Button>
      </form>
    </div>
  );
};
