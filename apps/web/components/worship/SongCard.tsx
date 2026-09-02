// apps/web/components/worship/SongCard.tsx
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

interface Props {
  id: string;
  title: string;
  artist?: string;
  originalKey: string;
}

export const SongCard = ({ id, title, artist, originalKey }: Props) => (
  <Link href={`/worship/repertorio/${id}`}>
    <Card>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-slate-500">
        {artist} · {originalKey}
      </p>
    </Card>
  </Link>
);
