'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/providers/Theme'
import { siteConfig } from '@/config/site'
import { OpenStatusBadge } from './OpenStatusBadge'

export const Footer: React.FC = () => {
  const { theme } = useTheme()
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
            <Link href="/" aria-label="Bokengi Group · Retour à l'accueil">
              <img
                src={isDark ? '/bokengi-logo-horizontal-dark.png' : '/bokengi-logo-horizontal.png'}
                alt="Bokengi Group · Technology & Services"
                className="footer-v4-logo-img"
                style={{ height: '34px', width: 'auto', display: 'block' }}
              />
            </Link>
            <p className="footer-v4-desc">
              Bokengi Group rassemble des expertises technologiques, numériques et professionnelles pour accompagner les organisations dans leurs projets.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="footer-v4-col-title">Navigation</h4>
            <ul className="footer-v4-links">
              <li><Link href="/groupe" className="footer-v4-link">Le Groupe</Link></li>
              <li><Link href="/expertises" className="footer-v4-link">Expertises</Link></li>
              <li><Link href="/realisations" className="footer-v4-link">Réalisations</Link></li>
              <li><Link href="/actualites" className="footer-v4-link">Actualités</Link></li>
              <li><Link href="/contact" className="footer-v4-link">Contact</Link></li>
            </ul>
          </div>

          {/* Col 3: Expertises */}
          <div>
            <h4 className="footer-v4-col-title">Pôles d'Expertise</h4>
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
            <h4 className="footer-v4-col-title">Contact</h4>
            <Link
              href="/contact"
              className="footer-v4-link inline-flex items-center gap-1.5 font-medium text-[var(--blue-cyan)] hover:underline mb-2"
            >
              Formulaire de contact <span>→</span>
            </Link>
            <p className="footer-v4-desc" style={{ fontSize: '0.82rem', marginTop: '0.35rem' }}>
              Réponse sous 24 à 48h ouvrées pour toute demande de devis ou cadrage de projet.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-v4-bottom flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1">
            <span>© {new Date().getFullYear()} Bokengi Group. Tous droits réservés.</span>
            <span className="hidden sm:inline opacity-40" aria-hidden="true">·</span>
            <Link
              href="/mentions-legales"
              className="text-inherit hover:text-[var(--ink-heading)] transition-colors underline-offset-4 hover:underline"
            >
              Mentions légales
            </Link>
            <span className="hidden sm:inline opacity-40" aria-hidden="true">·</span>
            <Link
              href="/confidentialite"
              className="text-inherit hover:text-[var(--ink-heading)] transition-colors underline-offset-4 hover:underline"
            >
              Politique de confidentialité
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
