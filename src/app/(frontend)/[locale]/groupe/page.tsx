import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import { getPoles } from '@/lib/data'
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
    title: t.about.metaTitle,
    description: t.about.metaDescription,
    alternates: {
      canonical: `/${currentLocale}/groupe`,
      languages: {
        fr: '/fr/groupe',
        en: '/en/groupe',
        'x-default': '/fr/groupe',
      },
    },
  }
}

export default async function GroupePage({ params }: PageProps) {
  const { locale } = await params
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr'
  const t = getDictionary(currentLocale)

  const poles = await getPoles(currentLocale)

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* ── EN-TÊTE INSTITUTIONNEL ── */}
        <section className="py-24 border-b border-[var(--border-subtle)] relative overflow-hidden">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <div className="container-v4 relative z-10 max-w-4xl">
            <Kicker>{t.about.kicker}</Kicker>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-3 mb-6">
              {t.about.title}
            </h1>
            <p className="text-lg md:text-xl text-[var(--ink-muted)] leading-relaxed mb-6 font-light">
              {t.about.lead}
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-[var(--blue-cyan)]">
              <span className="px-3 py-1.5 rounded-[var(--radius-xs)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                {t.about.badgeDivisions}
              </span>
              <span className="px-3 py-1.5 rounded-[var(--radius-xs)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                {t.about.badgeSovereignty}
              </span>
              <span className="px-3 py-1.5 rounded-[var(--radius-xs)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                {t.about.badgeEngineering}
              </span>
            </div>
          </div>
        </section>

        {/* ── NOTRE MISSION & VISION ── */}
        <section className="py-20 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/40">
          <div className="container-v4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <Kicker>{t.about.missionKicker}</Kicker>
                <h3 className="text-2xl font-bold text-[var(--ink-heading)] mt-2 mb-4">
                  {t.about.missionTitle}
                </h3>
                <p className="text-base text-[var(--ink-muted)] leading-relaxed">
                  {t.about.missionText}
                </p>
              </div>

              <div className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <Kicker>{t.about.visionKicker}</Kicker>
                <h3 className="text-2xl font-bold text-[var(--ink-heading)] mt-2 mb-4">
                  {t.about.visionTitle}
                </h3>
                <p className="text-base text-[var(--ink-muted)] leading-relaxed">
                  {t.about.visionText}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── UN MODÈLE EN 5 DIVISIONS SYNERGIQUES ── */}
        <section className="py-24">
          <div className="container-v4">
            <div className="max-w-2xl mb-14">
              <Kicker>{t.about.orgKicker}</Kicker>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-2">
                {t.about.orgTitle}
              </h2>
              <p className="text-base text-[var(--ink-muted)] mt-4 leading-relaxed">
                {t.about.orgLead}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {poles.map((pole) => (
                <div
                  key={pole.slug}
                  className="p-6 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between hover:border-[var(--border-medium)] transition-colors"
                >
                  <div>
                    <div className="font-mono text-sm font-bold text-[var(--blue-cyan)] mb-2">
                      {pole.num}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--ink-heading)] mb-2">
                      {pole.name}
                    </h3>
                    <p className="text-xs font-mono text-[var(--blue-cyan)] mb-4">
                      {pole.domains}
                    </p>
                    <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-6">
                      {pole.shortDescription}
                    </p>
                  </div>
                  <Link
                    href={`/${currentLocale}/expertises/${pole.slug}`}
                    className="text-xs font-mono text-[var(--blue-cyan)] hover:underline inline-flex items-center gap-1 mt-auto"
                  >
                    {t.about.discoverPole} <span>→</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NOS PILIERS MÉTHODOLOGIQUES & VALEURS ── */}
        <section className="py-20 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/20">
          <div className="container-v4">
            <div className="max-w-2xl mb-12">
              <Kicker>{t.about.valuesKicker}</Kicker>
              <h2 className="text-3xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-2">
                {t.about.valuesTitle}
              </h2>
              <p className="text-base text-[var(--ink-muted)] mt-3">
                {t.about.valuesLead}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <div className="text-[var(--blue-cyan)] font-mono text-xl mb-3 font-bold">01</div>
                <h4 className="text-base font-bold text-[var(--ink-heading)] mb-2">{t.about.pillar1Title}</h4>
                <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                  {t.about.pillar1Desc}
                </p>
              </div>

              <div className="p-6 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <div className="text-[var(--blue-cyan)] font-mono text-xl mb-3 font-bold">02</div>
                <h4 className="text-base font-bold text-[var(--ink-heading)] mb-2">{t.about.pillar2Title}</h4>
                <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                  {t.about.pillar2Desc}
                </p>
              </div>

              <div className="p-6 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <div className="text-[var(--blue-cyan)] font-mono text-xl mb-3 font-bold">03</div>
                <h4 className="text-base font-bold text-[var(--ink-heading)] mb-2">{t.about.pillar3Title}</h4>
                <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                  {t.about.pillar3Desc}
                </p>
              </div>

              <div className="p-6 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <div className="text-[var(--blue-cyan)] font-mono text-xl mb-3 font-bold">04</div>
                <h4 className="text-base font-bold text-[var(--ink-heading)] mb-2">{t.about.pillar4Title}</h4>
                <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                  {t.about.pillar4Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── ENGAGEMENT & PRÉSENCE RÉGIONALE ── */}
        <section className="py-20 border-t border-[var(--border-subtle)]">
          <div className="container-v4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Kicker>{t.about.commitmentsKicker}</Kicker>
                <h2 className="text-3xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-2 mb-4">
                  {t.about.commitmentsTitle}
                </h2>
                <p className="text-base text-[var(--ink-muted)] leading-relaxed mb-6">
                  {t.about.commitmentsLead}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href={`/${currentLocale}/contact?type=cadrage`} className="btn-v4-primary inline-flex items-center gap-2">
                    {t.common.scheduleCall} <span>→</span>
                  </Link>
                  <Link href={`/${currentLocale}/realisations`} className="btn-v4-secondary">
                    {t.common.viewAllProjects}
                  </Link>
                </div>
              </div>

              <div className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
                <div>
                  <Kicker>{t.about.presenceKicker}</Kicker>
                  <h3 className="text-xl font-bold text-[var(--ink-heading)] mt-1 mb-2">
                    {t.about.presenceTitle}
                  </h3>
                  <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                    {t.about.presenceLead}
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--ink-muted)]">
                  <span>Siège social : Brazzaville</span>
                  <span>Bureaux : Pointe-Noire · Kinshasa · Paris</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
