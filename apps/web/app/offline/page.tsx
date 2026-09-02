// apps/web/app/offline/page.tsx
import { Logo } from '@/components/brand/Logo';

const OfflinePage = () => (
  <main className="flex min-h-screen items-center justify-center p-6">
    <div className="max-w-md rounded-[28px] border border-teal/10 bg-surface p-8 text-center shadow-lift">
      <Logo className="justify-center" />
      <h1 className="mt-6 font-display text-3xl text-teal">Sin conexión</h1>
      <p className="mt-3 text-ink/65">
        Revisa tu red. La plataforma Shalom volverá a sincronizar cuando haya internet.
      </p>
    </div>
  </main>
);

export default OfflinePage;
