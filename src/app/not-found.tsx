import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { cn } from '@/utilities/ui'
import { outfit, inter, firaCode, syne } from '@/styles/fonts'
import { Providers } from '@/providers'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import './(frontend)/globals.css'

export const metadata: Metadata = {
  title: 'Page introuvable (404) · Bokengi Group',
  description: "La page demandée n'existe pas ou a été déplacée.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootNotFound() {
  return (
    <Providers>
      <div
        className={cn(
          outfit.variable,
          inter.variable,
          firaCode.variable,
          syne.variable,
          'min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]'
        )}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2.5 focus:bg-[var(--bg-surface)] focus:text-[var(--ink-heading)] focus:font-semibold focus:text-sm focus:rounded-[var(--radius-xs)] focus:border-2 focus:border-[var(--blue-cyan)] focus:shadow-2xl focus:outline-none"
        >
          Aller au contenu principal
        </a>
        <Navbar />

        <main id="main-content" tabIndex={-1} className="flex-1 flex items-center justify-center py-28 relative overflow-hidden">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <div className="container-v4 text-center relative z-10 max-w-2xl mx-auto">
            <div className="font-mono text-7xl md:text-9xl font-extrabold text-[var(--blue-cyan)] mb-4 opacity-80">
              404
            </div>
            <Kicker>RESSOURCE INTROUVABLE</Kicker>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--ink-heading)] mt-2 mb-4">
              Cette page n'existe pas ou a été déplacée.
            </h1>
            <p className="text-base text-[var(--ink-muted)] mb-8 leading-relaxed">
              L'URL demandée ne correspond à aucun document actif du système Bokengi Group. Vérifiez le lien ou retournez à la navigation principale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="btn-v4-primary">
                Retour à l'accueil →
              </Link>
              <Link href="/expertises" className="btn-v4-secondary">
                Explorer nos expertises
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </Providers>
  )
}
