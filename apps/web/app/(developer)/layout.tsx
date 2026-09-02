// apps/web/app/(developer)/layout.tsx
import { AppShell } from '@/components/layout/AppShell';
import { DeveloperNav } from '@/components/developer/DeveloperNav';

const DeveloperLayout = ({ children }: { children: React.ReactNode }) => (
  <AppShell>
    <DeveloperNav />
    {children}
  </AppShell>
);

export default DeveloperLayout;
