// apps/web/app/(developer)/developer/servicios/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';

const ServicesPage = () => {
  const query = useQuery({
    queryKey: ['dev-services'],
    queryFn: async () => (await api.get('/api/developer/services')).data.data,
  });
  return (
    <Card>
      <h1 className="font-display text-3xl text-teal">Servicios</h1>
      <pre className="mt-4 overflow-auto text-sm">{JSON.stringify(query.data, null, 2)}</pre>
    </Card>
  );
};

export default ServicesPage;
