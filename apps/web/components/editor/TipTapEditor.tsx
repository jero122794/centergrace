// apps/web/components/editor/TipTapEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface Props {
  value: unknown;
  onChange: (value: unknown) => void;
}

export const TipTapEditor = ({ value, onChange }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: (value as object) ?? { type: 'doc', content: [{ type: 'paragraph' }] },
    immediatelyRender: false,
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getJSON());
    },
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
      <EditorContent editor={editor} />
    </div>
  );
};
