// apps/web/components/courses/LessonEditor.tsx
'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { extractYoutubeId } from '@/lib/youtube';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TipTapEditor } from '@/components/editor/TipTapEditor';
import styles from './LessonEditor.module.css';

interface YoutubePreview {
  youtubeId: string;
  youtubeTitle: string;
  youtubeThumbnail: string;
}

interface Props {
  courseId: string;
  onCreated: () => void;
}

const EMPTY_DOC = { type: 'doc', content: [{ type: 'paragraph' }] };

export const LessonEditor = ({ courseId, onCreated }: Props) => {
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [body, setBody] = useState<unknown>(EMPTY_DOC);
  const [hasAssignment, setHasAssignment] = useState(false);
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [error, setError] = useState<string | null>(null);

  const youtubeId = extractYoutubeId(youtubeUrl);
  const preview = useQuery({
    queryKey: ['oembed', youtubeUrl],
    queryFn: async () => (await api.get<{ data: YoutubePreview }>('/api/courses/oembed', { params: { url: youtubeUrl } })).data.data,
    enabled: Boolean(youtubeId),
    retry: false,
  });

  const create = useMutation({
    mutationFn: async () => {
      const lessons = await api.get(`/api/courses/${courseId}`);
      const count = (lessons.data.data.lessons as Array<unknown> | undefined)?.length ?? 0;
      await api.post(`/api/courses/${courseId}/lessons`, {
        title,
        bodyContent: body,
        youtubeUrl: youtubeUrl || undefined,
        order: count + 1,
        status,
        hasAssignment,
        assignmentDescription: hasAssignment ? assignmentDescription : undefined,
      });
    },
    onSuccess: () => {
      setTitle('');
      setYoutubeUrl('');
      setBody(EMPTY_DOC);
      setHasAssignment(false);
      setAssignmentDescription('');
      setStatus('DRAFT');
      setError(null);
      onCreated();
    },
    onError: () => setError('No se pudo guardar la lección. Revisa el video y el título.'),
  });

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        create.mutate();
      }}
    >
      <Input label="Título de la lección" value={title} onChange={(event) => setTitle(event.target.value)} required />
      <Input
        label="URL de YouTube (opcional)"
        value={youtubeUrl}
        onChange={(event) => setYoutubeUrl(event.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
      />
      {preview.isFetching ? <p className={styles.hint}>Validando video…</p> : null}
      {preview.isError ? <p className={styles.error}>El video de YouTube no se pudo validar.</p> : null}
      {preview.data ? (
        <div className={styles.preview}>
          {preview.data.youtubeThumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview.data.youtubeThumbnail} alt="" className={styles.thumb} />
          ) : null}
          <div>
            <p className={styles.kicker}>Vista previa</p>
            <p className={styles.title}>{preview.data.youtubeTitle}</p>
          </div>
        </div>
      ) : null}
      <div>
        <p className={styles.label}>Contenido</p>
        <TipTapEditor value={body} onChange={setBody} />
      </div>
      <label className={styles.check}>
        <input type="checkbox" checked={hasAssignment} onChange={(event) => setHasAssignment(event.target.checked)} />
        Incluye asignación
      </label>
      {hasAssignment ? (
        <label>
          <span className={styles.label}>Descripción de la asignación</span>
          <textarea
            className={styles.textarea}
            value={assignmentDescription}
            onChange={(event) => setAssignmentDescription(event.target.value)}
            required={hasAssignment}
          />
        </label>
      ) : null}
      <label>
        <span className={styles.label}>Estado</span>
        <select
          className={styles.select}
          value={status}
          onChange={(event) => setStatus(event.target.value as 'DRAFT' | 'PUBLISHED')}
        >
          <option value="DRAFT">Borrador</option>
          <option value="PUBLISHED">Publicada</option>
        </select>
      </label>
      {error ? <p className={styles.error}>{error}</p> : null}
      <Button type="submit" disabled={create.isPending}>
        {create.isPending ? 'Guardando…' : 'Agregar lección'}
      </Button>
    </form>
  );
};
