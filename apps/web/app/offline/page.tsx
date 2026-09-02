// apps/web/app/offline/page.tsx
import { AuthShell } from '@/components/layout/AuthShell';

const OfflinePage = () => (
  <AuthShell title="Sin conexión" subtitle="Revisa tu red. Centro de Gracia volverá a sincronizar cuando haya internet.">
    <span />
  </AuthShell>
);

export default OfflinePage;
