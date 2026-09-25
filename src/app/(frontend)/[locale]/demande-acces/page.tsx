import React from 'react'
import type { Metadata } from 'next'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import { AccessRequestForm } from '@/components/bokengi/AccessRequestForm'
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
    title: t.accessRequest.metaTitle,
    description: t.accessRequest.metaDescription,
    alternates: {
      canonical: `/${currentLocale}/demande-acces`,
      languages: {
        fr: '/fr/demande-acces',
        en: '/en/demande-acces',
        'x-default': '/fr/demande-acces',
      },
    },
  }
}

export default async function AccessRequestPage({ params }: PageProps) {
  const { locale } = await params
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr'
  const t = getDictionary(currentLocale)

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* ── EN-TÊTE DU SAS D'ACCÈS ── */}
        <section className="py-20 md:py-28 border-b border-[var(--border-subtle)] relative overflow-hidden">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <div className="container-v4 relative z-10 max-w-3xl text-center mx-auto">
            <Kicker>{t.accessRequest.kicker}</Kicker>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-3 mb-6">
              {t.accessRequest.title}
            </h1>
            <p className="text-lg md:text-xl text-[var(--ink-muted)] leading-relaxed font-light">
              {t.accessRequest.lead}
            </p>
          </div>
        </section>

        {/* ── FORMULAIRE DU SAS ── */}
        <section className="py-16 md:py-24 bg-[var(--bg-card)]/50">
          <div className="container-v4 max-w-2xl mx-auto">
            <div className="p-8 md:p-12 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xl relative overflow-hidden">
              <div className="mb-8 pb-6 border-b border-[var(--border-subtle)]">
                <h2 className="text-xl font-bold text-[var(--ink-heading)] mb-2">
                  {t.accessRequest.protocolTitle}
                </h2>
                <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                  {t.accessRequest.protocolDesc}
                </p>
              </div>

              <AccessRequestForm />
            </div>

            <div className="mt-8 text-center text-xs text-[var(--ink-muted)]">
              {t.accessRequest.securityNotice}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
