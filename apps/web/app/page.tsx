// apps/web/app/page.tsx
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';

const PILLARS = [
  { title: 'Estudios bíblicos', body: 'Cursos, lecciones y entregas para crecer con tu grupo.' },
  { title: 'Seguimiento espiritual', body: 'Notas pastorales y acompañamiento de cada vida en la iglesia.' },
  { title: 'Alabanza', body: 'Repertorio, ensayos, setlists y escuela de adoración.' },
];

const HomePage = () => (
  <main className="min-h-screen bg-bg">
    <header className="mx-auto flex max-w-content items-center justify-between px-6 py-6">
      <Logo />
      <div className="flex items-center gap-3">
        <Link href="/login" className="hidden text-sm font-semibold text-accent sm:inline">
          Entrar
        </Link>
        <Link href="/register" className="rounded-pill bg-accent px-4 py-2 text-sm font-semibold text-white">
          Crear cuenta
        </Link>
      </div>
    </header>
    <section className="mx-auto grid max-w-content items-center gap-12 px-6 pb-20 pt-8 lg:grid-cols-2 lg:pt-16">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-d">Centro Misionero Shalom</p>
        <h1 className="mt-4 font-display text-display text-dark">Paz que forma discípulos.</h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
          Centro de Gracia es la casa digital de la iglesia: estudios, devocionales, seguimiento pastoral y ministerio de
          alabanza.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/login" className="rounded-pill bg-accent px-5 py-3 text-sm font-semibold text-white shadow-card">
            Entrar a la plataforma
          </Link>
          <Link
            href="/register"
            className="rounded-pill border-[1.5px] border-primary-d bg-surface px-5 py-3 text-sm font-semibold text-accent"
          >
            Soy nuevo
          </Link>
        </div>
      </div>
      <blockquote className="rounded-[32px] border-l-[6px] border-gold bg-warm p-8 font-display text-verse italic text-muted">
        «Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo
        Jesús.»
        <cite className="mt-6 block text-sm not-italic text-gold-d">Filipenses 4:7</cite>
      </blockquote>
    </section>
    <section className="mx-auto grid max-w-content gap-4 px-6 pb-24 md:grid-cols-3">
      {PILLARS.map((pillar) => (
        <article key={pillar.title} className="rounded-2xl border border-border bg-paper p-6 shadow-card">
          <h2 className="font-display text-xl text-dark">{pillar.title}</h2>
          <p className="mt-2 text-sm text-muted">{pillar.body}</p>
        </article>
      ))}
    </section>
  </main>
);

export default HomePage;
