// apps/web/components/developer/EnvChecker.tsx
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';

export interface EnvFlag {
  key: string;
  present: boolean;
}

interface Props {
  items: EnvFlag[];
}

/**
 * Presence-only environment checklist. Values are never rendered.
 */
export const EnvChecker = ({ items }: Props) => (
  <div className="space-y-4">
    <Alert tone="info">Los valores nunca se muestran por seguridad.</Alert>
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.key} className="flex items-center justify-between rounded-xl border border-dev/20 bg-paper px-4 py-3">
          <p className="font-mono text-sm text-dark">{item.key}</p>
          <Badge tone={item.present ? 'success' : 'danger'}>{item.present ? 'Definida' : 'Ausente'}</Badge>
        </li>
      ))}
    </ul>
  </div>
);
