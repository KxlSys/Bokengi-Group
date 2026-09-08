'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * DashboardNavLink — Bouton d'accès direct au Dashboard / Command Center Bokengi.
 * 
 * Injecté en tête de la navigation d'administration (beforeNavLinks) pour permettre
 * un retour immédiat à /admin depuis n'importe quelle vue ou collection.
 */
export const DashboardNavLink: React.FC = () => {
  const pathname = usePathname()
  const isDashboard = pathname === '/admin' || pathname === '/admin/'

  return (
    <div className="bokengi-nav-dashboard-wrap">
      <Link
        href="/admin"
        className={`bokengi-nav-dashboard-link ${isDashboard ? 'bokengi-nav-dashboard-link--active' : ''}`}
        aria-label="Retour au Tableau de bord Bokengi"
      >
        <span className="bokengi-nav-dashboard-arrow" aria-hidden="true">
          ←
        </span>
        <span className="bokengi-nav-dashboard-label">Dashboard</span>
      </Link>
    </div>
  )
}

export default DashboardNavLink
