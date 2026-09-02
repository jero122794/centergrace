// apps/web/components/courses/VideoPlayer.tsx
interface Props {
  youtubeId: string;
  title: string;
}

/**
 * Responsive 16:9 YouTube embed. Renders nothing without an id.
 */
export const VideoPlayer = ({ youtubeId, title }: Props) => {
  if (!youtubeId) {
    return null;
  }
  return (
    <div className="aspect-video overflow-hidden bg-black" style={{ borderRadius: '18px 42px 16px 30px' }}>
      <iframe
        title={title}
        className="h-full w-full border-0"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};
