// apps/web/components/groups/SpiritualNotesPanel.tsx
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { formatDateTimeBogota } from '@/lib/formatters';
import styles from './SpiritualNotesPanel.module.css';

interface Note {
  id: string;
  content: string;
  createdAt: string;
  leader?: { name: string };
}

interface Props {
  userId: string;
  groupId: string;
}

export const SpiritualNotesPanel = ({ userId, groupId }: Props) => {
  const client = useQueryClient();
  const [content, setContent] = useState('');
  const notes = useQuery({
    queryKey: ['spiritual-notes', userId],
    queryFn: async () => (await api.get('/api/spiritual-notes', { params: { userId } })).data.data as Note[],
  });
  const create = useMutation({
    mutationFn: async () => api.post('/api/spiritual-notes', { userId, groupId, content }),
    onSuccess: () => {
      setContent('');
      void client.invalidateQueries({ queryKey: ['spiritual-notes', userId] });
      void client.invalidateQueries({ queryKey: ['follow-up', userId] });
    },
  });

  return (
    <section className={styles.wrap}>
      <h3 className={styles.title}>Notas espirituales (privadas)</h3>
      {notes.isLoading ? <p className={styles.hint}>Cargando notas…</p> : null}
      {notes.isError ? <p className={styles.error}>No se pudieron cargar las notas.</p> : null}
      {!notes.isLoading && notes.data?.length === 0 ? (
        <p className={styles.hint}>Aún no hay notas para este miembro.</p>
      ) : null}
      <ul className={styles.list}>
        {notes.data?.map((note) => (
          <li key={note.id} className={styles.note}>
            <p>{note.content}</p>
            <p className={styles.meta}>
              {note.leader?.name ?? 'Líder'} · {formatDateTimeBogota(note.createdAt)}
            </p>
          </li>
        ))}
      </ul>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          create.mutate();
        }}
      >
        <textarea
          className={styles.textarea}
          placeholder="Observación pastoral confidencial"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
          minLength={3}
        />
        <Button type="submit" disabled={create.isPending}>
          {create.isPending ? 'Guardando…' : 'Agregar nota'}
        </Button>
      </form>
    </section>
  );
};
