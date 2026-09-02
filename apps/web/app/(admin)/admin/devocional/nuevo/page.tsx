// apps/web/app/(admin)/admin/devocional/nuevo/page.tsx
'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TipTapEditor } from '@/components/editor/TipTapEditor';
import { extractYoutubeId } from '@/lib/youtube';

interface GroupOption {
  id: string;
  name: string;
}

interface QuestionDraft {
  text: string;
  order: number;
}

const EMPTY_DOC = { type: 'doc', content: [{ type: 'paragraph' }] };

const NewDevotionalPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [verse, setVerse] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState<unknown>(EMPTY_DOC);
  const [questions, setQuestions] = useState<QuestionDraft[]>([{ text: '', order: 1 }]);
  const [mediaType, setMediaType] = useState<'none' | 'audio' | 'youtube'>('none');
  const [mediaUrl, setMediaUrl] = useState('');
  const [groupId, setGroupId] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [error, setError] = useState<string | null>(null);
  const groups = useQuery({
    queryKey: ['groups'],
    queryFn: async () => (await api.get('/api/groups')).data.data as GroupOption[],
  });

  const create = useMutation({
    mutationFn: async () => {
      let resolvedMedia = mediaUrl || undefined;
      if (mediaType === 'audio' && mediaUrl.startsWith('blob:')) {
        throw new Error('Missing uploaded audio');
      }
      if (mediaType === 'youtube' && mediaUrl && !extractYoutubeId(mediaUrl)) {
        throw new Error('Invalid YouTube URL');
      }
      if (mediaType === 'none') {
        resolvedMedia = undefined;
      }
      await api.post('/api/devotionals', {
        title,
        verse: verse || undefined,
        date,
        content,
        status,
        groupId: groupId || undefined,
        mediaType: mediaType === 'none' ? undefined : mediaType,
        mediaUrl: resolvedMedia,
        questions: questions.filter((item) => item.text.trim().length >= 3).map((item, index) => ({
          text: item.text,
          order: index + 1,
        })),
      });
    },
    onSuccess: () => router.push('/devocionales'),
    onError: () => setError('No se pudo crear el devocional. Revisa la fecha y el contenido.'),
  });

  const uploadAudio = async (file: File): Promise<void> => {
    const form = new FormData();
    form.append('file', file);
    const response = await api.post('/api/uploads', form);
    setMediaUrl(response.data.data.url as string);
  };

  return (
    <form
      className="max-w-2xl space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        create.mutate();
      }}
    >
      <h1 className="font-display text-3xl text-teal">Nuevo devocional</h1>
      <Input label="Título" value={title} onChange={(event) => setTitle(event.target.value)} required />
      <Input label="Versículo" value={verse} onChange={(event) => setVerse(event.target.value)} />
      <Input label="Fecha" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
      <div>
        <p className="mb-1 text-sm font-medium">Contenido</p>
        <TipTapEditor value={content} onChange={setContent} />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Preguntas de reflexión</p>
        {questions.map((question, index) => (
          <Input
            key={question.order}
            label={`Pregunta ${index + 1}`}
            value={question.text}
            onChange={(event) =>
              setQuestions((current) =>
                current.map((item, itemIndex) => (itemIndex === index ? { ...item, text: event.target.value } : item)),
              )
            }
          />
        ))}
        <Button
          type="button"
          variant="secondary"
          onClick={() => setQuestions((current) => [...current, { text: '', order: current.length + 1 }])}
        >
          Agregar pregunta
        </Button>
      </div>
      <label className="block text-sm">
        Medio opcional
        <select
          className="mt-1 w-full rounded-xl border border-slate-200 p-2"
          value={mediaType}
          onChange={(event) => {
            setMediaType(event.target.value as 'none' | 'audio' | 'youtube');
            setMediaUrl('');
          }}
        >
          <option value="none">Ninguno</option>
          <option value="youtube">Video de YouTube</option>
          <option value="audio">Audio MP3</option>
        </select>
      </label>
      {mediaType === 'youtube' ? (
        <Input label="URL de YouTube" value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} />
      ) : null}
      {mediaType === 'audio' ? (
        <label className="block space-y-1 text-sm">
          <span className="font-medium">Archivo MP3</span>
          <input
            type="file"
            accept="audio/mpeg,.mp3"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void uploadAudio(file);
              }
            }}
          />
          {mediaUrl ? <p className="text-xs text-teal">Audio listo para publicar</p> : null}
        </label>
      ) : null}
      <label className="block text-sm">
        Grupo (opcional)
        <select className="mt-1 w-full rounded-xl border border-slate-200 p-2" value={groupId} onChange={(event) => setGroupId(event.target.value)}>
          <option value="">Sin asignar</option>
          {groups.data?.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        Estado
        <select
          className="mt-1 w-full rounded-xl border border-slate-200 p-2"
          value={status}
          onChange={(event) => setStatus(event.target.value as 'DRAFT' | 'PUBLISHED')}
        >
          <option value="DRAFT">Borrador</option>
          <option value="PUBLISHED">Publicado</option>
        </select>
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={create.isPending}>
        {create.isPending ? 'Guardando…' : 'Crear devocional'}
      </Button>
    </form>
  );
};

export default NewDevotionalPage;
