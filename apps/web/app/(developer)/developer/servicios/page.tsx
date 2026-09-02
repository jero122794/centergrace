// apps/web/app/(developer)/developer/servicios/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';

interface ServicesPayload {
  postgres?: { connected?: boolean };
  redis?: { ping?: string; memory?: string; keys?: number };
  s3?: { configured?: boolean };
  ses?: { configured?: boolean };
  youtube?: { reachable?: boolean; latencyMs?: number };
  webPush?: { subscriptions?: number; vapidConfigured?: boolean };
}

const flag = (ok: boolean | undefined): 'teal' | 'danger' => (ok ? 'teal' : 'danger');

const ServicesPage = () => {
  const query = useQuery({
    queryKey: ['dev-services'],
    queryFn: async () => (await api.get('/api/developer/services')).data.data as ServicesPayload,
  });
  const data = query.data;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="md:col-span-2">
        <PageHeader kicker="Sistema" title="Servicios" description="Postgres, Redis y proveedores opcionales." />
      </div>
      <Card className="flex items-center justify-between">
        <p>PostgreSQL</p>
        <Badge tone={flag(data?.postgres?.connected)}>{data?.postgres?.connected ? 'ok' : 'caído'}</Badge>
      </Card>
      <Card className="flex items-center justify-between">
        <div>
          <p>Redis</p>
          <p className="text-xs text-slate-500">
            {data?.redis?.memory} · {data?.redis?.keys ?? 0} keys
          </p>
        </div>
        <Badge tone={flag(data?.redis?.ping === 'PONG')}>{data?.redis?.ping ?? '—'}</Badge>
      </Card>
      <Card className="flex items-center justify-between">
        <p>S3</p>
        <Badge tone={data?.s3?.configured ? 'teal' : 'gold'}>{data?.s3?.configured ? 'configurado' : 'local'}</Badge>
      </Card>
      <Card className="flex items-center justify-between">
        <p>SES</p>
        <Badge tone={data?.ses?.configured ? 'teal' : 'gold'}>{data?.ses?.configured ? 'configurado' : 'omitido'}</Badge>
      </Card>
      <Card className="flex items-center justify-between">
        <div>
          <p>YouTube oEmbed</p>
          <p className="text-xs text-slate-500">{data?.youtube?.latencyMs ? `${data.youtube.latencyMs} ms` : ''}</p>
        </div>
        <Badge tone={flag(data?.youtube?.reachable)}>{data?.youtube?.reachable ? 'ok' : 'sin red'}</Badge>
      </Card>
      <Card className="flex items-center justify-between">
        <div>
          <p>Web Push</p>
          <p className="text-xs text-slate-500">{data?.webPush?.subscriptions ?? 0} suscripciones</p>
        </div>
        <Badge tone={data?.webPush?.vapidConfigured ? 'teal' : 'danger'}>
          {data?.webPush?.vapidConfigured ? 'VAPID' : 'sin VAPID'}
        </Badge>
      </Card>
    </div>
  );
};

export default ServicesPage;
