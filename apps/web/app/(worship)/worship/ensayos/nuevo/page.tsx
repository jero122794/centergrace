// apps/web/app/(worship)/worship/ensayos/nuevo/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import stack from '@/components/ui/PageStack.module.css';

const NewRehearsalPage = () => {
  const router = useRouter();
  const form = useForm<{ date: string; location: string; ministryId: string }>();
  const ministries = useQuery({
    queryKey: ['ministries'],
    queryFn: async () => (await api.get('/api/ministries')).data.data,
  });

  return (
    <form
      className={stack.list}
      onSubmit={form.handleSubmit(async (values) => {
        await api.post('/api/worship/rehearsals', { ...values, date: new Date(values.date).toISOString() });
        router.push('/worship/ensayos');
      })}
    >
      <PageHeader kicker="Alabanza" title="Nuevo ensayo" />
      <Input label="Fecha y hora" type="datetime-local" {...form.register('date')} />
      <Input label="Lugar" {...form.register('location')} />
      <label className={stack.list}>
        Ministerio
        <select className={stack.select} {...form.register('ministryId')}>
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
