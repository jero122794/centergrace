// apps/web/components/worship/SetlistBuilder.tsx
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import styles from './SetlistBuilder.module.css';

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
    <div className={styles.wrap}>
      <h2 className={styles.title}>Setlist</h2>
      {songs.length === 0 ? <p className={styles.hint}>Aún no hay canciones en este ensayo.</p> : null}
      <ol className={styles.list}>
        {songs.map((item, index) => (
          <li key={item.songId}>
            <Card>
              <div className={styles.row}>
                <div>
                  <p>
                    {index + 1}. {item.song.title}
                  </p>
                  <p className={styles.meta}>Tono: {item.key}</p>
                </div>
                <div className={styles.actions}>
                  <Badge tone={item.isReady ? 'teal' : 'gold'}>{item.isReady ? 'Lista' : 'Pendiente'}</Badge>
                  <Button variant="secondary" onClick={() => toggle.mutate(item)}>
                    {item.isReady ? 'Marcar pendiente' : 'Marcar lista'}
                  </Button>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ol>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          if (songId) {
            add.mutate();
          }
        }}
      >
        <label className={styles.label}>
          Canción del repertorio
          <select
            className={styles.control}
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
        <label className={styles.label}>
          Tono
          <input
            className={styles.control}
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
