import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import { getPoles, getServices } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Nos Expertises · Les 5 Pôles d\'Ingénierie & Services — Bokengi Group',
  description:
    'Explorez l\'ensemble des expertises de Bokengi Group : IT & Cybersécurité, Digital & Web, Business & ERP, Consulting Stratégique et Solutions Événementielles.',
}

export default async function ExpertisesPage() {
  const poles = await getPoles()
  const allServices = await getServices()

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]">
      <Navbar />

      <main className="flex-1">
        {/* ── EN-TÊTE DE SECTION ── */}
        <section className="py-24 border-b border-[var(--border-subtle)] relative overflow-hidden">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <div className="container-v4 relative z-10 max-w-4xl">
            <Kicker>DIVISIONS OPÉRATIONNELLES</Kicker>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-3 mb-6">
              Cinq expertises pointues. Une exigence commune.
            </h1>
            <p className="text-lg md:text-xl text-[var(--ink-muted)] leading-relaxed font-light">
              Bokengi Group structure son offre autour de 5 divisions complémentaires capables d\'intervenir de façon autonome ou concertée pour répondre à vos impératifs de performance et de sécurité.
            </p>
          </div>
        </section>

        {/* ── CATALOGUE DÉTAILLÉ DES 5 PÔLES ── */}
        <section className="py-20">
          <div className="container-v4 space-y-16">
            {poles.map((pole) => {
              const poleServices = allServices.filter((s) => s.poleSlug === pole.slug)

              return (
                <div
                  key={pole.slug}
                  id={pole.slug}
                  className="p-8 md:p-10 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 mb-8 border-b border-[var(--border-subtle)]">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="font-mono text-base font-bold text-[var(--blue-cyan)]">
                          PÔLE {pole.num}
                        </span>
                        <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] text-[var(--ink-muted)] border border-[var(--border-subtle)]">
                          Division Active
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--ink-heading)] tracking-tight">
                        {pole.name}
                      </h2>
                      <p className="text-sm font-mono text-[var(--blue-cyan)] mt-1">
                        {pole.domains}
                      </p>
                      <p className="text-base text-[var(--ink-muted)] mt-4 max-w-3xl leading-relaxed">
                        {pole.description}
                      </p>
                    </div>

                    <Link
                      href={`/expertises/${pole.slug}`}
                      className="btn-v4-secondary self-start shrink-0 inline-flex items-center gap-2"
                    >
                      Détails du pôle <span>→</span>
                    </Link>
                  </div>

                  {/* Grille des services rattachés */}
                  <div>
                    <h3 className="text-xs uppercase tracking-wider font-mono text-[var(--ink-muted)] mb-4">
                      Services & Domaines de prestation
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {poleServices.map((srv) => (
                        <div
                          key={srv.slug}
                          className="p-4 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] flex flex-col justify-between"
                        >
                          <div>
                            <h4 className="text-sm font-bold text-[var(--ink-heading)] mb-2">
                              {srv.title}
                            </h4>
                            <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-3">
                              {srv.shortDescription}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1 pt-2 border-t border-[var(--border-subtle)]">
                            {srv.technicalTags.slice(0, 2).map((t) => (
                              <span
                                key={t.tag}
                                className="text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] bg-[var(--bg-surface)] text-[var(--ink-muted)]"
                              >
                                {t.tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── BANNIÈRE D'APPEL À L'ACTION ── */}
        <section className="py-16 bg-[var(--bg-surface)]/50 border-t border-[var(--border-subtle)]">
          <div className="container-v4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-[var(--ink-heading)]">
                Un besoin spécifique nécessitant plusieurs pôles ?
              </h3>
              <p className="text-sm text-[var(--ink-muted)] mt-1">
                Nos directeurs de pôles orchestrent une proposition technique sur-mesure sous 48h.
              </p>
            </div>
            <Link href="/contact?type=cadrage" className="btn-v4-primary shrink-0">
              Demander un cadrage de projet →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
