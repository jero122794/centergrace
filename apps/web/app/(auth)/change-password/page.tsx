// apps/web/app/(auth)/change-password/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { AuthShell } from '@/components/layout/AuthShell';
import { api, getApiErrorMessage } from '@/lib/api';

const schema = z.object({
  currentPassword: z.string().min(1, 'Ingresa la contraseña actual'),
  newPassword: z.string().min(8, 'Mínimo 8 caracteres'),
});

const ChangePasswordPage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: z.infer<typeof schema>): Promise<void> => {
    setError(null);
    try {
      await api.post('/api/auth/change-password', values);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'No se pudo cambiar la contraseña.'));
    }
  };

  return (
    <AuthShell title="Cambia tu contraseña" subtitle="Por seguridad, actualiza tu clave antes de continuar.">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error ? <Alert>{error}</Alert> : null}
        <Input
          label="Contraseña actual"
          type="password"
          {...form.register('currentPassword')}
          error={form.formState.errors.currentPassword?.message}
        />
        <Input
          label="Nueva contraseña"
          type="password"
          {...form.register('newPassword')}
          error={form.formState.errors.newPassword?.message}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          Guardar
        </Button>
      </form>
    </AuthShell>
  );
};

export default ChangePasswordPage;
