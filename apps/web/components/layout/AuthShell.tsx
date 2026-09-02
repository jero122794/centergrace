// apps/web/components/layout/AuthShell.tsx
import type { ReactNode } from 'react';
import { Logo } from '@/components/brand/Logo';

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export const AuthShell = ({ title, subtitle, children }: Props) => (
  <main className="grid min-h-screen lg:grid-cols-2">
    <section className="relative hidden overflow-hidden bg-teal-dark p-12 text-cream lg:flex lg:flex-col lg:justify-between">
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-80 w-80 rounded-full bg-teal-light/30 blur-3xl" />
      <Logo inverted />
      <div className="relative max-w-md space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-light">Estudios · Seguimiento · Alabanza</p>
        <h1 className="font-display text-4xl leading-tight">Una casa para crecer en la Palabra.</h1>
        <p className="text-cream/75">
          «Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.»
        </p>
        <p className="text-sm text-gold-light">Filipenses 4:7</p>
      </div>
      <p className="relative text-sm text-cream/50">Centro Misionero Shalom</p>
    </section>
    <section className="flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md space-y-6 rounded-[28px] border border-teal/10 bg-surface p-8 shadow-lift">
        <div className="lg:hidden">
          <Logo />
        </div>
        <div>
          <h2 className="font-display text-3xl text-teal">{title}</h2>
          <p className="mt-1 text-sm text-ink/60">{subtitle}</p>
        </div>
        {children}
      </div>
    </section>
  </main>
);
