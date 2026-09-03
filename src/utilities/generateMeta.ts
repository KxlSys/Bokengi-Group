import type { Metadata } from 'next'
import { mergeOpenGraph } from './mergeOpenGraph'

export const generateMeta = async (args: {
  doc?: {
    meta?: {
      description?: string | null
      image?: any
      title?: string | null
    }
    slug?: string | string[] | null
  } | null
}): Promise<Metadata> => {
  const { doc } = args || {}

  const title = doc?.meta?.title
    ? `${doc.meta.title} · Bokengi Group`
    : 'Bokengi Group · Technology & Services'

  const description =
    doc?.meta?.description ||
    'Bokengi Group réunit des compétences technologiques, numériques et professionnelles.'

  return {
    description,
    openGraph: mergeOpenGraph({
      description,
      images: [
        {
          url: '/og-image.png',
        },
      ],
      title,
      url: Array.isArray(doc?.slug) ? doc.slug.join('/') : '/',
    }),
    title,
  }
}
