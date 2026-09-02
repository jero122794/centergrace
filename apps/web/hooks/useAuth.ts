// apps/web/hooks/useAuth.ts
'use client';

import { useAuthStore } from '@/store/auth.store';

export const useAuth = () => useAuthStore();
