// apps/web/app/(auth)/login/page.tsx
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
import { useAuthStore } from '@/store/auth.store';
import { getApiErrorMessage } from '@/lib/api';
import Link from 'next/link';

const schema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
});

type FormValues = z.infer<typeof schema>;

const LoginPage = () => {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: FormValues): Promise<void> => {
    setError(null);
    try {
      const user = await login(values.email, values.password);
      if (user.mustChangePassword) {
        router.push('/change-password');
        return;
      }
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Correo o contraseña incorrectos.'));
    }
  };

  return (
    <AuthShell title="Bienvenido" subtitle="Entra a la plataforma de estudios y ministerios.">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error ? <Alert>{error}</Alert> : null}
        <Input label="Correo" type="email" autoComplete="email" {...form.register('email')} error={form.formState.errors.email?.message} />
        <Input
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          {...form.register('password')}
          error={form.formState.errors.password?.message}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Entrando…' : 'Iniciar sesión'}
        </Button>
        <p className="text-center text-sm text-ink/60">
          ¿Aún no tienes cuenta?{' '}
          <Link className="font-semibold text-teal" href="/register">
            Regístrate
          </Link>
        </p>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
