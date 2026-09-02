// apps/web/app/(admin)/layout.tsx
import { AppShell } from '@/components/layout/AppShell';

const AdminLayout = ({ children }: { children: React.ReactNode }) => <AppShell>{children}</AppShell>;

export default AdminLayout;
