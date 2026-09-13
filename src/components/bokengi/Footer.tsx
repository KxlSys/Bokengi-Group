'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/providers/Theme'
import { useI18n } from '@/i18n'
import { siteConfig } from '@/config/site'
import { OpenStatusBadge } from './OpenStatusBadge'

export const Footer: React.FC = () => {
  const { theme } = useTheme()
  const { t } = useI18n()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted ? theme === 'dark' : false

  return (
    <footer className="footer-v4" aria-label="Pied de page">
      <div className="footer-v4-pattern" aria-hidden="true" />
      <div className="container-v4 relative z-10">
        <div className="footer-v4-grid">
          {/* Col 1: Identity & Official Logo */}
          <div>
            <Link href="/" aria-label={`Bokengi Group · ${t.common.backToHome}`}>
              <img
                src={isDark ? '/bokengi-logo-horizontal-dark.png' : '/bokengi-logo-horizontal.png'}
                alt="Bokengi Group · Technology & Services"
                className="footer-v4-logo-img"
                style={{ height: '34px', width: 'auto', display: 'block' }}
              />
            </Link>
            <p className="footer-v4-desc">
              {t.footer.description}
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="footer-v4-col-title">{t.footer.navigationTitle}</h4>
            <ul className="footer-v4-links">
              <li><Link href="/groupe" className="footer-v4-link">{t.nav.group}</Link></li>
              <li><Link href="/expertises" className="footer-v4-link">{t.nav.expertises}</Link></li>
              <li><Link href="/realisations" className="footer-v4-link">{t.nav.projects}</Link></li>
              <li><Link href="/actualites" className="footer-v4-link">{t.nav.news}</Link></li>
              <li><Link href="/contact" className="footer-v4-link">{t.nav.contact}</Link></li>
            </ul>
          </div>

          {/* Col 3: Expertises */}
          <div>
            <h4 className="footer-v4-col-title">{t.footer.expertisesTitle}</h4>
            <ul className="footer-v4-links">
              <li><Link href="/expertises/it" className="footer-v4-link">Bokengi IT</Link></li>
              <li><Link href="/expertises/digital" className="footer-v4-link">Bokengi Digital</Link></li>
              <li><Link href="/expertises/business" className="footer-v4-link">Bokengi Business</Link></li>
              <li><Link href="/expertises/consulting" className="footer-v4-link">Bokengi Consulting</Link></li>
              <li><Link href="/expertises/events" className="footer-v4-link">Bokengi Events</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Formulaire */}
          <div>
            <h4 className="footer-v4-col-title">{t.footer.contactTitle}</h4>
            <Link
              href="/contact"
              className="footer-v4-link inline-flex items-center gap-1.5 font-medium text-[var(--blue-cyan)] hover:underline mb-2"
            >
              {t.common.contactUs} <span>→</span>
            </Link>
            <p className="footer-v4-desc" style={{ fontSize: '0.82rem', marginTop: '0.35rem' }}>
              {t.common.estimatedResponseTime} : <strong>{t.common.hoursWorking}</strong>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-v4-bottom flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1">
            <span>© {new Date().getFullYear()} Bokengi Group. {t.common.allRightsReserved}</span>
            <span className="hidden sm:inline opacity-40" aria-hidden="true">·</span>
            <Link
              href="/mentions-legales"
              className="text-inherit hover:text-[var(--ink-heading)] transition-colors underline-offset-4 hover:underline"
            >
              {t.footer.legalNotice}
            </Link>
            <span className="hidden sm:inline opacity-40" aria-hidden="true">·</span>
            <Link
              href="/confidentialite"
              className="text-inherit hover:text-[var(--ink-heading)] transition-colors underline-offset-4 hover:underline"
            >
              {t.footer.privacyPolicy}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <OpenStatusBadge />
            <span>Technology & Services</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
