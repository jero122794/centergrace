// apps/web/app/(platform)/dashboard/page.tsx
'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
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
import { Ornament } from '@/components/brand/Ornament';

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
  const firstName = user?.name?.split(' ')[0] ?? user?.name;

  return (
    <div className="space-y-12">
      <header className="max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold-d">{formatGreetingDate(now)}</p>
        <h1 className="hero-display mt-3 text-dark">
          {formatGreeting(now)},
          <br />
          {firstName}.
        </h1>
        <Ornament className="mt-6 max-w-sm" />
      </header>

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
          title="Hoy descansa la página"
          verse="Aún no hay un devocional publicado. Vuelve más tarde; tu líder lo dejará aquí."
          dateLabel={formatLongDateBogota(now)}
        />
      )}

      {isStudent ? (
        <dl className="ledger">
          <StreakCard days={dashboard.data?.streak ?? 0} />
          <StatCard label="Cursos activos" value={dashboard.data?.enrollments ?? 0} />
          <StatCard label="Última nota" value={dashboard.data?.lastGrade?.score ?? '—'} />
          <div className="ledger-item">
            <dt>Calificación</dt>
            <dd className="!text-base !font-sans">
              <GradeBadge
                score={dashboard.data?.lastGrade?.score ?? null}
                status={dashboard.data?.lastGrade ? 'GRADED' : 'PENDING'}
              />
            </dd>
          </div>
        </dl>
      ) : (
        <dl className="ledger">
          <StatCard label="Personas" value={dashboard.data?.users ?? 0} />
          <StatCard label="Cursos" value={dashboard.data?.courses ?? 0} />
          <StatCard label="Participaciones hoy" value={dashboard.data?.participationsToday ?? 0} />
          <StatCard label="Ministerios" value={dashboard.data?.ministries ?? 0} />
        </dl>
      )}

      {isStudent && courses.data && courses.data.length > 0 ? (
        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-dark">En el pupitre</h2>
            <Link href="/cursos" className="text-sm text-accent underline decoration-gold underline-offset-4">
              Ver todos
            </Link>
          </div>
          <div className="course-mosaic grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.data.slice(0, 6).map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default DashboardPage;
