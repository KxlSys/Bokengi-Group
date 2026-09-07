import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'
import { siteConfig } from '@/config/site'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: siteConfig.description,
  images: [
    {
      url: `${getServerSideURL()}/og-image.png`,
    },
  ],
  siteName: siteConfig.name,
  title: `${siteConfig.name} · ${siteConfig.tagline}`,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
