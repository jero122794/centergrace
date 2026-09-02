// apps/web/components/editor/TipTapRenderer.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Skeleton } from '@/components/ui/Skeleton';
import { cx } from '@/lib/cn';
import styles from './TipTapRenderer.module.css';

interface Props {
  content: unknown;
}

/**
 * Read-only prose renderer sharing TipTap document JSON.
 */
export const TipTapRenderer = ({ content }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: (content as object) ?? { type: 'doc', content: [{ type: 'paragraph' }] },
    editable: false,
    immediatelyRender: false,
  });

  if (!editor) {
    return <Skeleton />;
  }

  return (
    <div className={cx('prose-grace', styles.prose)}>
      <EditorContent editor={editor} />
    </div>
  );
};
