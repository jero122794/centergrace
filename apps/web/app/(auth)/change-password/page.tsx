// apps/web/app/(auth)/change-password/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

const ChangePasswordPage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: z.infer<typeof schema>): Promise<void> => {
    await api.post('/api/auth/change-password', values);
    router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-4 rounded-3xl bg-white p-8">
        <h1 className="font-display text-3xl text-teal">Cambia tu contraseña</h1>
        <Input label="Contraseña actual" type="password" {...form.register('currentPassword')} />
        <Input label="Nueva contraseña" type="password" {...form.register('newPassword')} />
        <Button type="submit" className="w-full">
          Guardar
        </Button>
      </form>
    </main>
  );
};

export default ChangePasswordPage;
