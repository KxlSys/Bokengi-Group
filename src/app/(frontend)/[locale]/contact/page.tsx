import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import { ContactForm } from '@/components/bokengi/ContactForm'
import { CalBooking } from '@/components/bokengi/CalBooking'
import { siteConfig } from '@/config/site'
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
    title: t.contact.metaTitle,
    description: t.contact.metaDescription,
    alternates: {
      canonical: `/${currentLocale}/contact`,
      languages: {
        fr: '/fr/contact',
        en: '/en/contact',
        'x-default': '/fr/contact',
      },
    },
  }
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr'
  const t = getDictionary(currentLocale)

  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: t.contact.metaTitle,
    description: t.contact.metaDescription,
    url: `${siteConfig.domains.production}/${currentLocale}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.domains.production,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: siteConfig.contact.email,
        availableLanguage: ['French', 'English'],
      },
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* ── EN-TÊTE DE LA PAGE CONTACT ── */}
        <section className="py-24 border-b border-[var(--border-subtle)] relative overflow-hidden">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <div className="container-v4 relative z-10 max-w-4xl">
            <Kicker>{t.contact.kicker}</Kicker>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-3 mb-6">
              {t.contact.title}
            </h1>
            <p className="text-lg md:text-xl text-[var(--ink-muted)] leading-relaxed font-light">
              {t.contact.lead}
            </p>
          </div>
        </section>

        {/* ── SECTION CONTACT (2 COLONNES) ── */}
        <section className="py-20 relative overflow-hidden">
          <div className="pattern-dotted-contact" aria-hidden="true" />
          <div className="container-v4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Colonne gauche : Coordonnées, Garanties & Emplacement Cal.com */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <Kicker>{t.contact.directExchangeKicker}</Kicker>
                  <h2 className="text-2xl font-bold text-[var(--ink-heading)] mt-2 mb-4">
                    {t.contact.directExchangeTitle}
                  </h2>
                  <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                    {t.contact.directExchangeLead}
                  </p>
                </div>

                {/* Carte de coordonnées officielles */}
                <div className="p-6 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                  <h3 className="text-xs uppercase font-mono tracking-wider text-[var(--blue-cyan)] font-bold">
                    {t.contact.officialCoordinates}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="block text-xs text-[var(--ink-muted)] font-mono uppercase">
                        {t.contact.officialEmail}
                      </span>
                      <a
                        href="mailto:contact@bokengi-group.com"
                        className="font-mono text-sm text-[var(--blue-cyan)] hover:underline font-medium"
                      >
                        contact@bokengi-group.com
                      </a>
                    </div>
                    <div>
                      <span className="block text-xs text-[var(--ink-muted)] font-mono uppercase">
                        {t.contact.phone}
                      </span>
                      <a
                        href="tel:+33758888434"
                        className="font-mono text-sm text-[var(--ink-heading)] hover:text-[var(--blue-cyan)] transition-colors"
                      >
                        +33 7 58 88 84 34
                      </a>
                    </div>
                    <div className="pt-2 border-t border-[var(--border-subtle)]">
                      <span className="block text-xs text-[var(--ink-muted)] font-mono uppercase">
                        {t.contact.headquarters}
                      </span>
                      <strong className="text-[var(--ink-heading)] block font-medium">
                        {t.contact.headquartersCity}
                      </strong>
                    </div>
                    <div className="pt-2 border-t border-[var(--border-subtle)]">
                      <span className="block text-xs text-[var(--ink-muted)] font-mono uppercase">
                        {t.contact.coverageZone}
                      </span>
                      <span className="text-[var(--ink-heading)] block text-xs">
                        {t.contact.coverageCountries}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Module Cal.com (Réservation d'échange direct) */}
                <CalBooking />
              </div>

              {/* Colonne droite : Formulaire de contact / devis officiel */}
              <div className="lg:col-span-7">
                <Suspense
                  fallback={
                    <div className="p-12 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center text-sm text-[var(--ink-muted)]">
                      {t.common.loading}...
                    </div>
                  }
                >
                  <ContactForm />
                </Suspense>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
