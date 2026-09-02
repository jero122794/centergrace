// apps/web/components/ui/Card.tsx
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: Props) => (
  <div className={`rounded-2xl border border-white/80 bg-white p-5 shadow-sm ${className}`}>{children}</div>
);
