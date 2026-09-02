// apps/web/app/page.tsx
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Ornament } from '@/components/brand/Ornament';

const PILLARS = [
  {
    n: '01',
    title: 'Estudios',
    body: 'Lecciones para crecer con tu grupo, a un ritmo que cabe en la semana.',
  },
  {
    n: '02',
    title: 'Pastoreo',
    body: 'Notas espirituales y acompañamiento, lejos del ruido de un tablero genérico.',
  },
  {
    n: '03',
    title: 'Alabanza',
    body: 'Repertorio, ensayos y la escuela de adoración, con la misma casa visual.',
  },
];

const HomePage = () => (
  <main className="wash min-h-screen overflow-hidden">
    <header className="mx-auto flex max-w-content items-center justify-between px-6 py-7">
      <Logo />
      <div className="flex items-center gap-5">
        <Link href="/login" className="hidden text-sm text-accent sm:inline">
          Entrar
        </Link>
        <Link href="/register" className="btn-grace text-sm">
          Crear cuenta
        </Link>
      </div>
    </header>

    <section className="mx-auto grid max-w-content items-end gap-10 px-6 pb-16 pt-4 lg:grid-cols-[1.15fr_0.85fr] lg:pb-24 lg:pt-10">
      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold-d">Una casa para la Palabra</p>
        <h1 className="hero-display mt-5 text-dark">
          Paz que
          <br />
          forma
          <br />
          discípulos.
        </h1>
        <Ornament className="my-7 max-w-sm" />
        <p className="max-w-md text-[17px] leading-relaxed text-muted">
          Centro de Gracia es el espacio digital de Centro Misionero Shalom: estudio, devocional cotidiano y ministerio,
          con el tono de un cuaderno pastoral.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link href="/login" className="btn-grace">
            Entrar a la casa
          </Link>
          <Link href="/register" className="text-sm font-medium text-accent underline decoration-gold underline-offset-4">
            Soy nuevo en la iglesia
          </Link>
        </div>
      </div>
      <blockquote className="sheet--verse verse-mark tilt-a">
        «Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo
        Jesús.»
        <cite className="mt-6 block text-sm not-italic tracking-[0.14em] text-gold-d">FILIPENSES 4:7</cite>
      </blockquote>
    </section>

    <section className="mx-auto max-w-content px-6 pb-24">
      <Ornament label="Tres caminos" className="mb-10" />
      <div className="grid items-start gap-6 md:grid-cols-3">
        {PILLARS.map((pillar, index) => (
          <article
            key={pillar.title}
            className={`sheet ${index === 1 ? 'tilt-b md:mt-8' : index === 2 ? 'tilt-a md:mt-3' : ''}`}
          >
            <p className="font-display text-3xl text-gold">{pillar.n}</p>
            <h2 className="mt-3 font-display text-2xl text-dark">{pillar.title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{pillar.body}</p>
          </article>
        ))}
      </div>
    </section>
  </main>
);

export default HomePage;
