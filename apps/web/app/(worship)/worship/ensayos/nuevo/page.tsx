// apps/web/app/(worship)/worship/ensayos/nuevo/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const NewRehearsalPage = () => {
  const router = useRouter();
  const form = useForm<{ date: string; location: string; ministryId: string }>();
  const ministries = useQuery({
    queryKey: ['ministries'],
    queryFn: async () => (await api.get('/api/ministries')).data.data,
  });

  return (
    <form
      className="max-w-lg space-y-3"
      onSubmit={form.handleSubmit(async (values) => {
        await api.post('/api/worship/rehearsals', { ...values, date: new Date(values.date).toISOString() });
        router.push('/worship/ensayos');
      })}
    >
      <h1 className="font-display text-3xl text-teal">Nuevo ensayo</h1>
      <Input label="Fecha y hora" type="datetime-local" {...form.register('date')} />
      <Input label="Lugar" {...form.register('location')} />
      <label className="block text-sm">
        Ministerio
        <select className="mt-1 w-full rounded-xl border p-2" {...form.register('ministryId')}>
          {ministries.data?.map((item: { id: string; name: string }) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit">Crear</Button>
    </form>
  );
};

export default NewRehearsalPage;
