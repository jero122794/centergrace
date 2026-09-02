// apps/web/app/offline/page.tsx
import { Logo } from '@/components/brand/Logo';
import { Ornament } from '@/components/brand/Ornament';

const OfflinePage = () => (
  <main className="wash flex min-h-screen items-center justify-center p-6">
    <div className="sheet max-w-md px-10 py-12 text-center">
      <Logo className="justify-center" />
      <h1 className="mt-7 font-display text-3xl text-dark">Sin conexión</h1>
      <Ornament className="my-5" />
      <p className="text-muted">Revisa tu red. Centro de Gracia volverá a sincronizar cuando haya internet.</p>
    </div>
  </main>
);

export default OfflinePage;
