// apps/web/components/layout/AuthShell.tsx
import type { ReactNode } from 'react';
import { Logo } from '@/components/brand/Logo';

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/**
 * Centered light auth card used by password and similar flows.
 */
export const AuthShell = ({ title, subtitle, children }: Props) => (
  <main className="relative flex min-h-screen items-center justify-center bg-bg px-4 py-10">
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20" />
      <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15" />
      <div className="absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10" />
    </div>
    <div className="relative w-full max-w-[420px] rounded-[20px] bg-paper p-10 shadow-auth">
      <Logo className="justify-center" />
      <h1 className="mt-6 text-center font-display text-[28px] text-dark">{title}</h1>
      <p className="mt-1 text-center text-sm text-muted">{subtitle}</p>
      <div className="mt-8">{children}</div>
    </div>
  </main>
);
