// apps/web/components/editor/TipTapRenderer.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Skeleton } from '@/components/ui/Skeleton';

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
    return <Skeleton className="h-24" />;
  }

  return (
    <div className="prose-grace max-w-none text-[15px] leading-[1.8] text-dark">
      <EditorContent editor={editor} />
    </div>
  );
};
