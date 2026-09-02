// apps/web/components/editor/TipTapRenderer.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface Props {
  content: unknown;
}

export const TipTapRenderer = ({ content }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: (content as object) ?? { type: 'doc', content: [{ type: 'paragraph' }] },
    editable: false,
    immediatelyRender: false,
  });

  if (!editor) {
    return <p className="text-sm text-slate-500">Cargando contenido…</p>;
  }

  return (
    <div className="prose max-w-none text-ink">
      <EditorContent editor={editor} />
    </div>
  );
};
