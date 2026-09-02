// apps/web/components/ui/Alert.tsx
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  tone?: 'danger' | 'info' | 'success';
}

const tones: Record<NonNullable<Props['tone']>, string> = {
  danger: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-teal/20 bg-teal-mist text-teal-dark',
  success: 'border-teal/20 bg-teal-mist text-teal-dark',
};

export const Alert = ({ children, tone = 'danger' }: Props) => (
  <p className={`rounded-xl border px-3 py-2 text-sm ${tones[tone]}`}>{children}</p>
);
