'use client'

import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import { useI18n } from '@/i18n'

export default function LocalizedNotFound() {
  const { t, getHref } = useI18n()

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 flex items-center justify-center py-28 relative overflow-hidden">
        <div className="pattern-dotted-radial-right" aria-hidden="true" />
        <div className="container-v4 text-center relative z-10 max-w-2xl mx-auto">
          <div className="font-mono text-7xl md:text-9xl font-extrabold text-[var(--blue-cyan)] mb-4 opacity-80">
            {t.errors.notFoundCode}
          </div>
          <Kicker>{t.errors.notFoundKicker}</Kicker>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--ink-heading)] mt-2 mb-4">
            {t.errors.notFoundTitle}
          </h1>
          <p className="text-base text-[var(--ink-muted)] mb-8 leading-relaxed">
            {t.errors.notFoundDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={getHref('/')} className="btn-v4-primary">
              {t.errors.backToHome}
            </Link>
            <Link href={getHref('/expertises')} className="btn-v4-secondary">
              {t.errors.exploreExpertises}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
