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

  const isDark = mounted ? theme === 'dark' : true

  return (
    <footer className="footer-v4" aria-label="Pied de page">
      <div className="container-v4">
        <div className="footer-v4-grid">
          {/* Col 1: Identity & Official Logo */}
          <div>
            <Link href="/" aria-label="Bokengi Group · Retour à l'accueil">
              <img
                src={isDark ? '/bokengi-logo-horizontal-dark.png' : '/bokengi-logo-horizontal.png'}
                alt="Bokengi Group · Technology & Services"
                className="footer-v4-logo-img"
                style={{ height: '36px', width: 'auto', display: 'block' }}
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

          {/* Col 4: Contact Officiel */}
          <div>
            <h4 className="footer-v4-col-title">Contact</h4>
            {siteConfig.contact.email ? (
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-[var(--blue-cyan)] font-mono text-sm block mb-2"
              >
                {siteConfig.contact.email}
              </a>
            ) : (
              <Link
                href="/contact"
                className="text-[var(--blue-cyan)] font-mono text-sm block mb-2 hover:underline"
              >
                Formulaire de contact →
              </Link>
            )}
            <p className="footer-v4-desc" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Réponse sous {siteConfig.contact.responseTime} pour toute demande de devis ou cadrage de projet.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-v4-bottom flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Bokengi Group. Tous droits réservés.</span>
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
