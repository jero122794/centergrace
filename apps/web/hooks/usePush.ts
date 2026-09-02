// apps/web/hooks/usePush.ts
'use client';

import { subscribeToPush } from '@/lib/push';

export const usePush = () => ({ subscribe: subscribeToPush });
