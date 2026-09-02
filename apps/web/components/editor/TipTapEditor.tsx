// apps/web/components/editor/TipTapEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Heading2, Italic, List } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Skeleton } from '@/components/ui/Skeleton';

interface Props {
  value: unknown;
  onChange: (value: unknown) => void;
  placeholder?: string;
}

/**
 * Rich-text editor with a compact formatting toolbar.
 */
export const TipTapEditor = ({ value, onChange, placeholder }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: (value as object) ?? { type: 'doc', content: [{ type: 'paragraph' }] },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap px-6 py-5 text-[15px] leading-relaxed focus:outline-none',
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
    return <Skeleton className="h-48" />;
  }

  return (
    <div className="overflow-hidden rounded-xl border-[1.5px] border-border bg-paper">
      <div className="flex gap-1 overflow-x-auto border-b border-border bg-surface px-3 py-2">
        <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} label="Negrita">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} label="Cursiva">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <span className="mx-1.5 h-5 w-px self-center bg-border" />
        <ToolbarButton
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          label="Título"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label="Lista"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

interface ToolbarButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  label: string;
}

const ToolbarButton = ({ active, onClick, children, label }: ToolbarButtonProps) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className={cn(
      'inline-flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-paper hover:text-accent',
      active && 'bg-primary/20 text-accent',
    )}
  >
    {children}
  </button>
);
