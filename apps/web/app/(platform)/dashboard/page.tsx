// apps/web/app/(platform)/dashboard/page.tsx
'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, ClipboardList } from 'lucide-react';
import { api } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { StreakCard } from '@/components/dashboard/StreakCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DevotionalCard } from '@/components/devotional/DevotionalCard';
import { CourseCard } from '@/components/courses/CourseCard';
import { useAuthStore } from '@/store/auth.store';
import { formatGreeting, formatGreetingDate, formatLongDateBogota } from '@/lib/formatters';
import { GradeBadge } from '@/components/grading/GradeBadge';
import { Card } from '@/components/ui/Card';

interface CourseSummary {
  id: string;
  title: string;
  description: string;
  scope: string;
}

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const now = new Date();
  const dashboard = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await api.get('/api/dashboard')).data.data,
  });
  const today = useQuery({
    queryKey: ['devotional-today'],
    queryFn: async () => (await api.get('/api/devotionals/today')).data.data,
  });
  const courses = useQuery({
    queryKey: ['courses'],
    queryFn: async () => (await api.get<{ data: CourseSummary[] }>('/api/courses')).data.data,
    enabled: user?.role === 'STUDENT',
  });
  const isStudent = user?.role === 'STUDENT';
  const alreadyParticipated = Boolean(today.data?.participations?.length);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-h2 text-dark">
          {formatGreeting(now)}, {user?.name}
        </h1>
        <p className="text-[13px] text-muted">{formatGreetingDate(now)}</p>
      </div>
      {today.data ? (
        <DevotionalCard
          title={today.data.title}
          verse={today.data.verse}
          dateLabel={formatLongDateBogota(now)}
          action={
            alreadyParticipated ? (
              <Badge tone="success">Ya participaste hoy</Badge>
            ) : (
              <Link href={`/devocionales/${today.data.id}`}>
                <Button>Participar ahora</Button>
              </Link>
            )
          }
        />
      ) : (
        <DevotionalCard
          title="Sin devocional hoy"
          verse="Vuelve más tarde; tu líder publicará la reflexión del día."
          dateLabel={formatLongDateBogota(now)}
        />
      )}
      {isStudent ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StreakCard days={dashboard.data?.streak ?? 0} />
          <StatCard label="Cursos activos" value={dashboard.data?.enrollments ?? 0} icon={BookOpen} />
          <StatCard
            label="Última nota"
            value={dashboard.data?.lastGrade?.score ?? '—'}
            icon={ClipboardList}
            accent="gold"
          />
          <Card className="flex flex-col justify-center border-t-[3px] border-t-accent p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Última calificación</p>
            <div className="mt-3">
              <GradeBadge score={dashboard.data?.lastGrade?.score ?? null} status={dashboard.data?.lastGrade ? 'GRADED' : 'PENDING'} large />
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Usuarios" value={dashboard.data?.users ?? 0} />
          <StatCard label="Cursos" value={dashboard.data?.courses ?? 0} icon={BookOpen} />
          <StatCard label="Participaciones hoy" value={dashboard.data?.participationsToday ?? 0} />
          <StatCard label="Ministerios" value={dashboard.data?.ministries ?? 0} />
        </div>
      )}
      {isStudent && courses.data && courses.data.length > 0 ? (
        <section>
          <h2 className="mb-4 font-display text-h2 text-dark">Mis cursos</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.data.slice(0, 6).map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </section>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/cursos" className="block">
          <div className="rounded-2xl border border-border bg-paper p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
            <Badge tone="warm">Continuar</Badge>
            <h3 className="mt-3 font-display text-xl text-dark">Tus cursos</h3>
            <p className="mt-1 text-sm text-muted">Entra a las lecciones y sigue tu progreso.</p>
          </div>
        </Link>
        <Link href="/notificaciones" className="block">
          <div className="rounded-2xl border border-border bg-paper p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
            <Badge tone="info">Comunidad</Badge>
            <h3 className="mt-3 font-display text-xl text-dark">Avisos</h3>
            <p className="mt-1 text-sm text-muted">Revisa mensajes de tus líderes y de la iglesia.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
