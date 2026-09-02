// apps/web/components/courses/VideoPlayer.tsx
import styles from './VideoPlayer.module.css';

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
    <div className={styles.frame}>
      <iframe
        title={title}
        className={styles.iframe}
        src={`https://www.youtube.com/embed/${youtubeId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};
