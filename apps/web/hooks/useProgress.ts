// apps/web/hooks/useProgress.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useProgress = (courseId: string) =>
  useQuery({
    queryKey: ['progress', courseId],
    queryFn: async () => (await api.get(`/api/courses/${courseId}/progress`)).data.data,
    enabled: Boolean(courseId),
  });
