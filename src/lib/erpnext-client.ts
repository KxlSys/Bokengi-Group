import type {
  PoleData,
  ServiceData,
  CaseStudyData,
  CaseStudyScreenshot,
  PostData,
} from '../data/bokengi-seed-data.ts'

/**
 * Client d'accès REST API à ERPNext v15 pour Bokengi Group 2.0.
 * Fournit une interface typée, résiliente et optimisée pour les Server Components Next.js.
 */

function getERPNextConfig() {
  let apiUrl = process.env.ERPNEXT_API_URL
  let apiKey = process.env.ERPNEXT_API_KEY
  let apiSecret = process.env.ERPNEXT_API_SECRET

  try {
    const cf = (globalThis as any)[Symbol.for('__cloudflare-context__')]
    if (cf?.env?.ERPNEXT_API_URL) apiUrl = cf.env.ERPNEXT_API_URL
    if (cf?.env?.ERPNEXT_API_KEY) apiKey = cf.env.ERPNEXT_API_KEY
    if (cf?.env?.ERPNEXT_API_SECRET) apiSecret = cf.env.ERPNEXT_API_SECRET
  } catch {}

  return {
    apiUrl: apiUrl || 'https://erp.bokengi-group.com',
    apiKey,
    apiSecret,
    isConfigured: Boolean(apiKey && apiSecret),
  }
}

async function fetchFromERPNext<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  const config = getERPNextConfig()
  const url = `${config.apiUrl}${endpoint}`

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }

  if (config.isConfigured) {
    headers['Authorization'] = `token ${config.apiKey}:${config.apiSecret}`
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options?.headers as Record<string, string> | undefined),
    },
    // Next.js caching / ISR
    next: { revalidate: 60 },
  } as any)

  if (!response.ok) {
    throw new Error(`ERPNext API error: ${response.status} ${response.statusText} on ${endpoint}`)
  }

  return response.json()
}

/**
 * Récupère les 5 Pôles d'expertise depuis ERPNext.
 */
export async function fetchPolesFromERPNext(locale: 'fr' | 'en' = 'fr'): Promise<PoleData[]> {
  const isEn = locale === 'en'
  const fields = JSON.stringify([
    'name',
    'pole_name_fr',
    'pole_name_en',
    'slug',
    'order_num',
    'icon',
    'short_description_fr',
    'short_description_en',
    'description_fr',
    'description_en',
    'status',
    'domains_fr',
    'domains_en',
    'seo_title_fr',
    'seo_title_en',
    'seo_description_fr',
    'seo_description_en',
  ])

  const res = await fetchFromERPNext<{ data: any[] }>(
    `/api/resource/Bokengi Pole?fields=${encodeURIComponent(fields)}&filters=[["status","=","published"]]&order_by=order_num asc`
  )

  if (!res.data || res.data.length === 0) {
    throw new Error('No published poles found in ERPNext')
  }

  return res.data.map((doc, idx) => ({
    name: (isEn ? doc.pole_name_en : doc.pole_name_fr) || doc.pole_name_fr || doc.name,
    slug: doc.slug,
    num: `0${doc.order_num || idx + 1}`,
    shortDescription: (isEn ? doc.short_description_en : doc.short_description_fr) || doc.short_description_fr || '',
    description: (isEn ? doc.description_en : doc.description_fr) || doc.description_fr || '',
    icon: doc.icon || 'server',
    order: doc.order_num || idx + 1,
    status: doc.status || 'published',
    domains: (isEn ? doc.domains_en : doc.domains_fr) || doc.domains_fr || '',
    seo: {
      title: (isEn ? doc.seo_title_en : doc.seo_title_fr) || `${doc.pole_name_fr} · Bokengi Group`,
      description: (isEn ? doc.seo_description_en : doc.seo_description_fr) || doc.short_description_fr || '',
    },
  }))
}

/**
 * Récupère un Pôle par son slug depuis ERPNext.
 */
export async function fetchPoleBySlugFromERPNext(slug: string, locale: 'fr' | 'en' = 'fr'): Promise<PoleData | null> {
  const poles = await fetchPolesFromERPNext(locale)
  return poles.find((p) => p.slug === slug) || null
}

/**
 * Récupère les Services depuis ERPNext avec filtre optionnel sur le pôle parent.
 */
export async function fetchServicesFromERPNext(poleSlug?: string, locale: 'fr' | 'en' = 'fr'): Promise<ServiceData[]> {
  const isEn = locale === 'en'
  const fields = JSON.stringify([
    'name',
    'service_name_fr',
    'service_name_en',
    'slug',
    'pole',
    'category_fr',
    'category_en',
    'short_description_fr',
    'short_description_en',
    'content_fr',
    'content_en',
    'featured',
    'order_num',
    'status',
  ])

  let filters = '[["status","=","published"]]'
  if (poleSlug) {
    const poleId = poleSlug.startsWith('POL-') ? poleSlug : `POL-${poleSlug}`
    filters = `[["status","=","published"],["pole","=","${poleId}"]]`
  }

  const res = await fetchFromERPNext<{ data: any[] }>(
    `/api/resource/Bokengi Service?fields=${encodeURIComponent(fields)}&filters=${encodeURIComponent(filters)}&order_by=order_num asc&limit_page_length=50`
  )

  if (!res.data || res.data.length === 0) {
    return []
  }

  return res.data.map((doc, idx) => {
    const poleSlugClean = (doc.pole || '').replace(/^POL-/, '')
    return {
      title: (isEn ? doc.service_name_en : doc.service_name_fr) || doc.service_name_fr || doc.name,
      slug: doc.slug,
      poleSlug: poleSlugClean,
      category: (isEn ? doc.category_en : doc.category_fr) || doc.category_fr || 'Services',
      shortDescription: (isEn ? doc.short_description_en : doc.short_description_fr) || doc.short_description_fr || '',
      content: (isEn ? doc.content_en : doc.content_fr) || doc.content_fr || '',
      technicalTags: [],
      featured: Boolean(doc.featured),
      order: doc.order_num || idx + 1,
      status: doc.status || 'published',
    }
  })
}

/**
 * Récupère un Service par son slug depuis ERPNext.
 */
export async function fetchServiceBySlugFromERPNext(slug: string, locale: 'fr' | 'en' = 'fr'): Promise<ServiceData | null> {
  const isEn = locale === 'en'
  const res = await fetchFromERPNext<{ data: any[] }>(
    `/api/resource/Bokengi Service?filters=[["slug","=","${slug}"],["status","=","published"]]&limit_page_length=1`
  )

  if (!res.data || res.data.length === 0) {
    return null
  }

  // Récupérer le document complet avec ses tables enfants (tags)
  const fullDocRes = await fetchFromERPNext<{ data: any }>(
    `/api/resource/Bokengi Service/${res.data[0].name}`
  )
  const doc = fullDocRes.data
  const poleSlugClean = (doc.pole || '').replace(/^POL-/, '')
  const technicalTags = Array.isArray(doc.technical_tags)
    ? doc.technical_tags.map((t: any) => ({ tag: t.tag }))
    : []

  return {
    title: (isEn ? doc.service_name_en : doc.service_name_fr) || doc.service_name_fr || doc.name,
    slug: doc.slug,
    poleSlug: poleSlugClean,
    category: (isEn ? doc.category_en : doc.category_fr) || doc.category_fr || 'Services',
    shortDescription: (isEn ? doc.short_description_en : doc.short_description_fr) || doc.short_description_fr || '',
    content: (isEn ? doc.content_en : doc.content_fr) || doc.content_fr || '',
    technicalTags,
    featured: Boolean(doc.featured),
    order: doc.order_num || 1,
    status: doc.status || 'published',
  }
}

/**
 * Récupère les Case Studies depuis ERPNext.
 */
export async function fetchCaseStudiesFromERPNext(locale: 'fr' | 'en' = 'fr'): Promise<CaseStudyData[]> {
  const isEn = locale === 'en'
  const fields = JSON.stringify([
    'name',
    'title_fr',
    'title_en',
    'slug',
    'client_name',
    'category_fr',
    'category_en',
    'summary_fr',
    'summary_en',
    'context_fr',
    'context_en',
    'challenge_fr',
    'challenge_en',
    'solution_fr',
    'solution_en',
    'results_fr',
    'results_en',
    'architecture_fr',
    'architecture_en',
    'featured',
    'published_date',
    'status',
    'seo_title_fr',
    'seo_title_en',
    'seo_description_fr',
    'seo_description_en',
  ])

  const res = await fetchFromERPNext<{ data: any[] }>(
    `/api/resource/Bokengi Case Study?fields=${encodeURIComponent(fields)}&filters=[["status","=","published"]]&order_by=published_date desc`
  )

  if (!res.data || res.data.length === 0) {
    return []
  }

  return res.data.map((doc) => ({
    title: (isEn ? doc.title_en : doc.title_fr) || doc.title_fr || doc.name,
    slug: doc.slug,
    clientName: doc.client_name || '',
    category: (isEn ? doc.category_en : doc.category_fr) || doc.category_fr || 'Étude de cas',
    summary: (isEn ? doc.summary_en : doc.summary_fr) || doc.summary_fr || '',
    context: (isEn ? doc.context_en : doc.context_fr) || doc.context_fr || '',
    challenge: (isEn ? doc.challenge_en : doc.challenge_fr) || doc.challenge_fr || '',
    solution: (isEn ? doc.solution_en : doc.solution_fr) || doc.solution_fr || '',
    results: (isEn ? doc.results_en : doc.results_fr) || doc.results_fr || '',
    resultsList: [],
    technologies: [],
    architecture: (isEn ? doc.architecture_en : doc.architecture_fr) || doc.architecture_fr || '',
    featured: Boolean(doc.featured),
    publishedDate: doc.published_date || new Date().toISOString(),
    status: doc.status || 'published',
    seo: {
      title: (isEn ? doc.seo_title_en : doc.seo_title_fr) || `${doc.title_fr} · Bokengi Group`,
      description: (isEn ? doc.seo_description_en : doc.seo_description_fr) || doc.summary_fr || '',
    },
  }))
}

/**
 * Récupère une Case Study par son slug avec ses child tables technologies et screenshots.
 */
export async function fetchCaseStudyBySlugFromERPNext(slug: string, locale: 'fr' | 'en' = 'fr'): Promise<CaseStudyData | null> {
  const isEn = locale === 'en'
  const res = await fetchFromERPNext<{ data: any[] }>(
    `/api/resource/Bokengi Case Study?filters=[["slug","=","${slug}"],["status","=","published"]]&limit_page_length=1`
  )

  if (!res.data || res.data.length === 0) {
    return null
  }

  const fullDocRes = await fetchFromERPNext<{ data: any }>(
    `/api/resource/Bokengi Case Study/${res.data[0].name}`
  )
  const doc = fullDocRes.data

  const technologies = Array.isArray(doc.technologies)
    ? doc.technologies.map((t: any) => ({ name: t.tech_name }))
    : []

  const screenshots: CaseStudyScreenshot[] = Array.isArray(doc.screenshots)
    ? doc.screenshots.map((s: any) => ({
        url: s.image_url,
        alt: s.alt_text || '',
        caption: s.caption || '',
      }))
    : []

  return {
    title: (isEn ? doc.title_en : doc.title_fr) || doc.title_fr || doc.name,
    slug: doc.slug,
    clientName: doc.client_name || '',
    category: (isEn ? doc.category_en : doc.category_fr) || doc.category_fr || 'Étude de cas',
    summary: (isEn ? doc.summary_en : doc.summary_fr) || doc.summary_fr || '',
    context: (isEn ? doc.context_en : doc.context_fr) || doc.context_fr || '',
    challenge: (isEn ? doc.challenge_en : doc.challenge_fr) || doc.challenge_fr || '',
    solution: (isEn ? doc.solution_en : doc.solution_fr) || doc.solution_fr || '',
    results: (isEn ? doc.results_en : doc.results_fr) || doc.results_fr || '',
    resultsList: [],
    technologies,
    architecture: (isEn ? doc.architecture_en : doc.architecture_fr) || doc.architecture_fr || '',
    featured: Boolean(doc.featured),
    publishedDate: doc.published_date || new Date().toISOString(),
    status: doc.status || 'published',
    screenshots,
    seo: {
      title: (isEn ? doc.seo_title_en : doc.seo_title_fr) || `${doc.title_fr} · Bokengi Group`,
      description: (isEn ? doc.seo_description_en : doc.seo_description_fr) || doc.summary_fr || '',
    },
  }
}

/**
 * Récupère les Articles de blog depuis ERPNext.
 */
export async function fetchPostsFromERPNext(
  filter?: { category?: string; limit?: number },
  locale: 'fr' | 'en' = 'fr'
): Promise<PostData[]> {
  const isEn = locale === 'en'
  const limit = filter?.limit || 50
  const fields = JSON.stringify([
    'name',
    'title_fr',
    'title_en',
    'slug',
    'author_name',
    'published_date',
    'reading_time',
    'status',
    'summary_fr',
    'summary_en',
    'content_fr',
    'content_en',
    'seo_title_fr',
    'seo_title_en',
    'seo_description_fr',
    'seo_description_en',
  ])

  const res = await fetchFromERPNext<{ data: any[] }>(
    `/api/resource/Bokengi Post?fields=${encodeURIComponent(fields)}&filters=[["status","=","published"]]&order_by=published_date desc&limit_page_length=${limit}`
  )

  if (!res.data || res.data.length === 0) {
    return []
  }

  return res.data.map((doc) => {
    const title = (isEn ? doc.title_en : doc.title_fr) || doc.title_fr || doc.name
    const summary = (isEn ? doc.summary_en : doc.summary_fr) || doc.summary_fr || ''
    const content = (isEn ? doc.content_en : doc.content_fr) || doc.content_fr || ''

    return {
      title,
      slug: doc.slug,
      excerpt: summary,
      content,
      author: { name: doc.author_name || 'Kalel Damba' },
      coverImage: null,
      categories: ['Actualité'],
      tags: [],
      publishedAt: doc.published_date || new Date().toISOString(),
      readingTime: doc.reading_time || 3,
      status: doc.status || 'published',
      seo: {
        title: (isEn ? doc.seo_title_en : doc.seo_title_fr) || `${title} — Bokengi Group`,
        description: (isEn ? doc.seo_description_en : doc.seo_description_fr) || summary,
      },
    }
  })
}

/**
 * Récupère un Article de blog par son slug avec ses tags depuis ERPNext.
 */
export async function fetchPostBySlugFromERPNext(slug: string, locale: 'fr' | 'en' = 'fr'): Promise<PostData | null> {
  const isEn = locale === 'en'
  const res = await fetchFromERPNext<{ data: any[] }>(
    `/api/resource/Bokengi Post?filters=[["slug","=","${slug}"],["status","=","published"]]&limit_page_length=1`
  )

  if (!res.data || res.data.length === 0) {
    return null
  }

  const fullDocRes = await fetchFromERPNext<{ data: any }>(
    `/api/resource/Bokengi Post/${res.data[0].name}`
  )
  const doc = fullDocRes.data
  const title = (isEn ? doc.title_en : doc.title_fr) || doc.title_fr || doc.name
  const summary = (isEn ? doc.summary_en : doc.summary_fr) || doc.summary_fr || ''
  const content = (isEn ? doc.content_en : doc.content_fr) || doc.content_fr || ''
  const tags = Array.isArray(doc.tags) ? doc.tags.map((t: any) => t.tag_name) : []

  return {
    title,
    slug: doc.slug,
    excerpt: summary,
    content,
    author: { name: doc.author_name || 'Kalel Damba' },
    coverImage: null,
    categories: ['Actualité'],
    tags,
    publishedAt: doc.published_date || new Date().toISOString(),
    readingTime: doc.reading_time || 3,
    status: doc.status || 'published',
    seo: {
      title: (isEn ? doc.seo_title_en : doc.seo_title_fr) || `${title} — Bokengi Group`,
      description: (isEn ? doc.seo_description_en : doc.seo_description_fr) || summary,
    },
  }
}

/**
 * Récupère les paramètres du site (Single DocType Bokengi Site Settings).
 */
export async function fetchSiteSettingsFromERPNext(): Promise<any> {
  const res = await fetchFromERPNext<{ data: any }>('/api/resource/Bokengi Site Settings/Bokengi Site Settings')
  return res.data
}

/**
 * Envoie un formulaire de contact / Lead vers ERPNext.
 */
export async function submitLeadToERPNext(leadData: {
  lead_name: string
  company_name?: string
  email_id: string
  phone?: string
  custom_pole?: string
  custom_payload_message_raw: string
}): Promise<{ success: boolean; name?: string }> {
  const res = await fetchFromERPNext<{ data: any }>('/api/resource/Lead', {
    method: 'POST',
    body: JSON.stringify({
      lead_name: leadData.lead_name,
      company_name: leadData.company_name || 'Particulier / Non spécifié',
      email_id: leadData.email_id,
      phone: leadData.phone || '',
      custom_pole: leadData.custom_pole || 'POL-it',
      custom_payload_message_raw: leadData.custom_payload_message_raw,
      custom_priority_flag: 'Normal',
      status: 'Open',
    }),
  })

  return { success: Boolean(res.data?.name), name: res.data?.name }
}

/**
 * Envoie une demande d'accès sécurisée vers ERPNext (enregistrée comme Lead d'habilitation interne).
 */
export async function submitAccessRequestToERPNext(data: {
  first_name: string
  last_name: string
  email: string
  requested_role: string
  justification: string
}): Promise<{ success: boolean; name?: string }> {
  const roleLabel = data.requested_role === 'admin' ? 'Administrateur Technique' : 'Éditeur de Contenu'
  const message = [
    `[DEMANDE D'ACCÈS INTERNE / HABILITATION]`,
    `Demandeur : ${data.first_name} ${data.last_name}`.trim(),
    `Email professionnel : ${data.email}`,
    `Rôle sollicité : ${roleLabel} (${data.requested_role})`,
    ``,
    `Justification & Motivation :`,
    data.justification,
  ].join('\n')

  return submitLeadToERPNext({
    lead_name: `${data.first_name} ${data.last_name}`.trim(),
    company_name: "Demande d'accès interne / Partenaire",
    email_id: data.email,
    custom_pole: 'POL-it',
    custom_payload_message_raw: message,
  })
}

