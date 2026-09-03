import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { Navbar } from '@/components/bokengi/Navbar'
import { HeroV4 } from '@/components/bokengi/HeroV4'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import { getPoles, getCaseStudies, getServices } from '@/lib/data'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Bokengi Group · Ingénierie, Technologies & Services Professionnels',
  description:
    'Bokengi Group réunit cinq expertises technologiques et multisectorielles : Bokengi IT, Bokengi Digital, Bokengi Business, Bokengi Consulting et Bokengi Events.',
}

export default async function HomePage() {
  const poles = await getPoles()
  const featuredCases = await getCaseStudies(true)
  const itServices = await getServices('it')

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]">
      <Navbar />

      <main className="flex-1">
        {/* ── 01 HERO SECTION V4 OFFICIELLE ── */}
        <HeroV4 />

        {/* ── 02 BANDEAU D'ALIGNEMENT INSTITUTIONNEL ── */}
        <section className="py-12 border-y border-[var(--border-subtle)] bg-[var(--bg-surface)]/40">
          <div className="container-v4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="font-mono text-3xl font-bold text-[var(--blue-cyan)] mb-1">05</div>
                <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">Pôles Intégrés</div>
              </div>
              <div>
                <div className="font-mono text-3xl font-bold text-[var(--blue-cyan)] mb-1">100%</div>
                <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">Souveraineté & Contrôle</div>
              </div>
              <div>
                <div className="font-mono text-3xl font-bold text-[var(--blue-cyan)] mb-1">&lt; 1.2s</div>
                <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">Performance Web Vitals</div>
              </div>
              <div>
                <div className="font-mono text-3xl font-bold text-[var(--blue-cyan)] mb-1">24/7</div>
                <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">Supervision & MCO</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 03 LES 5 PÔLES D'EXPERTISE V4 ── */}
        <section className="py-24 relative overflow-hidden">
          <div className="container-v4">
            <div className="mb-14">
              <Kicker>NOS EXPERTISES</Kicker>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-2 max-w-2xl">
                Des compétences complémentaires. Une même exigence technique.
              </h2>
            </div>

            <div className="flex flex-col border-t border-[var(--border-subtle)]">
              {poles.map((pole) => (
                <Link
                  key={pole.slug}
                  href={`/expertises/${pole.slug}`}
                  className="group flex flex-col md:flex-row md:items-center justify-between py-6 px-4 border-b border-[var(--border-subtle)] transition-colors hover:bg-[var(--bg-surface)]"
                >
                  <div className="flex items-baseline gap-6 mb-2 md:mb-0">
                    <span className="font-mono text-sm text-[var(--blue-cyan)] font-bold">
                      {pole.num}
                    </span>
                    <strong className="text-lg md:text-xl font-bold text-[var(--ink-heading)] group-hover:text-[var(--blue-cyan)] transition-colors">
                      {pole.name}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <span className="text-sm text-[var(--ink-muted)]">
                      {pole.domains}
                    </span>
                    <span className="text-[var(--blue-cyan)] font-mono transform group-hover:translate-x-2 transition-transform">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 04 FOCUS BOKENGI IT (CŒUR TECHNOLOGIQUE INSTITUTIONNEL) ── */}
        <section className="py-24 bg-[var(--bg-surface)]/60 border-y border-[var(--border-subtle)] relative">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <div className="container-v4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5">
                <Kicker>PÔLE TECHNOLOGIQUE PRINCIPAL</Kicker>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-2 mb-4">
                  BOKENGI IT
                </h2>
                <p className="text-base text-[var(--ink-muted)] mb-8 leading-relaxed">
                  Infrastructures critiques, cybersécurité offensive/défensive et systèmes au service de la continuité absolue de vos activités.
                </p>
                <Link
                  href="/expertises/it"
                  className="btn-v4-primary inline-flex items-center gap-2"
                >
                  Découvrir Bokengi IT <span>→</span>
                </Link>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {itServices.map((srv, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-[var(--radius-md)] bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors"
                  >
                    <h3 className="text-base font-bold text-[var(--ink-heading)] mb-2">
                      {srv.title}
                    </h3>
                    <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                      {srv.shortDescription}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 05 RÉALISATIONS & ÉTUDES DE CAS ── */}
        <section className="py-24">
          <div className="container-v4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
              <div>
                <Kicker>RÉALISATIONS & ÉTUDES DE CAS</Kicker>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-2">
                  Des architectures déployées avec rigueur.
                </h2>
              </div>
              <Link href="/realisations" className="btn-v4-secondary self-start md:self-auto">
                Voir toutes les réalisations →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCases.slice(0, 3).map((item) => (
                <div
                  key={item.slug}
                  className="p-6 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between hover:border-[var(--border-medium)] transition-colors"
                >
                  <div>
                    <div className="text-xs font-mono text-[var(--blue-cyan)] mb-3">
                      {item.category}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--ink-heading)] mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[var(--ink-muted)] mb-6 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--border-subtle)]">
                      {item.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech.name}
                          className="px-2 py-1 text-xs font-mono rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] text-[var(--ink-heading)] border border-[var(--border-subtle)]"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 06 CTA INSTITUTIONNEL ── */}
        <section className="py-20 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/30">
          <div className="container-v4 text-center max-w-3xl mx-auto">
            <Kicker>ENGAGER UN PROJET</Kicker>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--ink-heading)] mt-2 mb-4">
              Prêt à structurer votre prochain défi technologique ?
            </h2>
            <p className="text-base text-[var(--ink-muted)] mb-8 leading-relaxed">
              Nos ingénieurs et consultants étudient votre besoin sous 24 à 48h ouvrées. Échange confidentiel et cadrage précis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact?type=devis" className="btn-v4-primary">
                Demander un devis ou cadrage →
              </Link>
              <Link href="/groupe" className="btn-v4-secondary">
                En savoir plus sur le Groupe
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
