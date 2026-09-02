// apps/web/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Logo } from '@/components/brand/Logo';
import { useAuthStore } from '@/store/auth.store';
import { getApiErrorMessage } from '@/lib/api';

const schema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
});

type FormValues = z.infer<typeof schema>;

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const LoginPage = () => {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
    <main className="relative flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20" />
        <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15" />
        <div className="absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10" />
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative w-full max-w-[420px] rounded-[20px] bg-paper p-10 shadow-auth"
      >
        <Logo className="justify-center" />
        <h1 className="mt-6 text-center font-display text-[28px] text-dark">Bienvenido de vuelta</h1>
        <p className="mt-1 text-center text-sm text-muted">Ingresa a tu espacio espiritual</p>
        <div className="mt-8 space-y-4">
          {error ? <Alert>{error}</Alert> : null}
          <Input label="Correo" type="email" autoComplete="email" {...form.register('email')} error={form.formState.errors.email?.message} />
          <div className="relative">
            <Input
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              {...form.register('password')}
              error={form.formState.errors.password?.message}
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-muted"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-right text-xs">
            <a className="text-accent" href="mailto:admin@iglesia.com">
              ¿Olvidaste tu contraseña?
            </a>
          </p>
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Entrando…' : 'Iniciar sesión'}
          </Button>
          <div className="flex items-center gap-3 text-xs text-hint">
            <span className="h-px flex-1 bg-border" />
            o
            <span className="h-px flex-1 bg-border" />
          </div>
          <a
            href={`${API_URL}/api/auth/google`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-pill border-[1.5px] border-border bg-paper py-2.5 text-sm font-semibold text-dark hover:bg-surface"
          >
            Continuar con Google
          </a>
          <p className="text-center text-sm text-muted">
            ¿No tienes cuenta?{' '}
            <Link className="font-semibold text-accent" href="/register">
              Regístrate
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};

export default LoginPage;
