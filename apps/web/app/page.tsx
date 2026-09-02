// apps/web/app/page.tsx
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Logo } from '@/components/brand/Logo';
import { Ornament } from '@/components/brand/Ornament';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

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
  <main className={styles.page}>
    <header className={styles.header}>
      <Logo />
      <div className={styles.nav}>
        <Link href="/login" className={styles.login}>
          Entrar
        </Link>
        <Link href="/register">
          <Button>Crear cuenta</Button>
        </Link>
      </div>
    </header>

    <section className={styles.hero}>
      <div>
        <p className={styles.kicker}>Una casa para la Palabra</p>
        <h1 className={styles.title}>
          Paz que
          <br />
          forma
          <br />
          discípulos.
        </h1>
        <Ornament className={styles.rule} />
        <p className={styles.lead}>
          Centro de Gracia es el espacio digital de Centro Misionero Shalom: estudio, devocional cotidiano y ministerio,
          con el tono de un cuaderno pastoral.
        </p>
        <div className={styles.cta}>
          <Link href="/login">
            <Button>Entrar a la casa</Button>
          </Link>
          <Link href="/register" className={styles.quiet}>
            Soy nuevo en la iglesia
          </Link>
        </div>
      </div>
      <blockquote className={styles.verse}>
        «Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo
        Jesús.»
        <cite className={styles.cite}>FILIPENSES 4:7</cite>
      </blockquote>
    </section>

    <section className={styles.pillars}>
      <Ornament label="Tres caminos" className={styles.pillarRule} />
      <div className={styles.grid}>
        {PILLARS.map((pillar, index) => (
          <article
            key={pillar.title}
            className={`${styles.card} ${index === 1 ? styles.shift : ''}`}
            style={{ '--enter-delay': `${index * 60}ms` } as CSSProperties}
          >
            <p className={styles.num}>{pillar.n}</p>
            <h2 className={styles.cardTitle}>{pillar.title}</h2>
            <p className={styles.cardBody}>{pillar.body}</p>
          </article>
        ))}
      </div>
    </section>
  </main>
);

export default HomePage;
