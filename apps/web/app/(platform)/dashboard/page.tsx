// apps/web/app/(platform)/dashboard/page.tsx
'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Ledger, StatCard } from '@/components/dashboard/StatCard';
import { StreakCard } from '@/components/dashboard/StreakCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DevotionalCard } from '@/components/devotional/DevotionalCard';
import { CourseCard } from '@/components/courses/CourseCard';
import { useAuthStore } from '@/store/auth.store';
import { formatGreeting, formatGreetingDate, formatLongDateBogota } from '@/lib/formatters';
import { GradeBadge } from '@/components/grading/GradeBadge';
import { Ornament } from '@/components/brand/Ornament';
import styles from './page.module.css';

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
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.kicker}>{formatGreetingDate(now)}</p>
        <h1 className={styles.title}>
          {formatGreeting(now)},
          <br />
          {firstName}.
        </h1>
        <Ornament className={styles.rule} />
      </header>

      <div className={styles.split}>
        <div className={styles.main}>
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
            <Ledger>
              <StreakCard days={dashboard.data?.streak ?? 0} />
              <StatCard label="Cursos activos" value={dashboard.data?.enrollments ?? 0} enterDelay={60} />
              <StatCard label="Última nota" value={dashboard.data?.lastGrade?.score ?? '—'} enterDelay={120} />
              <div className={styles.gradeItem}>
                <dt className={styles.gradeLabel}>Calificación</dt>
                <dd>
                  <GradeBadge
                    score={dashboard.data?.lastGrade?.score ?? null}
                    status={dashboard.data?.lastGrade ? 'GRADED' : 'PENDING'}
                  />
                </dd>
              </div>
            </Ledger>
          ) : (
            <Ledger>
              <StatCard label="Personas" value={dashboard.data?.users ?? 0} />
              <StatCard label="Cursos" value={dashboard.data?.courses ?? 0} enterDelay={60} />
              <StatCard label="Participaciones hoy" value={dashboard.data?.participationsToday ?? 0} enterDelay={120} />
              <StatCard label="Ministerios" value={dashboard.data?.ministries ?? 0} enterDelay={180} />
            </Ledger>
          )}

          {isStudent && courses.data && courses.data.length > 0 ? (
            <section>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>En el pupitre</h2>
                <Link href="/cursos" className={styles.all}>
                  Ver todos
                </Link>
              </div>
              <div className={styles.mosaic}>
                {courses.data.slice(0, 6).map((course, index) => (
                  <CourseCard key={course.id} {...course} enterDelay={index * 60} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className={styles.detail} aria-label="Detalle de hoy">
          <p className={styles.detailTitle}>Hoy</p>
          <p className={styles.detailBody}>
            {alreadyParticipated
              ? 'Ya dejaste tu reflexión. El resto del día es para vivirla.'
              : 'El devocional te espera. Una página, un versículo, tu voz.'}
          </p>
          {isStudent ? (
            <div className={styles.gradeWrap}>
              <GradeBadge
                score={dashboard.data?.lastGrade?.score ?? null}
                status={dashboard.data?.lastGrade ? 'GRADED' : 'PENDING'}
                large
              />
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
};

export default DashboardPage;
