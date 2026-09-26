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
    title: t.legal.privacyMetaTitle,
    description: t.legal.privacyMetaDesc,
    alternates: {
      canonical: `/${currentLocale}/confidentialite`,
      languages: {
        fr: '/fr/confidentialite',
        en: '/en/confidentialite',
        'x-default': '/fr/confidentialite',
      },
    },
  }
}

export default async function ConfidentialitePage({ params }: PageProps) {
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
            <Kicker>{isEn ? 'PERSONAL DATA PROTECTION & GDPR' : 'PROTECTION DES DONNÉES PERSONNELLES'}</Kicker>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-3 mb-6">
              {t.legal.privacyTitle}
            </h1>
            <p className="text-base md:text-lg text-[var(--ink-muted)] leading-relaxed font-light">
              {t.legal.privacyDesc}
            </p>
          </div>
        </section>

        {/* ── CORPS DU DOCUMENT ── */}
        <section className="py-16">
          <div className="container-v4 max-w-4xl space-y-12">
            {/* 1. Responsable de traitement */}
            <article className="p-5 sm:p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>{isEn ? '01 · DATA CONTROLLER' : '01 · RESPONSABLE DU TRAITEMENT'}</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                {isEn ? 'Who is responsible for processing your personal data?' : 'Qui est responsable du traitement de vos données ?'}
              </h2>
              <div className="space-y-3 text-sm text-[var(--ink-body)] leading-relaxed pt-2">
                <p>
                  {isEn
                    ? 'The data controller responsible for personal data collected on the website '
                    : 'Le responsable du traitement des données à caractère personnel collectées sur le site '}
                  <a href={siteConfig.domains.production} className="text-[var(--blue-cyan)] hover:underline">
                    {siteConfig.domains.production}
                  </a>{' '}
                  {isEn ? 'is Bokengi Group.' : 'est la société Bokengi Group.'}
                </p>
                <ul className="space-y-2 pt-2">
                  <li className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="font-mono text-xs text-[var(--ink-muted)] sm:w-48 shrink-0">{isEn ? 'Controller:' : 'Responsable :'}</span>
                    <span className="font-semibold text-[var(--ink-heading)]">Bokengi Group</span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="font-mono text-xs text-[var(--ink-muted)] sm:w-48 shrink-0">{isEn ? 'Headquarters:' : 'Siège social :'}</span>
                    <span className="font-semibold text-[var(--ink-heading)]">Paris, France</span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="font-mono text-xs text-[var(--ink-muted)] sm:w-48 shrink-0">{isEn ? 'DPO Contact:' : 'Contact Référent Données / DPO :'}</span>
                    <a href="mailto:contact@bokengi-group.com" className="text-[var(--blue-cyan)] hover:underline font-mono">
                      contact@bokengi-group.com
                    </a>
                  </li>
                </ul>
              </div>
            </article>

            {/* 2. Données collectées */}
            <article className="p-5 sm:p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>{isEn ? '02 · COLLECTED DATA' : '02 · DONNÉES COLLECTÉES'}</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                {isEn ? 'What information do we collect?' : 'Quelles informations recueillons-nous ?'}
              </h2>
              <div className="space-y-3 text-sm text-[var(--ink-body)] leading-relaxed pt-2">
                <p>
                  {isEn
                    ? 'When submitting our contact, quotation, or access request forms, we collect the following categories of data:'
                    : 'Dans le cadre de l’utilisation de notre formulaire de contact et de demande de devis, nous collectons les données suivantes :'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <strong className="block text-[var(--ink-heading)] mb-1">
                      {isEn ? 'Identity & Contact' : 'Identité & Contact'}
                    </strong>
                    <span className="text-xs text-[var(--ink-muted)]">
                      {isEn
                        ? 'First name, Last name, Professional email address, Phone number (optional).'
                        : 'Prénom, Nom de famille, Adresse email professionnelle, Numéro de téléphone (optionnel).'}
                    </span>
                  </div>
                  <div className="p-3 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <strong className="block text-[var(--ink-heading)] mb-1">
                      {isEn ? 'Professional Context' : 'Contexte Professionnel'}
                    </strong>
                    <span className="text-xs text-[var(--ink-muted)]">
                      {isEn
                        ? 'Organization, Target engineering practice, Request type (quote, scoping, support, partnership).'
                        : 'Organisation / Entreprise, Pôle d’expertise visé, Type de demande (devis, cadrage, support, partenariat).'}
                    </span>
                  </div>
                  <div className="p-3 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <strong className="block text-[var(--ink-heading)] mb-1">
                      {isEn ? 'Project Scope' : 'Détails du Projet'}
                    </strong>
                    <span className="text-xs text-[var(--ink-muted)]">
                      {isEn
                        ? 'Detailed technical or business requirements provided in message body.'
                        : 'Description détaillée du besoin exprimé dans le message.'}
                    </span>
                  </div>
                  <div className="p-3 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <strong className="block text-[var(--ink-heading)] mb-1">
                      {isEn ? 'Technical & Security Data' : 'Données Techniques & Sécurité'}
                    </strong>
                    <span className="text-xs text-[var(--ink-muted)]">
                      {isEn
                        ? 'Timestamp, IP address (temporarily used for DDoS protection and rate limiting).'
                        : 'Horodatage de la demande, adresse IP (utilisée temporairement pour la prévention des attaques et la limitation de débit).'}
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* 3. Finalités & Bases légales */}
            <article className="p-5 sm:p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>{isEn ? '03 · PURPOSES & LEGAL BASES' : '03 · FINALITÉS & BASES LÉGALES'}</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                {isEn ? 'How and why do we process your data?' : 'Pourquoi traitons-nous vos données ?'}
              </h2>
              <div className="space-y-4 text-sm text-[var(--ink-body)] leading-relaxed pt-2">
                <div className="p-4 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)]">
                  <strong className="text-[var(--ink-heading)] block mb-1">
                    {isEn ? '1. Scoping and Estimation Response' : '1. Traitement des demandes de devis et cadrage technique'}
                  </strong>
                  <span className="text-xs text-[var(--ink-muted)] block">
                    {isEn
                      ? 'Legal basis: Pre-contractual measures taken at your request (Art. 6.1.b GDPR).'
                      : 'Base légale : Exécution de mesures précontractuelles prises à votre demande (art. 6.1.b RGPD).'}
                  </span>
                </div>
                <div className="p-4 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)]">
                  <strong className="text-[var(--ink-heading)] block mb-1">
                    {isEn ? '2. Platform Security & Abuse Prevention' : '2. Sécurité des systèmes et prévention des abus'}
                  </strong>
                  <span className="text-xs text-[var(--ink-muted)] block">
                    {isEn
                      ? 'Legal basis: Legitimate interest in preserving service integrity (Art. 6.1.f GDPR).'
                      : 'Base légale : Intérêt légitime de Bokengi Group à préserver l’intégrité de ses infrastructures (art. 6.1.f RGPD).'}
                  </span>
                </div>
              </div>
            </article>

            {/* 4. Durée de conservation */}
            <article className="p-5 sm:p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>{isEn ? '04 · DATA RETENTION' : '04 · DURÉE DE CONSERVATION'}</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                {isEn ? 'How long is data preserved?' : 'Combien de temps conservons-nous vos données ?'}
              </h2>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                {isEn
                  ? 'Commercial inquiries and lead submissions are stored for a maximum of 3 years following the last contact. In the event of a contractual relationship, records are preserved in accordance with statutory accounting and commercial retention rules.'
                  : 'Les données de prospection commerciale sont conservées pour une durée maximale de 3 ans à compter du dernier contact émanant de votre part. En cas de conclusion d’un contrat, les données sont conservées pour la durée des obligations légales applicables.'}
              </p>
            </article>

            {/* 5. Destinataires */}
            <article className="p-5 sm:p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>{isEn ? '05 · DATA RECIPIENTS' : '05 · DESTINATAIRES DES DONNÉES'}</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                {isEn ? 'Who has access to your data?' : 'Qui a accès à vos données ?'}
              </h2>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                {isEn
                  ? 'Your data is strictly reserved for technical leadership and authorized sales staff within Bokengi Group. Under no circumstances is your personal information transferred, rented, or sold to third parties for advertising purposes.'
                  : 'Vos données sont strictement réservées aux équipes internes habilitées de Bokengi Group (direction technique, directeurs de pôles concernés). Vos données ne sont en aucun cas cédées, louées ou vendues à des tiers à des fins commerciales ou publicitaires.'}
              </p>
            </article>

            {/* 6. Vos droits */}
            <article className="p-5 sm:p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>{isEn ? '06 · YOUR RIGHTS' : '06 · EXERCICE DE VOS DROITS'}</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                {isEn ? 'Your rights regarding personal information' : 'Quels sont vos droits ?'}
              </h2>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                {isEn
                  ? 'Pursuant to GDPR, you hold rights of access, rectification, erasure, restriction, objection, and data portability. To exercise these rights, submit your request to contact@bokengi-group.com along with proof of identity if required.'
                  : 'Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation du traitement, d’opposition et de portabilité de vos données. Pour toute réclamation, contactez contact@bokengi-group.com.'}
              </p>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
