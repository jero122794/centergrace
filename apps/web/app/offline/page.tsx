// apps/web/app/offline/page.tsx
const OfflinePage = () => (
  <main className="flex min-h-screen items-center justify-center bg-cream p-6">
    <div className="max-w-md text-center">
      <h1 className="font-display text-3xl text-teal">Sin conexión</h1>
      <p className="mt-3 text-slate-600">
        Revisa tu red. La plataforma Shalom volverá a sincronizar cuando haya internet.
      </p>
    </div>
  </main>
);

export default OfflinePage;
