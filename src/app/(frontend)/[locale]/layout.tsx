import type { Metadata } from 'next'
import { cn } from '@/utilities/ui'
import { outfit, inter, firaCode, syne } from '@/styles/fonts'
import React from 'react'

import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { UmamiAnalytics } from '@/components/bokengi/UmamiAnalytics'
import { siteConfig } from '@/config/site'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/types'
import '../globals.css'

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }]
}

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr'
  const t = getDictionary(currentLocale)

  const ogLocale = currentLocale === 'en' ? 'en_US' : 'fr_FR'

  return {
    metadataBase: new URL(siteConfig.domains.production),
    title: t.seo.siteTitle,
    description: t.seo.siteDescription,
    alternates: {
      canonical: `/${currentLocale}`,
      languages: {
        fr: '/fr',
        en: '/en',
        'x-default': '/fr',
      },
    },
    openGraph: {
      title: t.seo.siteTitle,
      description: t.seo.siteDescription,
      url: `${siteConfig.domains.production}/${currentLocale}`,
      siteName: siteConfig.name,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: t.seo.siteTitle,
        },
      ],
      locale: ogLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.seo.siteTitle,
      description: t.seo.siteDescription,
      images: ['/og-image.png'],
    },
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr'
  const t = getDictionary(currentLocale)

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    legalName: 'Bokengi Group',
    url: siteConfig.domains.production,
    logo: `${siteConfig.domains.production}/bokengi-logo-horizontal.png`,
    image: `${siteConfig.domains.production}/og-image.png`,
    description: t.seo.siteDescription,
    foundingDate: '2025',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@bokengi-group.com',
      availableLanguage: ['French', 'English'],
    },
    sameAs: [
      'https://www.linkedin.com/company/bokengi-group',
      'https://github.com/KxlSys/Bokengi-Group',
    ],
    knowsAbout: [
      'Cybersécurité & Audit Pentest',
      'Infrastructures Réseaux & Cloud',
      'Ingénierie Logicielle & Next.js',
      'ERP & Automatisation des flux',
      'Événementiel Professionnel & Streaming',
    ],
  }

  return (
    <html
      className={cn(outfit.variable, inter.variable, firaCode.variable, syne.variable)}
      lang={currentLocale}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
        <link href="/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
        <link href="/site.webmanifest" rel="manifest" />
        <meta name="theme-color" content="#00124D" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          id="legacy-hash-redirect"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined' && window.location.hash) {
                  var hash = window.location.hash;
                  if (hash.indexOf('#/') === 0) {
                    var target = hash.substring(1);
                    if (target && target !== '/') {
                      window.location.replace(target);
                    }
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2.5 focus:bg-[var(--bg-surface)] focus:text-[var(--ink-heading)] focus:font-semibold focus:text-sm focus:rounded-[var(--radius-xs)] focus:border-2 focus:border-[var(--blue-cyan)] focus:shadow-2xl focus:outline-none"
        >
          {t.nav.skipToContent}
        </a>
        <Providers initialLocale={currentLocale}>
          {children}
        </Providers>
        <UmamiAnalytics />
      </body>
    </html>
  )
}

export const revalidate = 300
