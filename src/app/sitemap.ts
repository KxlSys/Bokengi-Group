import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { getPoles, getPosts } from '@/lib/data'
import type { Locale } from '@/i18n/types'

/**
 * BOKENGI GROUP 2.0 — SITEMAP DYNAMIQUE MULTILINGUE (NEXT.JS 16 APP ROUTER)
 *
 * Indexe l'ensemble des routes publiques réelles de la plateforme :
 * - Pages statiques institutionnelles (/fr, /en, groupe, expertises, réalisations, actualités, contact, etc.)
 * - Pages dynamiques des 5 pôles d'expertise depuis ERPNext (/expertises/[slug])
 * - Articles et publications éditoriales dynamiques depuis ERPNext (/actualites/[slug])
 *
 * Résilience : En cas d'indisponibilité momentanée d'ERPNext, le sitemap continue de servir
 * l'intégralité des routes statiques sans provoquer d'erreur 500.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.domains.production
  const locales: Locale[] = ['fr', 'en']
  const sitemapEntries: MetadataRoute.Sitemap = []

  // 1. Définition des routes institutionnelles statiques
  const staticPaths = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1.0 },
    { path: '/groupe', changeFrequency: 'monthly' as const, priority: 0.9 },
    { path: '/expertises', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/realisations', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/actualites', changeFrequency: 'daily' as const, priority: 0.8 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/mentions-legales', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/confidentialite', changeFrequency: 'yearly' as const, priority: 0.3 },
  ]

  for (const item of staticPaths) {
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${item.path}`,
        lastModified: new Date(),
        changeFrequency: item.changeFrequency,
        priority: item.priority,
        alternates: {
          languages: {
            fr: `${baseUrl}/fr${item.path}`,
            en: `${baseUrl}/en${item.path}`,
          },
        },
      })
    }
  }

  // 2. Indexation dynamique des Pôles d'expertise depuis ERPNext
  try {
    const polesFr = await getPoles('fr').catch(() => [])
    const polesEn = await getPoles('en').catch(() => [])
    
    // Union des slugs disponibles
    const poleSlugs = Array.from(
      new Set([...polesFr.map((p) => p.slug), ...polesEn.map((p) => p.slug)].filter(Boolean))
    )

    for (const slug of poleSlugs) {
      for (const locale of locales) {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/expertises/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.85,
          alternates: {
            languages: {
              fr: `${baseUrl}/fr/expertises/${slug}`,
              en: `${baseUrl}/en/expertises/${slug}`,
            },
          },
        })
      }
    }
  } catch (error) {
    console.warn('[Sitemap] Récupération dynamique des Pôles différée :', error)
  }

  // 3. Indexation dynamique des Articles / Actualités depuis ERPNext
  try {
    const postsFr = await getPosts(undefined, 'fr').catch(() => [])
    const postsEn = await getPosts(undefined, 'en').catch(() => [])

    const postMap = new Map<string, { slug: string; date?: string }>()
    for (const p of postsFr) {
      if (p.slug) postMap.set(p.slug, { slug: p.slug, date: p.publishedAt })
    }
    for (const p of postsEn) {
      if (p.slug && !postMap.has(p.slug)) postMap.set(p.slug, { slug: p.slug, date: p.publishedAt })
    }

    for (const { slug, date } of Array.from(postMap.values())) {
      const lastMod = date ? new Date(date) : new Date()
      for (const locale of locales) {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/actualites/${slug}`,
          lastModified: isNaN(lastMod.getTime()) ? new Date() : lastMod,
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: {
            languages: {
              fr: `${baseUrl}/fr/actualites/${slug}`,
              en: `${baseUrl}/en/actualites/${slug}`,
            },
          },
        })
      }
    }
  } catch (error) {
    console.warn('[Sitemap] Récupération dynamique des Articles différée :', error)
  }

  return sitemapEntries
}
