// apps/web/components/courses/VideoPlayer.tsx
interface Props {
  youtubeId: string;
  title: string;
}

export const VideoPlayer = ({ youtubeId, title }: Props) => (
  <div className="aspect-video overflow-hidden rounded-2xl bg-black">
    <iframe
      title={title}
      className="h-full w-full"
      src={`https://www.youtube.com/embed/${youtubeId}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
);
