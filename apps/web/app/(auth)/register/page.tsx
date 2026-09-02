// apps/web/app/(auth)/register/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

const RegisterPage = () => {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues): Promise<void> => {
    const response = await api.post('/api/auth/register', values);
    setSession(response.data.data.user, response.data.data.accessToken);
    router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-4 rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="font-display text-3xl text-teal">Crear cuenta</h1>
        <Input label="Nombre" {...form.register('name')} error={form.formState.errors.name?.message} />
        <Input label="Correo" type="email" {...form.register('email')} error={form.formState.errors.email?.message} />
        <Input label="Contraseña" type="password" {...form.register('password')} error={form.formState.errors.password?.message} />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          Registrarme
        </Button>
        <p className="text-center text-sm">
          ¿Ya tienes cuenta? <Link className="text-teal" href="/login">Entrar</Link>
        </p>
      </form>
    </main>
  );
};

export default RegisterPage;
