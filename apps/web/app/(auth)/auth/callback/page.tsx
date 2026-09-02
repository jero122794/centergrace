// apps/web/app/(auth)/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { api, setAccessToken } from '@/lib/api';
import { Suspense } from 'react';

const CallbackInner = () => {
  const params = useSearchParams();
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    const token = params.get('accessToken');
    if (!token) {
      router.replace('/login');
      return;
    }
    setAccessToken(token);
    void api.get('/api/auth/me').then((response) => {
      setSession(response.data.data, token);
      router.replace('/dashboard');
    });
  }, [params, router, setSession]);

  return <p className="p-8">Completando inicio de sesión…</p>;
};

const AuthCallbackPage = () => (
  <Suspense fallback={<p className="p-8">Cargando…</p>}>
    <CallbackInner />
  </Suspense>
);

export default AuthCallbackPage;
