import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

/**
 * BOKENGI GROUP 2.0 — DIRECTIVES ROBOTS.TXT (NEXT.JS 16 APP ROUTER)
 *
 * Règles d'indexation pour les moteurs de recherche :
 * - Autorise l'indexation de l'ensemble des pages publiques multilingues (/fr, /en, etc.)
 * - Interdit l'accès aux endpoints d'API (/api/*) et aux espaces réservés (demande-acces)
 * - Déclare l'URL canonique absolue du sitemap XML
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.domains.production

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/*/demande-acces',
          '/demande-acces',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
