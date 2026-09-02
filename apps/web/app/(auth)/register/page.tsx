// apps/web/app/(auth)/register/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Logo } from '@/components/brand/Logo';
import { api, getApiErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { cx } from '@/lib/cn';
import { Ornament } from '@/components/brand/Ornament';
import styles from './page.module.css';

const schema = z
  .object({
    name: z.string().min(2, 'Escribe tu nombre'),
    email: z.string().email('Correo inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirm: z.string().min(8, 'Confirma tu contraseña'),
  })
  .refine((values) => values.password === values.confirm, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm'],
  });

type FormValues = z.infer<typeof schema>;

const strengthOf = (password: string): number => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
};

const RegisterPage = () => {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [error, setError] = useState<string | null>(null);
  const password = form.watch('password') ?? '';
  const strength = useMemo(() => strengthOf(password), [password]);

  const onSubmit = async (values: FormValues): Promise<void> => {
    setError(null);
    try {
      const response = await api.post('/api/auth/register', {
        name: values.name,
        email: values.email,
        password: values.password,
      });
      setSession(response.data.data.user, response.data.data.accessToken);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'No se pudo crear la cuenta.'));
    }
  };

  return (
    <main className={styles.stage}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.card}>
        <Logo className={styles.logo} />
        <h1 className={styles.title}>Crea tu cuenta</h1>
        <p className={styles.sub}>Únete al espacio de formación de la iglesia</p>
        <Ornament className={styles.rule} />
        <div className={styles.stack}>
          {error ? <Alert>{error}</Alert> : null}
          <Input label="Nombre completo" autoComplete="name" {...form.register('name')} error={form.formState.errors.name?.message} />
          <Input label="Correo" type="email" autoComplete="email" {...form.register('email')} error={form.formState.errors.email?.message} />
          <Input
            label="Contraseña"
            type="password"
            autoComplete="new-password"
            {...form.register('password')}
            error={form.formState.errors.password?.message}
          />
          <div className={styles.meter} aria-hidden>
            {[0, 1, 2, 3].map((index) => (
              <span key={index} className={cx(styles.seg, index < strength && styles.on)} />
            ))}
          </div>
          <Input
            label="Confirmar contraseña"
            type="password"
            autoComplete="new-password"
            {...form.register('confirm')}
            error={form.formState.errors.confirm?.message}
          />
          <Button type="submit" fullWidth disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Creando…' : 'Registrarme'}
          </Button>
          <p className={styles.switch}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/login">
              Entrar
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};

export default RegisterPage;
