import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import { getCaseStudies } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Réalisations & Études de Cas · Projets Déployés — Bokengi Group',
  description:
    'Découvrez les 5 réalisations d\'ingénierie majeures de Bokengi Group : ESIIKA, Portail Kongama, Kongama Academy, BisoMapTech et FleetGuard.',
}

export default async function RealisationsPage() {
  const cases = await getCaseStudies()

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]">
      <Navbar />

      <main className="flex-1">
        {/* ── EN-TÊTE RÉALISATIONS ── */}
        <section className="py-24 border-b border-[var(--border-subtle)] relative overflow-hidden">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <div className="container-v4 relative z-10 max-w-4xl">
            <Kicker>PORTFOLIO & ÉTUDES DE CAS</Kicker>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-3 mb-6">
              Des architectures déployées, éprouvées et mesurables.
            </h1>
            <p className="text-lg md:text-xl text-[var(--ink-muted)] leading-relaxed font-light">
              Chaque projet mené par Bokengi Group répond à un cahier des charges rigoureux : résilience face aux contraintes réseaux, sécurité dès la conception (Security by Design), maîtrise des coûts d\'exploitation et transfert d\'autonomie.
            </p>
          </div>
        </section>

        {/* ── LISTE COMPLÈTE DES 5 CASE STUDIES OFFICIELS ── */}
        <section className="py-20">
          <div className="container-v4 space-y-20">
            {cases.map((cs, idx) => (
              <article
                key={cs.slug}
                id={cs.slug}
                className="p-8 md:p-12 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors"
              >
                {/* Header du projet */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-8 mb-8 border-b border-[var(--border-subtle)]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-mono text-xs font-bold text-[var(--blue-cyan)]">
                        PROJET 0{idx + 1}
                      </span>
                      <span className="text-xs text-[var(--ink-muted)]">/</span>
                      <span className="text-xs font-mono uppercase text-[var(--blue-cyan)]">
                        {cs.category}
                      </span>
                      <span className="text-xs text-[var(--ink-muted)]">/</span>
                      <span className="text-xs font-mono text-[var(--ink-muted)]">
                        {cs.publishedDate ? cs.publishedDate.substring(0, 4) : '2025'}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-1">
                      {cs.title}
                    </h2>
                    <p className="text-sm font-mono text-[var(--ink-muted)] mt-2">
                      Client / Cadre : <strong className="text-[var(--ink-heading)]">{cs.clientName}</strong>
                    </p>
                  </div>
                </div>

                {/* Résumé exécutif */}
                <div className="mb-10">
                  <h3 className="text-xs uppercase tracking-wider font-mono text-[var(--blue-cyan)] mb-2">
                    Résumé exécutif
                  </h3>
                  <p className="text-base text-[var(--ink-heading)] leading-relaxed font-medium">
                    {cs.summary}
                  </p>
                </div>

                {/* Grille Contexte / Défi / Solution / Résultats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  {/* Contexte & Problématique */}
                  <div className="p-6 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)]/50 border border-[var(--border-subtle)]">
                    <h4 className="text-sm font-bold text-[var(--ink-heading)] mb-2 flex items-center gap-2">
                      <span className="text-[var(--blue-cyan)] font-mono">01.</span> Contexte & Problématique
                    </h4>
                    <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                      {cs.context}
                    </p>
                  </div>

                  {/* Défi technique */}
                  <div className="p-6 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)]/50 border border-[var(--border-subtle)]">
                    <h4 className="text-sm font-bold text-[var(--ink-heading)] mb-2 flex items-center gap-2">
                      <span className="text-[var(--blue-cyan)] font-mono">02.</span> Défi technique & opérationnel
                    </h4>
                    <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                      {cs.challenge}
                    </p>
                  </div>

                  {/* Solution Bokengi */}
                  <div className="p-6 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)]/50 border border-[var(--border-subtle)]">
                    <h4 className="text-sm font-bold text-[var(--ink-heading)] mb-2 flex items-center gap-2">
                      <span className="text-[var(--blue-cyan)] font-mono">03.</span> Solution déployée
                    </h4>
                    <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                      {cs.solution}
                    </p>
                  </div>

                  {/* Résultats & Impact */}
                  <div className="p-6 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)]/50 border border-[var(--border-subtle)]">
                    <h4 className="text-sm font-bold text-[var(--ink-heading)] mb-2 flex items-center gap-2">
                      <span className="text-[var(--blue-cyan)] font-mono">04.</span> Résultats & Indicateurs
                    </h4>
                    <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-3">
                      {cs.results}
                    </p>
                    {cs.resultsList && cs.resultsList.length > 0 && (
                      <ul className="space-y-1.5 text-xs text-[var(--ink-heading)] font-mono">
                        {cs.resultsList.map((item, rIdx) => (
                          <li key={rIdx} className="flex items-baseline gap-2">
                            <span className="text-[var(--blue-cyan)] font-bold">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Architecture technique & Technologies harmonisées */}
                <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="text-xs font-mono uppercase text-[var(--ink-muted)] mb-2">
                      Stack technique harmonisée
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cs.technologies.map((t) => (
                        <span
                          key={t.name}
                          className="px-2.5 py-1 text-xs font-mono rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] text-[var(--ink-heading)] border border-[var(--border-subtle)] font-semibold"
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {cs.architecture && (
                    <div className="max-w-md text-xs text-[var(--ink-muted)] border-l-2 border-[var(--blue-cyan)] pl-4">
                      <strong className="block text-[var(--ink-heading)] font-mono uppercase mb-1">Architecture :</strong>
                      {cs.architecture}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── CTA TECHNIQUE ── */}
        <section className="py-20 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/30">
          <div className="container-v4 text-center max-w-3xl mx-auto">
            <Kicker>VOTRE PROJET</Kicker>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--ink-heading)] mt-2 mb-4">
              Un projet d\'ingénierie similaire à concevoir ?
            </h2>
            <p className="text-base text-[var(--ink-muted)] mb-8 leading-relaxed">
              Consultez notre équipe technique pour analyser la faisabilité, l\'architecture cible et les délais de réalisation.
            </p>
            <Link href="/contact?type=devis" className="btn-v4-primary">
              Échanger avec notre direction technique →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
