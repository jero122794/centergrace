// apps/web/app/(platform)/mis-trabajos/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const MyWorkPage = () => {
  const query = useQuery({
    queryKey: ['my-submissions'],
    queryFn: async () => (await api.get('/api/submissions/mine')).data.data,
  });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-teal">Mis trabajos</h1>
      {query.data?.map((item: { id: string; status: string; lesson: { title: string }; grade?: { score: number } }) => (
        <Card key={item.id}>
          <div className="flex items-center justify-between">
            <p>{item.lesson.title}</p>
            <Badge tone={item.status === 'GRADED' ? 'teal' : 'gold'}>{item.status}</Badge>
          </div>
          {item.grade ? <p className="mt-2 text-sm">Nota: {item.grade.score}/100</p> : null}
        </Card>
      ))}
    </div>
  );
};

export default MyWorkPage;
