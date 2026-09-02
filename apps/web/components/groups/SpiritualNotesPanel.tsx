// apps/web/components/groups/SpiritualNotesPanel.tsx
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { formatDateTimeBogota } from '@/lib/formatters';

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
    <section className="space-y-3">
      <h3 className="font-display text-xl text-teal">Notas espirituales (privadas)</h3>
      {notes.isLoading ? <p className="text-sm text-slate-500">Cargando notas…</p> : null}
      {notes.isError ? <p className="text-sm text-red-600">No se pudieron cargar las notas.</p> : null}
      {!notes.isLoading && notes.data?.length === 0 ? (
        <p className="text-sm text-slate-500">Aún no hay notas para este miembro.</p>
      ) : null}
      <ul className="space-y-2">
        {notes.data?.map((note) => (
          <li key={note.id} className="rounded-xl border border-slate-100 bg-cream p-3 text-sm">
            <p>{note.content}</p>
            <p className="mt-1 text-xs text-slate-500">
              {note.leader?.name ?? 'Líder'} · {formatDateTimeBogota(note.createdAt)}
            </p>
          </li>
        ))}
      </ul>
      <form
        className="space-y-2"
        onSubmit={(event) => {
          event.preventDefault();
          create.mutate();
        }}
      >
        <textarea
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
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
