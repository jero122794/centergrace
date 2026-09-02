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
import { cx } from '@/lib/cn';
import stack from '@/components/ui/PageStack.module.css';

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
    <div className={stack.tight}>
      <PageHeader kicker="Pastoreo" title="Seguimiento espiritual" description="Notas y acompañamiento por grupo." />
      {groups.isLoading ? <Skeleton lines={2} /> : null}
      <div className={stack.actions}>
        {groups.data?.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => {
              setGroupId(group.id);
              setUserId(null);
            }}
            className={cx(stack.chip, groupId === group.id && stack.chipOn)}
          >
            {group.name}
          </button>
        ))}
      </div>
      {!groupId ? <p className={stack.muted}>Selecciona un grupo para ver a sus miembros.</p> : null}
      <div className={stack.grid2}>
        <div className={stack.list}>
          {members.data?.map((member) => (
            <button key={member.id} type="button" className={stack.pick} onClick={() => setUserId(member.user.id)}>
              <Card selected={userId === member.user.id}>
                <p className={stack.name}>{member.user.name}</p>
                <p className={stack.muted}>{member.user.email}</p>
              </Card>
            </button>
          ))}
        </div>
        {followUp.data && selectedMember ? (
          <Card className={stack.page}>
            <div>
              <h2 className={stack.title}>{followUp.data.user.name}</h2>
              <p className={stack.muted}>{followUp.data.user.email}</p>
              <div className={stack.actions}>
                {followUp.data.memberships.map((item) => (
                  <Badge key={item.group.id}>{item.group.name}</Badge>
                ))}
              </div>
            </div>
            <section>
              <h3 className={stack.title}>Cursos</h3>
              {followUp.data.enrollments.length === 0 ? <p className={stack.muted}>Sin inscripciones.</p> : null}
              <ul className={stack.list}>
                {followUp.data.enrollments.map((item) => (
                  <li key={item.course.id}>{item.course.title}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className={stack.title}>Trabajos</h3>
              {followUp.data.submissions.length === 0 ? <p className={stack.muted}>Sin entregas.</p> : null}
              <ul className={stack.list}>
                {followUp.data.submissions.map((item) => (
                  <li key={item.id} className={stack.row}>
                    <span>{item.lesson.title}</span>
                    <span>{item.grade ? `${item.grade.score}/100` : item.status}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className={stack.title}>Devocionales</h3>
              {followUp.data.participations.length === 0 ? (
                <p className={stack.muted}>Sin participaciones.</p>
              ) : null}
              <ul className={stack.list}>
                {followUp.data.participations.map((item) => (
                  <li key={item.id}>
                    <p className={stack.name}>{item.devotional.title}</p>
                    <p className={stack.muted}>{item.content}</p>
                    <p className={stack.muted}>{formatDateBogota(item.createdAt)}</p>
                  </li>
                ))}
              </ul>
            </section>
            <SpiritualNotesPanel userId={followUp.data.user.id} groupId={selectedMember.groupId} />
          </Card>
        ) : (
          groupId ? <p className={stack.muted}>Selecciona un miembro para ver su historial.</p> : null
        )}
      </div>
    </div>
  );
};

export default FollowUpPage;
