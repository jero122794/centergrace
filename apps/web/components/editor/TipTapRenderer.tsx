// apps/web/components/editor/TipTapRenderer.tsx
'use client';

interface Props {
  content: unknown;
}

export const TipTapRenderer = ({ content }: Props) => {
  const json = content as { content?: Array<{ content?: Array<{ text?: string }>; type?: string }> };
  const text = json?.content?.map((node) => node.content?.map((item) => item.text).join(' ') ?? '').join('\n\n');
  return <div className="prose max-w-none whitespace-pre-wrap text-ink">{text}</div>;
};
