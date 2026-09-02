// apps/web/app/page.tsx
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';

const PILLARS = [
  {
    title: 'Estudios bíblicos',
    body: 'Cursos, lecciones y entregas para crecer con tu grupo.',
  },
  {
    title: 'Seguimiento espiritual',
    body: 'Notas pastorales y acompañamiento de cada vida en la iglesia.',
  },
  {
    title: 'Alabanza',
    body: 'Repertorio, ensayos, setlists y escuela de adoración.',
  },
];

const HomePage = () => (
  <main className="min-h-screen">
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <Logo />
      <div className="flex items-center gap-3">
        <Link href="/login" className="hidden text-sm font-semibold text-teal sm:inline">
          Entrar
        </Link>
        <Link
          href="/register"
          className="rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-white shadow-card hover:bg-teal-dark"
        >
          Crear cuenta
        </Link>
      </div>
    </header>
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-8 lg:grid-cols-2 lg:pt-16">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-dark">Centro Misionero Shalom</p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-teal md:text-6xl">
          Paz que forma discípulos.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink/70">
          La casa digital de la iglesia: estudios, devocionales, seguimiento pastoral y ministerio de alabanza en un
          solo lugar.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-teal px-5 py-3 text-sm font-semibold text-white shadow-lift hover:bg-teal-dark"
          >
            Entrar a la plataforma
          </Link>
          <Link
            href="/register"
            className="rounded-xl border border-teal/20 bg-surface px-5 py-3 text-sm font-semibold text-teal hover:bg-teal-mist"
          >
            Soy nuevo
          </Link>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-[32px] bg-teal-dark p-8 text-cream shadow-lift">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/25 blur-2xl" />
        <p className="font-display text-2xl leading-snug">
          «Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en
          Cristo Jesús.»
        </p>
        <p className="mt-6 text-sm text-gold-light">Filipenses 4:7</p>
      </div>
    </section>
    <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-24 md:grid-cols-3">
      {PILLARS.map((pillar) => (
        <article key={pillar.title} className="rounded-3xl border border-teal/10 bg-surface p-6 shadow-card">
          <h2 className="font-display text-xl text-teal">{pillar.title}</h2>
          <p className="mt-2 text-sm text-ink/65">{pillar.body}</p>
        </article>
      ))}
    </section>
  </main>
);

export default HomePage;
