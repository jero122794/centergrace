// apps/web/app/(auth)/login/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

const LoginPage = () => {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues): Promise<void> => {
    const user = await login(values.email, values.password);
    if (user.mustChangePassword) {
      router.push('/change-password');
      return;
    }
    router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-4 rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="font-display text-3xl text-teal">Centro Misionero Shalom</h1>
        <p className="text-sm text-slate-500">Entra a la plataforma de estudios y ministerios.</p>
        <Input label="Correo" type="email" {...form.register('email')} error={form.formState.errors.email?.message} />
        <Input label="Contraseña" type="password" {...form.register('password')} error={form.formState.errors.password?.message} />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          Iniciar sesión
        </Button>
        <p className="text-center text-sm">
          ¿Aún no tienes cuenta? <Link className="text-teal" href="/register">Regístrate</Link>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;
