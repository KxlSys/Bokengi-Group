import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import { getPoles, getPoleBySlug, getServices } from '@/lib/data'
import { siteConfig } from '@/config/site'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/types'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const poles = await getPoles('fr')
  const locales: Locale[] = ['fr', 'en']
  const params: Array<{ locale: string; slug: string }> = []

  for (const loc of locales) {
    for (const pole of poles) {
      params.push({ locale: loc, slug: pole.slug })
    }
  }

  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr'
  const t = getDictionary(currentLocale)
  const pole = await getPoleBySlug(slug, currentLocale)

  if (!pole) {
    return {
      title: `${t.errors.notFoundTitle} · Bokengi Group`,
    }
  }

  const ogLocale = currentLocale === 'en' ? 'en_US' : 'fr_FR'

  return {
    title: pole.seo.title,
    description: pole.seo.description,
    alternates: {
      canonical: `/${currentLocale}/expertises/${pole.slug}`,
      languages: {
        fr: `/fr/expertises/${pole.slug}`,
        en: `/en/expertises/${pole.slug}`,
        'x-default': `/fr/expertises/${pole.slug}`,
      },
    },
    openGraph: {
      title: pole.seo.title,
      description: pole.seo.description,
      url: `${siteConfig.domains.production}/${currentLocale}/expertises/${pole.slug}`,
      siteName: siteConfig.name,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: pole.name,
        },
      ],
      locale: ogLocale,
    },
  }
}

export default async function PoleDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr'
  const t = getDictionary(currentLocale)
  const pole = await getPoleBySlug(slug, currentLocale)

  if (!pole) {
    notFound()
  }

  const allPoles = await getPoles(currentLocale)
  const services = await getServices(slug, currentLocale)

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: pole.name,
    description: pole.description,
    url: `${siteConfig.domains.production}/${currentLocale}/expertises/${pole.slug}`,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.domains.production,
    },
    serviceType: pole.domains,
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* ── EN-TÊTE DU PÔLE SPÉCIFIQUE ── */}
        <section className="py-24 border-b border-[var(--border-subtle)] relative overflow-hidden">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <div className="container-v4 relative z-10 max-w-4xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs font-bold text-[var(--blue-cyan)]">
                PÔLE {pole.num}
              </span>
              <span className="text-xs text-[var(--ink-muted)]">/</span>
              <Link href={`/${currentLocale}/expertises`} className="text-xs font-mono text-[var(--ink-muted)] hover:underline">
                {t.nav.expertises.toUpperCase()}
              </Link>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-3 mb-4">
              {pole.name}
            </h1>
            <p className="text-sm font-mono text-[var(--blue-cyan)] mb-6">
              {pole.domains}
            </p>
            <p className="text-lg md:text-xl text-[var(--ink-muted)] leading-relaxed font-light">
              {pole.description}
            </p>
          </div>
        </section>

        {/* ── CATALOGUE DES PRESTATIONS DU PÔLE ── */}
        <section className="py-20">
          <div className="container-v4">
            <div className="max-w-2xl mb-12">
              <Kicker>{t.poles.servicesTitle.toUpperCase()}</Kicker>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-2">
                {t.poles.servicesTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((srv) => (
                <div
                  key={srv.slug}
                  className="p-6 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between hover:border-[var(--border-medium)] transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-mono text-[var(--blue-cyan)] uppercase mb-2 block">
                      {srv.category}
                    </span>
                    <h3 className="text-lg font-bold text-[var(--ink-heading)] mb-2">
                      {srv.title}
                    </h3>
                    <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-4">
                      {srv.shortDescription}
                    </p>
                  </div>
                  <Link
                    href={`/${currentLocale}/contact?pole=${pole.slug}&type=devis`}
                    className="text-xs font-mono text-[var(--blue-cyan)] hover:underline inline-flex items-center gap-1 mt-auto"
                  >
                    {t.common.requestQuote} <span>→</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BANDEAU DE CONTACT DIRECT DU PÔLE ── */}
        <section className="py-16 bg-[var(--bg-surface)]/60 border-t border-[var(--border-subtle)]">
          <div className="container-v4 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-[var(--ink-heading)] mb-1">
                {t.home.ctaTitle}
              </h3>
              <p className="text-sm text-[var(--ink-muted)]">
                {t.home.ctaLead}
              </p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0">
              <Link
                href={`/${currentLocale}/contact?pole=${pole.slug}&type=devis`}
                className="btn-v4-primary"
              >
                {t.home.ctaBtnPrimary} →
              </Link>
              <Link
                href={`/${currentLocale}/contact?pole=${pole.slug}&type=cadrage`}
                className="btn-v4-secondary"
              >
                {t.common.scheduleCall}
              </Link>
            </div>
          </div>
        </section>

        {/* ── AUTRES PÔLES DU GROUPE ── */}
        <section className="py-16 border-t border-[var(--border-subtle)]">
          <div className="container-v4">
            <h4 className="text-xs uppercase tracking-wider font-mono text-[var(--ink-muted)] mb-6">
              {t.poles.allPoles}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {allPoles
                .filter((p) => p.slug !== pole.slug)
                .map((p) => (
                  <Link
                    key={p.slug}
                    href={`/${currentLocale}/expertises/${p.slug}`}
                    className="p-4 rounded-[var(--radius-xs)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors"
                  >
                    <span className="font-mono text-xs text-[var(--blue-cyan)] font-bold block mb-1">
                      {p.num}
                    </span>
                    <strong className="text-sm font-bold text-[var(--ink-heading)] block">
                      {p.name}
                    </strong>
                    <span className="text-[11px] text-[var(--ink-muted)] block truncate mt-1">
                      {p.domains}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
