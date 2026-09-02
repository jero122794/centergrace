// apps/web/app/(developer)/developer/servicios/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import stack from '@/components/ui/PageStack.module.css';

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
    <div className={stack.grid2}>
      <div className={stack.span2}>
        <PageHeader kicker="Sistema" title="Servicios" description="Postgres, Redis y proveedores opcionales." />
      </div>
      <Card>
        <div className={stack.row}>
          <p>PostgreSQL</p>
          <Badge tone={flag(data?.postgres?.connected)}>{data?.postgres?.connected ? 'ok' : 'caído'}</Badge>
        </div>
      </Card>
      <Card>
        <div className={stack.row}>
          <div>
            <p>Redis</p>
            <p className={stack.muted}>
              {data?.redis?.memory} · {data?.redis?.keys ?? 0} keys
            </p>
          </div>
          <Badge tone={flag(data?.redis?.ping === 'PONG')}>{data?.redis?.ping ?? '—'}</Badge>
        </div>
      </Card>
      <Card>
        <div className={stack.row}>
          <p>S3</p>
          <Badge tone={data?.s3?.configured ? 'teal' : 'gold'}>{data?.s3?.configured ? 'configurado' : 'local'}</Badge>
        </div>
      </Card>
      <Card>
        <div className={stack.row}>
          <p>SES</p>
          <Badge tone={data?.ses?.configured ? 'teal' : 'gold'}>{data?.ses?.configured ? 'configurado' : 'omitido'}</Badge>
        </div>
      </Card>
      <Card>
        <div className={stack.row}>
          <div>
            <p>YouTube oEmbed</p>
            <p className={stack.muted}>{data?.youtube?.latencyMs ? `${data.youtube.latencyMs} ms` : ''}</p>
          </div>
          <Badge tone={flag(data?.youtube?.reachable)}>{data?.youtube?.reachable ? 'ok' : 'sin red'}</Badge>
        </div>
      </Card>
      <Card>
        <div className={stack.row}>
          <div>
            <p>Web Push</p>
            <p className={stack.muted}>{data?.webPush?.subscriptions ?? 0} suscripciones</p>
          </div>
          <Badge tone={data?.webPush?.vapidConfigured ? 'teal' : 'danger'}>
            {data?.webPush?.vapidConfigured ? 'VAPID' : 'sin VAPID'}
          </Badge>
        </div>
      </Card>
    </div>
  );
};

export default ServicesPage;
