import React from 'react'
import Script from 'next/script'

export interface UmamiAnalyticsProps {
  websiteId?: string
  src?: string
  enabled?: boolean
}

/**
 * Composant de préparation pour l'intégration Umami Analytics (Respectueux de la vie privée).
 * EN STANDBY PAR DÉFAUT : N'injecte absolument aucun script sans validation préalable (NEXT_PUBLIC_UMAMI_ENABLED=true).
 */
export const UmamiAnalytics: React.FC<UmamiAnalyticsProps> = ({
  websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  src = process.env.NEXT_PUBLIC_UMAMI_SRC || 'https://analytics.umami.is/script.js',
  enabled = process.env.NEXT_PUBLIC_UMAMI_ENABLED === 'true',
}) => {
  if (!enabled || !websiteId) {
    return null
  }

  return (
    <Script
      src={src}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  )
}

export default UmamiAnalytics
