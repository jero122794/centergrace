// apps/web/app/(admin)/admin/grupos/page.tsx
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const GroupsPage = () => {
  const client = useQueryClient();
  const form = useForm<{ name: string }>();
  const query = useQuery({
    queryKey: ['groups'],
    queryFn: async () => (await api.get('/api/groups')).data.data,
  });
  const create = useMutation({
    mutationFn: async (name: string) => api.post('/api/groups', { name, type: 'CELL' }),
    onSuccess: () => client.invalidateQueries({ queryKey: ['groups'] }),
  });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-teal">Grupos</h1>
      <form
        className="flex gap-2"
        onSubmit={form.handleSubmit((values) => create.mutate(values.name))}
      >
        <Input label="Nombre" {...form.register('name')} />
        <Button type="submit">Crear</Button>
      </form>
      {query.data?.map((item: { id: string; name: string; type: string }) => (
        <Card key={item.id}>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-slate-500">{item.type}</p>
        </Card>
      ))}
    </div>
  );
};

export default GroupsPage;
