import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import { getPoles, getServices } from '@/lib/data'
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
    title: t.poles.metaTitle,
    description: t.poles.metaDescription,
    alternates: {
      canonical: `/${currentLocale}/expertises`,
      languages: {
        fr: '/fr/expertises',
        en: '/en/expertises',
        'x-default': '/fr/expertises',
      },
    },
  }
}

export default async function ExpertisesPage({ params }: PageProps) {
  const { locale } = await params
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr'
  const t = getDictionary(currentLocale)

  const poles = await getPoles(currentLocale)
  const allServices = await getServices(undefined, currentLocale)

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* ── EN-TÊTE DE SECTION ── */}
        <section className="py-24 border-b border-[var(--border-subtle)] relative overflow-hidden">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <div className="container-v4 relative z-10 max-w-4xl">
            <Kicker>{t.poles.kicker}</Kicker>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-3 mb-6">
              {t.poles.title}
            </h1>
            <p className="text-lg md:text-xl text-[var(--ink-muted)] leading-relaxed font-light">
              {t.poles.lead}
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
                          {t.poles.divisionBadge}
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
                      href={`/${currentLocale}/expertises/${pole.slug}`}
                      className="btn-v4-secondary self-start shrink-0 inline-flex items-center gap-2"
                    >
                      {t.poles.poleDetails} <span>→</span>
                    </Link>
                  </div>

                  {/* Grille des services rattachés */}
                  <div>
                    <h3 className="text-xs uppercase tracking-wider font-mono text-[var(--ink-muted)] mb-4">
                      {t.poles.servicesTitle}
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
                          <span className="text-[10px] font-mono text-[var(--blue-cyan)] uppercase">
                            {srv.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lien direct pour solliciter ce pôle */}
                  <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs text-[var(--ink-muted)]">
                      {t.common.talkAboutProject} : <strong>{pole.name}</strong>
                    </span>
                    <Link
                      href={`/${currentLocale}/contact?pole=${pole.slug}&type=devis`}
                      className="text-xs font-mono text-[var(--blue-cyan)] hover:underline inline-flex items-center gap-1.5"
                    >
                      {t.common.requestQuote} <span>→</span>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
