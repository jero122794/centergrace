// apps/web/components/worship/SongCard.tsx
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Props {
  id: string;
  title: string;
  artist?: string;
  originalKey: string;
  tags?: string[];
}

/**
 * Repertoire entry with original key and worship tags.
 */
export const SongCard = ({ id, title, artist, originalKey, tags = [] }: Props) => (
  <Link href={`/worship/repertorio/${id}`} className="block">
    <Card hover>
      <h3 className="font-display text-lg text-dark">{title}</h3>
      <p className="mt-1 text-sm text-muted">
        {artist} · {originalKey}
      </p>
      {tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1">
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
