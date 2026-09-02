// apps/web/components/worship/SongCard.tsx
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import styles from './SongCard.module.css';

interface Props {
  id: string;
  title: string;
  artist?: string;
  originalKey: string;
  tags?: string[];
  selected?: boolean;
  enterDelay?: number;
}

/**
 * Repertoire entry: title as primary, artist as secondary, key as the action-colored datum.
 */
export const SongCard = ({ id, title, artist, originalKey, tags = [], selected = false, enterDelay = 0 }: Props) => (
  <Link href={`/worship/repertorio/${id}`} className={styles.link}>
    <Card hover selected={selected} enterDelay={enterDelay}>
      <div className={styles.head}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.key}>{originalKey}</span>
      </div>
      {artist ? <p className={styles.meta}>{artist}</p> : null}
      {tags.length > 0 ? (
        <div className={styles.tags}>
          {tags.map((tag) => (
            <Badge key={tag} tone="worship">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}
    </Card>
  </Link>
);
