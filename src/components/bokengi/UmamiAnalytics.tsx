import React from 'react'
import Script from 'next/script'

export interface UmamiAnalyticsProps {
  websiteId?: string
  src?: string
  hostUrl?: string
  enabled?: boolean
}

/**
 * BOKENGI GROUP 2.0 — MODULE D'ANALYTICS RESPECTUEUX DE LA VIE PRIVÉE (UMAMI)
 *
 * Principes d'architecture et conformité RGPD / Privacy :
 * - Mode Standby par défaut (NEXT_PUBLIC_UMAMI_ENABLED=false) : 0 script injecté, 0 requête réseau, 0 cookie.
 * - Mode Actif : Chargement asynchrone non-bloquant via next/script (strategy="afterInteractive").
 * - Privacy-by-design : Aucun tracking de données personnelles (pas de formulaires de leads, pas d'emails, pas de secrets).
 * - Compatibilité App Router : Compatible avec le routage dynamique bilingue /[locale]/* sans double injection.
 */
export const UmamiAnalytics: React.FC<UmamiAnalyticsProps> = ({
  websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  src = process.env.NEXT_PUBLIC_UMAMI_SRC || 'https://analytics.umami.is/script.js',
  hostUrl = process.env.NEXT_PUBLIC_UMAMI_HOST_URL,
  enabled = process.env.NEXT_PUBLIC_UMAMI_ENABLED === 'true',
}) => {
  const cleanWebsiteId = typeof websiteId === 'string' ? websiteId.trim() : ''
  const cleanSrc = typeof src === 'string' && src.trim().length > 0 ? src.trim() : 'https://analytics.umami.is/script.js'

  // 1. Mode Standby ou Identifiant absent : 0 injection DOM
  if (!enabled || !cleanWebsiteId) {
    return null
  }

  // 2. Mode Actif : Injection du tracker Umami non-bloquant
  return (
    <Script
      src={cleanSrc}
      data-website-id={cleanWebsiteId}
      data-host-url={hostUrl && typeof hostUrl === 'string' ? hostUrl.trim() : undefined}
      data-auto-track="true"
      strategy="afterInteractive"
    />
  )
}

export default UmamiAnalytics
