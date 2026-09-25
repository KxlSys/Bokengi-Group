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
} from '@/data/bokengi-seed-data'

export function extractLexicalText(node: unknown): string {
  return ''
}

export async function getPoles(locale: Locale = 'fr'): Promise<PoleData[]> {
  return fetchPolesFromERPNext(locale)
}

export async function getPoleBySlug(slug: string, locale: Locale = 'fr'): Promise<PoleData | null> {
  return fetchPoleBySlugFromERPNext(slug, locale)
}

export async function getServices(poleSlug?: string, locale: Locale = 'fr'): Promise<ServiceData[]> {
  return fetchServicesFromERPNext(poleSlug, locale)
}

export async function getCaseStudies(featuredOnly: boolean = false, locale: Locale = 'fr'): Promise<CaseStudyData[]> {
  const cases = await fetchCaseStudiesFromERPNext(locale)
  if (featuredOnly) {
    return cases.filter(c => c.featured)
  }
  return cases
}

export async function getCaseStudyBySlug(slug: string, locale: Locale = 'fr'): Promise<CaseStudyData | null> {
  return fetchCaseStudyBySlugFromERPNext(slug, locale)
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
  let posts = await fetchPostsFromERPNext(filter, locale)
  if (filter?.category && filter.category !== 'all') {
    const catLower = filter.category.toLowerCase()
    posts = posts.filter((p) => p.categories.some((c) => c.toLowerCase() === catLower))
  }
  return posts
}

export async function getPostBySlug(slug: string, locale: Locale = 'fr'): Promise<PostData | null> {
  return fetchPostBySlugFromERPNext(slug, locale)
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
