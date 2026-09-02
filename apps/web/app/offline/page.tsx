// apps/web/app/offline/page.tsx
import { Logo } from '@/components/brand/Logo';

const OfflinePage = () => (
  <main className="flex min-h-screen items-center justify-center bg-bg p-6">
    <div className="max-w-md rounded-[20px] bg-paper p-10 text-center shadow-auth">
      <Logo className="justify-center" />
      <h1 className="mt-6 font-display text-3xl text-dark">Sin conexión</h1>
      <p className="mt-3 text-muted">
        Revisa tu red. Centro de Gracia volverá a sincronizar cuando haya internet.
      </p>
    </div>
  </main>
);

export default OfflinePage;
