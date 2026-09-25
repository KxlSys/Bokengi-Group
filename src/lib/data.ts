import type { Locale } from '@/i18n/types'
import {
  fetchPolesFromERPNext,
  fetchPoleBySlugFromERPNext,
  fetchServicesFromERPNext,
  fetchCaseStudiesFromERPNext,
  fetchCaseStudyBySlugFromERPNext,
  fetchPostsFromERPNext,
  fetchPostBySlugFromERPNext
} from './erpnext-client'

import {
  PoleData,
  ServiceData,
  CaseStudyData,
  CaseStudyScreenshot,
  PostData,
  PostAuthor,
  PostCoverImage,
  POLES_SEED_DATA,
  POLES_SEED_DATA_EN,
  SERVICES_SEED_DATA,
  SERVICES_SEED_DATA_EN,
  CASE_STUDIES_SEED_DATA,
  CASE_STUDIES_SEED_DATA_EN,
  POSTS_SEED_DATA,
  POSTS_SEED_DATA_EN,
} from '@/data/bokengi-seed-data'

export function extractLexicalText(node: unknown): string {
  return ''
}

export async function getPoles(locale: Locale = 'fr'): Promise<PoleData[]> {
  try {
    return await fetchPolesFromERPNext(locale)
  } catch {
    return locale === 'en' ? POLES_SEED_DATA_EN : POLES_SEED_DATA
  }
}

export async function getPoleBySlug(slug: string, locale: Locale = 'fr'): Promise<PoleData | null> {
  try {
    const pole = await fetchPoleBySlugFromERPNext(slug, locale)
    if (pole) return pole
  } catch {}
  const list: PoleData[] = locale === 'en' ? POLES_SEED_DATA_EN : POLES_SEED_DATA
  return list.find((p: PoleData) => p.slug === slug) || null
}

export async function getServices(poleSlug?: string, locale: Locale = 'fr'): Promise<ServiceData[]> {
  try {
    const services = await fetchServicesFromERPNext(poleSlug, locale)
    if (services && services.length > 0) return services
  } catch {}
  const list: ServiceData[] = locale === 'en' ? SERVICES_SEED_DATA_EN : SERVICES_SEED_DATA
  if (poleSlug) {
    const cleanPole = poleSlug.replace(/^POL-/, '')
    return list.filter((s: ServiceData) => s.poleSlug === cleanPole)
  }
  return list
}

export async function getCaseStudies(featuredOnly: boolean = false, locale: Locale = 'fr'): Promise<CaseStudyData[]> {
  try {
    const cases = await fetchCaseStudiesFromERPNext(locale)
    if (cases && cases.length > 0) {
      return featuredOnly ? cases.filter((c: CaseStudyData) => c.featured) : cases
    }
  } catch {}
  const list: CaseStudyData[] = locale === 'en' ? CASE_STUDIES_SEED_DATA_EN : CASE_STUDIES_SEED_DATA
  return featuredOnly ? list.filter((c: CaseStudyData) => c.featured) : list
}

export async function getCaseStudyBySlug(slug: string, locale: Locale = 'fr'): Promise<CaseStudyData | null> {
  try {
    const cs = await fetchCaseStudyBySlugFromERPNext(slug, locale)
    if (cs) return cs
  } catch {}
  const list: CaseStudyData[] = locale === 'en' ? CASE_STUDIES_SEED_DATA_EN : CASE_STUDIES_SEED_DATA
  return list.find((c: CaseStudyData) => c.slug === slug) || null
}

export function calculateReadingTime(text: string): number {
  if (!text) return 1
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export function formatDate(dateStr?: string | null, locale: Locale = 'fr'): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d)
  } catch {
    return dateStr
  }
}

export function formatFrenchDate(dateStr?: string | null): string {
  return formatDate(dateStr, 'fr')
}

export function mapPayloadPostToPostData(doc: any): PostData {
  return doc as PostData
}

export async function getPosts(filter?: { category?: string; limit?: number }, locale: Locale = 'fr'): Promise<PostData[]> {
  let posts: PostData[] = []
  try {
    posts = await fetchPostsFromERPNext(filter, locale)
  } catch {}
  if (!posts || posts.length === 0) {
    posts = locale === 'en' ? POSTS_SEED_DATA_EN : POSTS_SEED_DATA
  }
  if (filter?.category && filter.category !== 'all') {
    const catLower = filter.category.toLowerCase()
    posts = posts.filter((p: PostData) => p.categories.some((c: string) => c.toLowerCase() === catLower))
  }
  if (filter?.limit) {
    posts = posts.slice(0, filter.limit)
  }
  return posts
}

export async function getPostBySlug(slug: string, locale: Locale = 'fr'): Promise<PostData | null> {
  try {
    const post = await fetchPostBySlugFromERPNext(slug, locale)
    if (post) return post
  } catch {}
  const list: PostData[] = locale === 'en' ? POSTS_SEED_DATA_EN : POSTS_SEED_DATA
  return list.find((p: PostData) => p.slug === slug) || null
}

export async function getPostCategories(locale: Locale = 'fr'): Promise<string[]> {
  const posts = await getPosts(undefined, locale)
  const set = new Set<string>()
  for (const post of posts) {
    for (const cat of post.categories) {
      if (cat) set.add(cat)
    }
  }
  return Array.from(set)
}
