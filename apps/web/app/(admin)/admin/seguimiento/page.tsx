// apps/web/app/(admin)/admin/seguimiento/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SpiritualNotesPanel } from '@/components/groups/SpiritualNotesPanel';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDateBogota } from '@/lib/formatters';

interface GroupRow {
  id: string;
  name: string;
  _count?: { memberships: number };
}

interface MemberRow {
  id: string;
  user: { id: string; name: string; email: string };
  groupId: string;
}

interface FollowUp {
  user: { id: string; name: string; email: string; role: string };
  memberships: Array<{ group: { id: string; name: string } }>;
  submissions: Array<{ id: string; status: string; lesson: { title: string }; grade?: { score: number } | null }>;
  participations: Array<{ id: string; content: string; createdAt: string; devotional: { title: string } }>;
  enrollments: Array<{ course: { id: string; title: string } }>;
}

const FollowUpPage = () => {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const groups = useQuery({
    queryKey: ['groups'],
    queryFn: async () => (await api.get('/api/groups')).data.data as GroupRow[],
  });
  const members = useQuery({
    queryKey: ['group-members', groupId],
    queryFn: async () => (await api.get(`/api/groups/${groupId}/members`)).data.data as MemberRow[],
    enabled: Boolean(groupId),
  });
  const followUp = useQuery({
    queryKey: ['follow-up', userId],
    queryFn: async () => (await api.get(`/api/users/${userId}/follow-up`)).data.data as FollowUp,
    enabled: Boolean(userId),
  });
  const selectedMember = members.data?.find((item) => item.user.id === userId);

  return (
    <div className="space-y-4">
      <PageHeader kicker="Pastoreo" title="Seguimiento espiritual" description="Notas y acompañamiento por grupo." />
      {groups.isLoading ? <Skeleton lines={2} /> : null}
      <div className="flex flex-wrap gap-2">
        {groups.data?.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => {
              setGroupId(group.id);
              setUserId(null);
            }}
            className={`rounded-full px-3 py-1 text-sm ${groupId === group.id ? 'bg-teal text-white' : 'bg-white border border-slate-200'}`}
          >
            {group.name}
          </button>
        ))}
      </div>
      {!groupId ? <p className="text-sm text-slate-500">Selecciona un grupo para ver a sus miembros.</p> : null}
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <div className="space-y-2">
          {members.data?.map((member) => (
            <button key={member.id} type="button" className="w-full text-left" onClick={() => setUserId(member.user.id)}>
              <Card className={userId === member.user.id ? 'ring-2 ring-teal' : ''}>
                <p className="font-medium">{member.user.name}</p>
                <p className="text-xs text-slate-500">{member.user.email}</p>
              </Card>
            </button>
          ))}
        </div>
        {followUp.data && selectedMember ? (
          <Card className="space-y-6">
            <div>
              <h2 className="font-display text-2xl text-teal">{followUp.data.user.name}</h2>
              <p className="text-sm text-slate-500">{followUp.data.user.email}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {followUp.data.memberships.map((item) => (
                  <Badge key={item.group.id}>{item.group.name}</Badge>
                ))}
              </div>
            </div>
            <section>
              <h3 className="mb-2 font-display text-xl">Cursos</h3>
              {followUp.data.enrollments.length === 0 ? <p className="text-sm text-slate-500">Sin inscripciones.</p> : null}
              <ul className="space-y-1 text-sm">
                {followUp.data.enrollments.map((item) => (
                  <li key={item.course.id}>{item.course.title}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="mb-2 font-display text-xl">Trabajos</h3>
              {followUp.data.submissions.length === 0 ? <p className="text-sm text-slate-500">Sin entregas.</p> : null}
              <ul className="space-y-1 text-sm">
                {followUp.data.submissions.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.lesson.title}</span>
                    <span>{item.grade ? `${item.grade.score}/100` : item.status}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="mb-2 font-display text-xl">Devocionales</h3>
              {followUp.data.participations.length === 0 ? (
                <p className="text-sm text-slate-500">Sin participaciones.</p>
              ) : null}
              <ul className="space-y-2 text-sm">
                {followUp.data.participations.map((item) => (
                  <li key={item.id}>
                    <p className="font-medium">{item.devotional.title}</p>
                    <p className="text-slate-600">{item.content}</p>
                    <p className="text-xs text-slate-400">{formatDateBogota(item.createdAt)}</p>
                  </li>
                ))}
              </ul>
            </section>
            <SpiritualNotesPanel userId={followUp.data.user.id} groupId={selectedMember.groupId} />
          </Card>
        ) : (
          groupId ? <p className="text-sm text-slate-500">Selecciona un miembro para ver su historial.</p> : null
        )}
      </div>
    </div>
  );
};

export default FollowUpPage;
