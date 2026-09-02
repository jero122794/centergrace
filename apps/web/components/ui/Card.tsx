// apps/web/components/ui/Card.tsx
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: Props) => (
  <div className={`rounded-3xl border border-teal/10 bg-surface p-5 shadow-card ${className}`}>{children}</div>
);
