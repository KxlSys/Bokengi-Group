import {
  POLES_SEED_DATA,
  SERVICES_SEED_DATA,
  CASE_STUDIES_SEED_DATA,
  PoleData,
  ServiceData,
  CaseStudyData,
} from '@/data/bokengi-seed-data'

/**
 * Récupère l'ensemble des 5 pôles Bokengi.
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
        description: typeof doc.description === 'string' ? doc.description : (doc.shortDescription || ''),
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
        description: typeof doc.description === 'string' ? doc.description : (doc.shortDescription || ''),
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
 * Récupère les services d'un pôle donné ou tous les services.
 */
export async function getServices(poleSlug?: string): Promise<ServiceData[]> {
  try {
    const { getPayload } = await import('payload')
    const configPromise = (await import('@payload-config')).default
    const payload = await getPayload({ config: configPromise })

    const whereClause: any = {}
    if (poleSlug) {
      // Rechercher par relation pôle
      const poleRes = await payload.find({
        collection: 'poles',
        where: { slug: { equals: poleSlug } },
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
        content: typeof doc.content === 'string' ? doc.content : (doc.shortDescription || ''),
        technicalTags: Array.isArray(doc.technicalTags) ? doc.technicalTags : [],
        featured: Boolean(doc.featured),
        order: doc.order || 0,
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
 * Récupère l'ensemble des études de cas / réalisations techniques.
 */
export async function getCaseStudies(featuredOnly: boolean = false): Promise<CaseStudyData[]> {
  try {
    const { getPayload } = await import('payload')
    const configPromise = (await import('@payload-config')).default
    const payload = await getPayload({ config: configPromise })

    const whereClause: any = {}
    if (featuredOnly) {
      whereClause.featured = { equals: true }
    }

    const res = await payload.find({
      collection: 'case-studies',
      where: whereClause,
      limit: 20,
    })

    if (res.docs && res.docs.length > 0) {
      return res.docs.map((doc: any) => ({
        title: doc.title,
        slug: doc.slug,
        clientName: doc.clientName || '',
        category: doc.category || '',
        summary: doc.summary || '',
        context: typeof doc.context === 'string' ? doc.context : (doc.summary || ''),
        challenge: typeof doc.challenge === 'string' ? doc.challenge : '',
        solution: typeof doc.solution === 'string' ? doc.solution : '',
        results: typeof doc.results === 'string' ? doc.results : '',
        resultsList: [],
        technologies: Array.isArray(doc.technologies) ? doc.technologies : [],
        architecture: typeof doc.architecture === 'string' ? doc.architecture : '',
        featured: Boolean(doc.featured),
        publishedDate: doc.publishedDate || '',
        seo: {
          title: doc.seo?.title || `${doc.title} — Bokengi Group`,
          description: doc.seo?.description || doc.summary || '',
        },
      }))
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
 * Récupère une étude de cas par son slug.
 */
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyData | null> {
  try {
    const { getPayload } = await import('payload')
    const configPromise = (await import('@payload-config')).default
    const payload = await getPayload({ config: configPromise })

    const res = await payload.find({
      collection: 'case-studies',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (res.docs && res.docs.length > 0) {
      const doc = res.docs[0] as any
      return {
        title: doc.title,
        slug: doc.slug,
        clientName: doc.clientName || '',
        category: doc.category || '',
        summary: doc.summary || '',
        context: typeof doc.context === 'string' ? doc.context : '',
        challenge: typeof doc.challenge === 'string' ? doc.challenge : '',
        solution: typeof doc.solution === 'string' ? doc.solution : '',
        results: typeof doc.results === 'string' ? doc.results : '',
        resultsList: [],
        technologies: Array.isArray(doc.technologies) ? doc.technologies : [],
        architecture: typeof doc.architecture === 'string' ? doc.architecture : '',
        featured: Boolean(doc.featured),
        publishedDate: doc.publishedDate || '',
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
