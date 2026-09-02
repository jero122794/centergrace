// apps/web/components/editor/TipTapEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Heading2, Italic, List } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { cx } from '@/lib/cn';
import { Skeleton } from '@/components/ui/Skeleton';
import styles from './TipTapEditor.module.css';

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
        class: 'tiptap',
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
    return <Skeleton />;
  }

  return (
    <div className={styles.shell}>
      <div className={styles.toolbar}>
        <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} label="Negrita">
          <Bold className={styles.icon} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} label="Cursiva">
          <Italic className={styles.icon} />
        </ToolbarButton>
        <span className={styles.rule} />
        <ToolbarButton
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          label="Título"
        >
          <Heading2 className={styles.icon} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label="Lista"
        >
          <List className={styles.icon} />
        </ToolbarButton>
      </div>
      <div className={styles.body}>
        <EditorContent editor={editor} />
      </div>
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
    className={cx(styles.tool, active && styles.active)}
  >
    {children}
  </button>
);
