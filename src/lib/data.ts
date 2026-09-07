import {
  POLES_SEED_DATA,
  SERVICES_SEED_DATA,
  CASE_STUDIES_SEED_DATA,
  PoleData,
  ServiceData,
  CaseStudyData,
  CaseStudyScreenshot,
} from '@/data/bokengi-seed-data'

/**
 * Parseur récursif léger et robuste pour extraire du texte brut ou structuré
 * depuis une structure Lexical RichText de Payload 3.x.
 * Garantit qu'aucun objet brut n'est injecté dans le JSX (évite les erreurs React 19),
 * tout en restituant fidèlement le contenu éditorial rédigé dans le CMS.
 */
export function extractLexicalText(node: unknown): string {
  if (!node) return ''
  if (typeof node === 'string') return node.trim()
  if (typeof node === 'number' || typeof node === 'boolean') return String(node)

  if (Array.isArray(node)) {
    return node
      .map((child) => extractLexicalText(child))
      .filter(Boolean)
      .join('\n\n')
      .trim()
  }

  if (typeof node === 'object') {
    const obj = node as Record<string, any>

    // 1. Racine de l'arbre Lexical : { root: { children: [...] } }
    if (obj.root && typeof obj.root === 'object') {
      return extractLexicalText(obj.root)
    }

    // 2. Feuille textuelle : { type: 'text', text: '...' }
    if (typeof obj.text === 'string') {
      return obj.text
    }

    // 3. Saut de ligne explicite : { type: 'linebreak' }
    if (obj.type === 'linebreak') {
      return '\n'
    }

    // 4. Nœud avec enfants : { children: [...] }
    if (Array.isArray(obj.children) && obj.children.length > 0) {
      if (obj.type === 'root') {
        return obj.children
          .map((child: unknown) => extractLexicalText(child))
          .filter(Boolean)
          .join('\n\n')
          .trim()
      }

      if (obj.type === 'list') {
        return obj.children
          .map((child: unknown) => extractLexicalText(child))
          .filter(Boolean)
          .join('\n')
          .trim()
      }

      // Paragraphes, titres, éléments de liste, liens : concaténation des fragments inline
      return obj.children
        .map((child: unknown) => extractLexicalText(child))
        .join('')
    }
  }

  return ''
}

/**
 * Normalise les captures d'écran issues de la collection case-studies de Payload.
 */
function mapScreenshots(rawScreenshots: any): CaseStudyScreenshot[] {
  if (!Array.isArray(rawScreenshots)) return []
  const results: CaseStudyScreenshot[] = []

  for (const item of rawScreenshots) {
    if (!item) continue
    const img = item.image
    let url = ''
    let alt = ''
    let width: number | undefined
    let height: number | undefined

    if (typeof img === 'string') {
      url = img
    } else if (img && typeof img === 'object') {
      url = img.url || (img.filename ? `/api/media/file/${img.filename}` : '')
      alt = typeof img.alt === 'string' ? img.alt : ''
      width = typeof img.width === 'number' ? img.width : undefined
      height = typeof img.height === 'number' ? img.height : undefined
    }

    if (url) {
      results.push({
        url,
        alt: alt || item.caption || '',
        caption: typeof item.caption === 'string' ? item.caption : '',
        width,
        height,
      })
    }
  }

  return results
}

/**
 * Récupère l'ensemble des 5 pôles Bokengi publiés.
 * Tente d'interroger Payload CMS en local avec fallback transparent sur les données de référence.
 */
export async function getPoles(): Promise<PoleData[]> {
  try {
    const { getPayload } = await import('payload')
    const configPromise = (await import('@payload-config')).default
    const payload = await getPayload({ config: configPromise })

    const res = await payload.find({
      collection: 'poles',
      limit: 10,
      sort: 'order',
      where: {
        status: { equals: 'published' },
      },
    })

    if (res.docs && res.docs.length > 0) {
      return res.docs.map((doc: any, idx: number) => ({
        name: doc.name,
        slug: doc.slug,
        num: `0${doc.order || idx + 1}`,
        shortDescription: doc.shortDescription || '',
        description: extractLexicalText(doc.description) || doc.shortDescription || '',
        icon: doc.icon || 'server',
        order: doc.order || idx + 1,
        status: doc.status || 'published',
        domains: doc.shortDescription || '',
        seo: {
          title: doc.seo?.title || `${doc.name} · Bokengi Group`,
          description: doc.seo?.description || doc.shortDescription || '',
        },
      }))
    }
  } catch (_err) {
    // Fallback silencieux sur les données de référence
  }

  return POLES_SEED_DATA
}

/**
 * Récupère un pôle spécifique par son slug ('it', 'digital', 'business', 'consulting', 'events').
 * Filtre uniquement les pôles avec statut 'published'.
 */
export async function getPoleBySlug(slug: string): Promise<PoleData | null> {
  try {
    const { getPayload } = await import('payload')
    const configPromise = (await import('@payload-config')).default
    const payload = await getPayload({ config: configPromise })

    const res = await payload.find({
      collection: 'poles',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      limit: 1,
    })

    if (res.docs && res.docs.length > 0) {
      const doc = res.docs[0] as any
      return {
        name: doc.name,
        slug: doc.slug,
        num: `0${doc.order || 1}`,
        shortDescription: doc.shortDescription || '',
        description: extractLexicalText(doc.description) || doc.shortDescription || '',
        icon: doc.icon || 'server',
        order: doc.order || 1,
        status: doc.status || 'published',
        domains: doc.shortDescription || '',
        seo: {
          title: doc.seo?.title || `${doc.name} · Bokengi Group`,
          description: doc.seo?.description || doc.shortDescription || '',
        },
      }
    }
  } catch (_err) {
    // Fallback
  }

  return POLES_SEED_DATA.find((p) => p.slug === slug) || null
}

/**
 * Récupère les services publiés d'un pôle donné ou tous les services publiés.
 */
export async function getServices(poleSlug?: string): Promise<ServiceData[]> {
  try {
    const { getPayload } = await import('payload')
    const configPromise = (await import('@payload-config')).default
    const payload = await getPayload({ config: configPromise })

    const whereClause: any = {
      status: { equals: 'published' },
    }

    if (poleSlug) {
      // Rechercher par relation pôle publié
      const poleRes = await payload.find({
        collection: 'poles',
        where: {
          slug: { equals: poleSlug },
          status: { equals: 'published' },
        },
        limit: 1,
      })
      if (poleRes.docs.length > 0) {
        whereClause.pole = { equals: poleRes.docs[0].id }
      }
    }

    const res = await payload.find({
      collection: 'services',
      where: whereClause,
      limit: 50,
      sort: 'order',
    })

    if (res.docs && res.docs.length > 0) {
      return res.docs.map((doc: any) => ({
        title: doc.title,
        slug: doc.slug,
        poleSlug: poleSlug || (typeof doc.pole === 'object' ? doc.pole?.slug : ''),
        category: doc.category || '',
        shortDescription: doc.shortDescription || '',
        content: extractLexicalText(doc.content) || doc.shortDescription || '',
        technicalTags: Array.isArray(doc.technicalTags) ? doc.technicalTags : [],
        featured: Boolean(doc.featured),
        order: doc.order || 0,
        status: doc.status || 'published',
      }))
    }
  } catch (_err) {
    // Fallback
  }

  if (poleSlug) {
    return SERVICES_SEED_DATA.filter((s) => s.poleSlug === poleSlug)
  }
  return SERVICES_SEED_DATA
}

/**
 * Récupère l'ensemble des études de cas / réalisations techniques publiées.
 */
export async function getCaseStudies(featuredOnly: boolean = false): Promise<CaseStudyData[]> {
  try {
    const { getPayload } = await import('payload')
    const configPromise = (await import('@payload-config')).default
    const payload = await getPayload({ config: configPromise })

    const whereClause: any = {
      status: { equals: 'published' },
    }
    if (featuredOnly) {
      whereClause.featured = { equals: true }
    }

    const res = await payload.find({
      collection: 'case-studies',
      where: whereClause,
      limit: 20,
    })

    if (res.docs && res.docs.length > 0) {
      return res.docs.map((doc: any) => {
        const seedFallback = CASE_STUDIES_SEED_DATA.find((c) => c.slug === doc.slug)
        return {
          title: doc.title,
          slug: doc.slug,
          clientName: doc.clientName || '',
          category: doc.category || '',
          summary: doc.summary || '',
          context: extractLexicalText(doc.context) || doc.summary || seedFallback?.context || '',
          challenge: extractLexicalText(doc.challenge) || seedFallback?.challenge || '',
          solution: extractLexicalText(doc.solution) || seedFallback?.solution || '',
          results: extractLexicalText(doc.results) || seedFallback?.results || '',
          resultsList: Array.isArray(doc.resultsList) && doc.resultsList.length > 0
            ? doc.resultsList
            : (seedFallback?.resultsList || []),
          technologies: Array.isArray(doc.technologies) ? doc.technologies : (seedFallback?.technologies || []),
          architecture: extractLexicalText(doc.architecture) || seedFallback?.architecture || '',
          featured: Boolean(doc.featured),
          publishedDate: doc.publishedDate || '',
          status: doc.status || 'published',
          screenshots: mapScreenshots(doc.screenshots),
          seo: {
            title: doc.seo?.title || `${doc.title} — Bokengi Group`,
            description: doc.seo?.description || doc.summary || '',
          },
        }
      })
    }
  } catch (_err) {
    // Fallback
  }

  if (featuredOnly) {
    return CASE_STUDIES_SEED_DATA.filter((c) => c.featured)
  }
  return CASE_STUDIES_SEED_DATA
}

/**
 * Récupère une étude de cas publiée par son slug.
 */
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyData | null> {
  try {
    const { getPayload } = await import('payload')
    const configPromise = (await import('@payload-config')).default
    const payload = await getPayload({ config: configPromise })

    const res = await payload.find({
      collection: 'case-studies',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      limit: 1,
    })

    if (res.docs && res.docs.length > 0) {
      const doc = res.docs[0] as any
      const seedFallback = CASE_STUDIES_SEED_DATA.find((c) => c.slug === doc.slug)
      return {
        title: doc.title,
        slug: doc.slug,
        clientName: doc.clientName || '',
        category: doc.category || '',
        summary: doc.summary || '',
        context: extractLexicalText(doc.context) || doc.summary || seedFallback?.context || '',
        challenge: extractLexicalText(doc.challenge) || seedFallback?.challenge || '',
        solution: extractLexicalText(doc.solution) || seedFallback?.solution || '',
        results: extractLexicalText(doc.results) || seedFallback?.results || '',
        resultsList: Array.isArray(doc.resultsList) && doc.resultsList.length > 0
          ? doc.resultsList
          : (seedFallback?.resultsList || []),
        technologies: Array.isArray(doc.technologies) ? doc.technologies : (seedFallback?.technologies || []),
        architecture: extractLexicalText(doc.architecture) || seedFallback?.architecture || '',
        featured: Boolean(doc.featured),
        publishedDate: doc.publishedDate || '',
        status: doc.status || 'published',
        screenshots: mapScreenshots(doc.screenshots),
        seo: {
          title: doc.seo?.title || `${doc.title} — Bokengi Group`,
          description: doc.seo?.description || doc.summary || '',
        },
      }
    }
  } catch (_err) {
    // Fallback
  }

  return CASE_STUDIES_SEED_DATA.find((c) => c.slug === slug) || null
}
