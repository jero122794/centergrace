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
import { Ornament } from '@/components/brand/Ornament';
import { useAuthStore } from '@/store/auth.store';
import { getApiErrorMessage } from '@/lib/api';
import styles from './page.module.css';

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
    <main className={styles.stage}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.card}>
        <Logo className={styles.logo} />
        <h1 className={styles.title}>Bienvenido de vuelta</h1>
        <p className={styles.sub}>Entra a tu espacio espiritual</p>
        <Ornament className={styles.rule} />
        <div className={styles.stack}>
          {error ? <Alert>{error}</Alert> : null}
          <Input label="Correo" type="email" autoComplete="email" {...form.register('email')} error={form.formState.errors.email?.message} />
          <Input
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            {...form.register('password')}
            error={form.formState.errors.password?.message}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            }
          />
          <p className={styles.forgot}>
            <a href="mailto:admin@iglesia.com">¿Olvidaste tu contraseña?</a>
          </p>
          <Button type="submit" fullWidth disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Entrando…' : 'Iniciar sesión'}
          </Button>
          <Ornament label="o" />
          <a href={`${API_URL}/api/auth/google`} className={styles.google}>
            Continuar con Google
          </a>
          <p className={styles.switch}>
            ¿No tienes cuenta?{' '}
            <Link href="/register">
              Regístrate
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};

export default LoginPage;
