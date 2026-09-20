import React from 'react'
import type { Metadata } from 'next'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
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
    title: t.legal.mentionsMetaTitle,
    description: t.legal.mentionsMetaDesc,
    alternates: {
      canonical: `/${currentLocale}/mentions-legales`,
      languages: {
        fr: '/fr/mentions-legales',
        en: '/en/mentions-legales',
        'x-default': '/fr/mentions-legales',
      },
    },
  }
}

export default async function MentionsLegalesPage({ params }: PageProps) {
  const { locale } = await params
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr'
  const t = getDictionary(currentLocale)

  const isEn = currentLocale === 'en'

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* ── EN-TÊTE DE LA PAGE ── */}
        <section className="py-20 border-b border-[var(--border-subtle)] relative overflow-hidden">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <div className="container-v4 relative z-10 max-w-4xl">
            <Kicker>{isEn ? 'LEGAL & REGULATORY FRAMEWORK' : 'CADRE JURIDIQUE & RÉGLEMENTAIRE'}</Kicker>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-3 mb-6">
              {t.legal.mentionsTitle}
            </h1>
            <p className="text-base md:text-lg text-[var(--ink-muted)] leading-relaxed font-light">
              {t.legal.mentionsDesc}
            </p>
          </div>
        </section>

        {/* ── CONTENU DES MENTIONS LÉGALES ── */}
        <section className="py-16">
          <div className="container-v4 max-w-4xl space-y-12">
            {/* 1. Éditeur de la plateforme */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>{t.legal.editorKicker}</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                {t.legal.editorTitle}
              </h2>
              <div className="space-y-3 text-sm text-[var(--ink-body)] leading-relaxed pt-2">
                <p>
                  {isEn ? 'This website accessible at ' : 'Le présent site internet accessible à l’adresse '}
                  <a href={siteConfig.domains.production} className="text-[var(--blue-cyan)] hover:underline">
                    {siteConfig.domains.production}
                  </a>{' '}
                  {isEn
                    ? 'is published and operated by Bokengi Group.'
                    : 'est édité et exploité par Bokengi Group.'}
                </p>
                <ul className="space-y-2.5 pt-2">
                  <li className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="font-mono text-xs text-[var(--ink-muted)] sm:w-48 shrink-0">{isEn ? 'Company Name:' : 'Dénomination :'}</span>
                    <span className="font-semibold text-[var(--ink-heading)]">Bokengi Group</span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="font-mono text-xs text-[var(--ink-muted)] sm:w-48 shrink-0">{isEn ? 'Legal Form:' : 'Forme juridique :'}</span>
                    <span className="font-semibold text-[var(--ink-heading)]">TPE</span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="font-mono text-xs text-[var(--ink-muted)] sm:w-48 shrink-0">{isEn ? 'Share Capital:' : 'Capital social :'}</span>
                    <span className="font-semibold text-[var(--ink-heading)]">7 500 €</span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="font-mono text-xs text-[var(--ink-muted)] sm:w-48 shrink-0">{isEn ? 'Headquarters:' : 'Siège social :'}</span>
                    <span className="font-semibold text-[var(--ink-heading)]">Paris, France</span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="font-mono text-xs text-[var(--ink-muted)] sm:w-48 shrink-0">{isEn ? 'Registration:' : 'Immatriculation (RCS / SIREN) :'}</span>
                    <span className="text-[var(--ink-heading)]">{isEn ? 'Pending registration' : 'En cours d’attribution (procédure d’immatriculation en cours)'}</span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="font-mono text-xs text-[var(--ink-muted)] sm:w-48 shrink-0">{isEn ? 'VAT Number:' : 'N° TVA intracommunautaire :'}</span>
                    <span className="text-[var(--ink-heading)]">{isEn ? 'Pending allocation' : 'En cours d’attribution (demande en cours auprès de l’administration)'}</span>
                  </li>
                </ul>
              </div>
            </article>

            {/* 2. Direction de publication */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>{t.legal.hostingKicker}</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                {t.legal.hostingTitle}
              </h2>
              <div className="space-y-3 text-sm text-[var(--ink-body)] leading-relaxed pt-2">
                <p>
                  <strong>{isEn ? 'Publishing Director:' : 'Directeur de la publication :'}</strong> {isEn ? 'Editorial Direction' : 'Direction éditoriale'}
                </p>
                <p>
                  <strong>{isEn ? 'Editorial Contact:' : 'Contact éditorial :'}</strong>{' '}
                  <a href="mailto:contact@bokengi-group.com" className="text-[var(--blue-cyan)] hover:underline font-mono">
                    contact@bokengi-group.com
                  </a>
                </p>
              </div>
            </article>

            {/* 3. Propriété intellectuelle */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>{t.legal.ipKicker}</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                {t.legal.ipTitle}
              </h2>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                {isEn
                  ? 'All content published on this website (trademarks, logos, technical architectures, source code, visual designs, illustrations) is the exclusive property of Bokengi Group and protected by international intellectual property laws.'
                  : 'L’ensemble des contenus présents sur ce site (marques, logos, architectures techniques, codes sources, chartes graphiques, illustrations) sont la propriété exclusive de Bokengi Group et protégés par les lois internationales sur la propriété intellectuelle.'}
              </p>
            </article>

            {/* 4. Sécurité & Continuité */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>{t.legal.securityKicker}</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                {t.legal.securityTitle}
              </h2>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                {isEn
                  ? 'Bokengi Group implements strict technical and organizational measures (encryption, Zero-Trust network segmentation, proactive vulnerability assessments) to guarantee integrity, confidentiality, and high service availability.'
                  : 'Bokengi Group met en œuvre des mesures techniques et organisationnelles strictes (chiffrement, segmentation Zero-Trust, audits de vulnérabilité continus) pour garantir l’intégrité, la confidentialité et la haute disponibilité de ses services.'}
              </p>
            </article>

            {/* 5. Données personnelles */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>{t.legal.dpoKicker}</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                {t.legal.dpoTitle}
              </h2>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                {isEn
                  ? 'In compliance with applicable data protection regulations (GDPR), you hold the right to access, rectify, or request erasure of your personal data by contacting our Data Protection Officer at contact@bokengi-group.com.'
                  : 'Conformément aux réglementations applicables en matière de protection des données (RGPD), vous disposez d’un droit d’accès, de rectification et d’effacement de vos données personnelles en contactant notre DPO à contact@bokengi-group.com.'}
              </p>
            </article>

            {/* 6. Cookies */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>{t.legal.cookiesKicker}</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                {t.legal.cookiesTitle}
              </h2>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                {isEn
                  ? 'Our platform uses strictly necessary cookies to ensure basic functionality and privacy-respecting, cookieless analytical tools that do not require explicit cookie banners.'
                  : 'Notre plateforme utilise uniquement des cookies strictement nécessaires au fonctionnement technique et des outils de mesure d’audience respectueux de la vie privée sans traçage intrusif.'}
              </p>
            </article>

            {/* 7. Droit applicable */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>{t.legal.applicableLawKicker}</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                {t.legal.applicableLawTitle}
              </h2>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                {isEn
                  ? 'Any dispute relating to the use of this site is governed by applicable laws. In the absence of an amicable settlement, jurisdiction is conferred exclusively to the competent courts.'
                  : 'Tout litige en relation avec l’utilisation du présent site est soumis au droit applicable. En l’absence de résolution amiable, compétence exclusive est attribuée aux tribunaux compétents.'}
              </p>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
