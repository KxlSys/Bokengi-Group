import type { Payload } from 'payload'

export interface ContentItemCount {
  slug: string
  label: string
  singularLabel: string
  count: number
  adminUrl: string
  createUrl: string
}

export interface ContentOverviewData {
  items: ContentItemCount[]
  totalContent: number
}

export interface ContentOverviewResult {
  data: ContentOverviewData | null
  error: string | null
}

async function countCollection(payload: Payload, slug: string): Promise<number> {
  try {
    if (typeof payload.count === 'function') {
      const res = await payload.count({
        collection: slug as any,
        overrideAccess: true,
      })
      return typeof res.totalDocs === 'number' ? res.totalDocs : 0
    }

    const res = await payload.find({
      collection: slug as any,
      limit: 0,
      depth: 0,
      pagination: true,
      overrideAccess: true,
    })
    return typeof res.totalDocs === 'number' ? res.totalDocs : 0
  } catch (err) {
    console.warn(`Could not count collection ${slug}:`, err)
    return 0
  }
}

/**
 * Récupère les métriques réelles des contenus enregistrés dans Payload CMS.
 * Zéro donnée fictive — seuls les totaux exacts des collections sont comptabilisés.
 */
export async function getContentOverview(payloadInstance?: Payload): Promise<ContentOverviewResult> {
  try {
    let payload = payloadInstance
    if (!payload) {
      const { getPayload } = await import('payload')
      const configPromise = (await import('@payload-config')).default
      payload = await getPayload({ config: configPromise })
    }

    const [postsCount, caseStudiesCount, mediaCount, pagesCount] = await Promise.all([
      countCollection(payload, 'posts'),
      countCollection(payload, 'case-studies'),
      countCollection(payload, 'media'),
      countCollection(payload, 'pages'),
    ])

    const items: ContentItemCount[] = [
      {
        slug: 'posts',
        label: "Articles d'expertise",
        singularLabel: 'Article',
        count: postsCount,
        adminUrl: '/admin/collections/posts',
        createUrl: '/admin/collections/posts/create',
      },
      {
        slug: 'case-studies',
        label: 'Études de cas & Réalisations',
        singularLabel: 'Réalisation',
        count: caseStudiesCount,
        adminUrl: '/admin/collections/case-studies',
        createUrl: '/admin/collections/case-studies/create',
      },
      {
        slug: 'pages',
        label: 'Pages institutionnelles',
        singularLabel: 'Page',
        count: pagesCount,
        adminUrl: '/admin/collections/pages',
        createUrl: '/admin/collections/pages/create',
      },
      {
        slug: 'media',
        label: 'Bibliothèque de médias',
        singularLabel: 'Fichier média',
        count: mediaCount,
        adminUrl: '/admin/collections/media',
        createUrl: '/admin/collections/media/create',
      },
    ]

    const totalContent = postsCount + caseStudiesCount + mediaCount + pagesCount

    return {
      data: {
        items,
        totalContent,
      },
      error: null,
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Erreur inconnue lors du comptage des contenus'
    console.error('getContentOverview failed:', message)
    return {
      data: null,
      error: message,
    }
  }
}
