// apps/web/components/editor/TipTapEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface Props {
  value: unknown;
  onChange: (value: unknown) => void;
  placeholder?: string;
}

export const TipTapEditor = ({ value, onChange, placeholder }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: (value as object) ?? { type: 'doc', content: [{ type: 'paragraph' }] },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap min-h-[160px] focus:outline-none',
        'data-placeholder': placeholder ?? '',
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getJSON());
    },
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  if (!editor) {
    return <div className="rounded-xl border border-slate-200 bg-white px-3 py-8 text-sm text-slate-500">Cargando editor…</div>;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap gap-1 border-b border-slate-100 px-2 py-2">
        <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          N
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          I
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Lista
        </ToolbarButton>
      </div>
      <div className="px-3 py-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

interface ToolbarButtonProps {
  active: boolean;
  onClick: () => void;
  children: string;
}

const ToolbarButton = ({ active, onClick, children }: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-lg px-2 py-1 text-xs font-semibold ${active ? 'bg-teal text-white' : 'text-ink hover:bg-cream'}`}
  >
    {children}
  </button>
);
