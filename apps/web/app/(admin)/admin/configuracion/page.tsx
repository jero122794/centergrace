// apps/web/app/(admin)/admin/configuracion/page.tsx
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { resolveMediaUrl } from '@/lib/formatters';
import stack from '@/components/ui/PageStack.module.css';

interface ChurchSettings {
  churchName: string;
  logoUrl?: string | null;
  primaryColor: string;
  accentColor: string;
}

const SettingsPage = () => {
  const client = useQueryClient();
  const [form, setForm] = useState<ChurchSettings>({
    churchName: '',
    logoUrl: '',
    primaryColor: '#2F5D50',
    accentColor: '#C4A265',
  });
  const query = useQuery({
    queryKey: ['settings'],
    queryFn: async () => (await api.get('/api/settings')).data.data as ChurchSettings,
  });

  useEffect(() => {
    if (query.data) {
      setForm({
        churchName: query.data.churchName,
        logoUrl: query.data.logoUrl ?? '',
        primaryColor: query.data.primaryColor,
        accentColor: query.data.accentColor,
      });
    }
  }, [query.data]);

  const save = useMutation({
    mutationFn: async () =>
      api.patch('/api/settings', {
        churchName: form.churchName,
        logoUrl: form.logoUrl || null,
        primaryColor: form.primaryColor,
        accentColor: form.accentColor,
      }),
    onSuccess: () => client.invalidateQueries({ queryKey: ['settings'] }),
  });

  const uploadLogo = async (file: File): Promise<void> => {
    const payload = new FormData();
    payload.append('file', file);
    const response = await api.post('/api/uploads', payload);
    setForm((current) => ({ ...current, logoUrl: response.data.data.url as string }));
  };

  return (
    <div className={stack.page}>
      <PageHeader kicker="Iglesia" title="Identidad de la iglesia" description="Nombre, logo y colores de la plataforma." />
      <Card>
        <form
          className={stack.list}
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate();
          }}
        >
          <Input
            label="Nombre"
            value={form.churchName}
            onChange={(event) => setForm((current) => ({ ...current, churchName: event.target.value }))}
            required
          />
          <Input
            label="Color primario"
            value={form.primaryColor}
            onChange={(event) => setForm((current) => ({ ...current, primaryColor: event.target.value }))}
          />
          <Input
            label="Color de acento"
            value={form.accentColor}
            onChange={(event) => setForm((current) => ({ ...current, accentColor: event.target.value }))}
          />
          <label className={stack.list}>
            <span className={stack.name}>Logo</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void uploadLogo(file);
                }
              }}
            />
          </label>
          {form.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resolveMediaUrl(form.logoUrl)} alt="Logo" className={stack.thumb} />
          ) : null}
          <Button type="submit" disabled={save.isPending}>
            Guardar
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SettingsPage;
