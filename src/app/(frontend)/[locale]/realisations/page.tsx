import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import { getCaseStudies } from '@/lib/data'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/types'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr'
  const t = getDictionary(currentLocale)

  return {
    title: t.caseStudies.metaTitle,
    description: t.caseStudies.metaDescription,
    alternates: {
      canonical: `/${currentLocale}/realisations`,
      languages: {
        fr: '/fr/realisations',
        en: '/en/realisations',
        'x-default': '/fr/realisations',
      },
    },
  }
}

export default async function RealisationsPage({ params }: PageProps) {
  const { locale } = await params
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr'
  const t = getDictionary(currentLocale)

  const cases = await getCaseStudies(false, currentLocale)

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* ── EN-TÊTE RÉALISATIONS ── */}
        <section className="py-24 border-b border-[var(--border-subtle)] relative overflow-hidden">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <div className="container-v4 relative z-10 max-w-4xl">
            <Kicker>{t.caseStudies.kicker}</Kicker>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-3 mb-6">
              {t.caseStudies.title}
            </h1>
            <p className="text-lg md:text-xl text-[var(--ink-muted)] leading-relaxed font-light">
              {t.caseStudies.lead}
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
                        {cs.slug === 'esiika' ? '2026' : (cs.publishedDate ? cs.publishedDate.substring(0, 4) : '2026')}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-1">
                      {cs.title}
                    </h2>
                    <p className="text-sm font-mono text-[var(--ink-muted)] mt-2">
                      {t.caseStudies.contextLabel} : <strong className="text-[var(--ink-heading)]">{cs.clientName}</strong>
                    </p>
                  </div>
                </div>

                {/* Résumé exécutif */}
                <div className="mb-10">
                  <h3 className="text-xs uppercase tracking-wider font-mono text-[var(--blue-cyan)] mb-2">
                    {t.caseStudies.executiveSummary}
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
                      <span className="text-[var(--blue-cyan)] font-mono">01.</span> {t.caseStudies.contextTitle}
                    </h4>
                    <p className="text-sm text-[var(--ink-muted)] leading-relaxed whitespace-pre-line">
                      {cs.context}
                    </p>
                  </div>

                  {/* Défi technique */}
                  <div className="p-6 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)]/50 border border-[var(--border-subtle)]">
                    <h4 className="text-sm font-bold text-[var(--ink-heading)] mb-2 flex items-center gap-2">
                      <span className="text-[var(--blue-cyan)] font-mono">02.</span> {t.caseStudies.challengeTitle}
                    </h4>
                    <p className="text-sm text-[var(--ink-muted)] leading-relaxed whitespace-pre-line">
                      {cs.challenge}
                    </p>
                  </div>

                  {/* Solution mise en œuvre */}
                  <div className="p-6 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)]/50 border border-[var(--border-subtle)]">
                    <h4 className="text-sm font-bold text-[var(--ink-heading)] mb-2 flex items-center gap-2">
                      <span className="text-[var(--blue-cyan)] font-mono">03.</span> {t.caseStudies.solutionTitle}
                    </h4>
                    <p className="text-sm text-[var(--ink-muted)] leading-relaxed whitespace-pre-line">
                      {cs.solution}
                    </p>
                  </div>

                  {/* Résultats & Métriques vérifiées */}
                  <div className="p-6 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)]/50 border border-[var(--border-subtle)]">
                    <h4 className="text-sm font-bold text-[var(--ink-heading)] mb-2 flex items-center gap-2">
                      <span className="text-[var(--blue-cyan)] font-mono">04.</span> {t.caseStudies.resultsTitle}
                    </h4>
                    <p className="text-sm text-[var(--ink-muted)] leading-relaxed whitespace-pre-line">
                      {cs.results}
                    </p>
                  </div>
                </div>

                {/* Architecture & Technologies utilisées */}
                <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-mono text-[var(--ink-muted)] mb-3">
                      {t.caseStudies.technologiesTitle}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cs.technologies.map((tech) => (
                        <span
                          key={tech.name}
                          className="px-2.5 py-1 text-xs font-mono rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--ink-muted)] font-semibold"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {cs.architecture && (
                    <div className="max-w-md text-xs text-[var(--ink-muted)] border-l-2 border-[var(--blue-cyan)] pl-4">
                      <strong className="block text-[var(--ink-heading)] font-mono uppercase mb-1">
                        {t.caseStudies.architectureTitle} :
                      </strong>
                      {cs.architecture}
                    </div>
                  )}
                </div>

                {/* CTA Contact direct relatif à ce type de projet */}
                <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-[var(--ink-muted)]">
                    {t.common.talkAboutProject}
                  </span>
                  <Link
                    href={`/${currentLocale}/contact?type=devis`}
                    className="btn-v4-secondary text-xs inline-flex items-center gap-1.5"
                  >
                    {t.common.requestQuote} <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
