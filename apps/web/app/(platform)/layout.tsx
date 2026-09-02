// apps/web/app/(platform)/layout.tsx
import { AppShell } from '@/components/layout/AppShell';

const PlatformLayout = ({ children }: { children: React.ReactNode }) => <AppShell>{children}</AppShell>;

export default PlatformLayout;
