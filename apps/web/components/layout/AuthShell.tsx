// apps/web/components/layout/AuthShell.tsx
import type { ReactNode } from 'react';
import { Logo } from '@/components/brand/Logo';
import { Ornament } from '@/components/brand/Ornament';

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/**
 * Centered journal card for password and similar flows.
 */
export const AuthShell = ({ title, subtitle, children }: Props) => (
  <main className="wash relative flex min-h-screen items-center justify-center px-4 py-12">
    <div className="sheet relative w-full max-w-[440px] px-8 py-10 sm:px-11">
      <Logo className="justify-center" />
      <h1 className="mt-7 text-center font-display text-[2rem] leading-tight text-dark">{title}</h1>
      <p className="mt-2 text-center text-sm text-muted">{subtitle}</p>
      <Ornament className="my-6" />
      {children}
    </div>
  </main>
);
