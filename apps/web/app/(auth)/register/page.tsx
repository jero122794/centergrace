// apps/web/app/(auth)/register/page.tsx
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
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';

const schema = z.object({
  name: z.string().min(2, 'Escribe tu nombre'),
  email: z.string().email('Correo inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

type FormValues = z.infer<typeof schema>;

const RegisterPage = () => {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: FormValues): Promise<void> => {
    setError(null);
    try {
      const response = await api.post('/api/auth/register', values);
      setSession(response.data.data.user, response.data.data.accessToken);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'No se pudo crear la cuenta.'));
    }
  };

  return (
    <AuthShell title="Crear cuenta" subtitle="Regístrate para estudiar y servir con tu iglesia.">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error ? <Alert>{error}</Alert> : null}
        <Input label="Nombre" autoComplete="name" {...form.register('name')} error={form.formState.errors.name?.message} />
        <Input label="Correo" type="email" autoComplete="email" {...form.register('email')} error={form.formState.errors.email?.message} />
        <Input
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          {...form.register('password')}
          error={form.formState.errors.password?.message}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Creando…' : 'Registrarme'}
        </Button>
        <p className="text-center text-sm text-ink/60">
          ¿Ya tienes cuenta?{' '}
          <Link className="font-semibold text-teal" href="/login">
            Entrar
          </Link>
        </p>
      </form>
    </AuthShell>
  );
};

export default RegisterPage;
