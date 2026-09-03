import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  const legacyRedirects = [
    {
      source: '/projects',
      destination: '/realisations',
      permanent: true,
    },
    {
      source: '/projets',
      destination: '/realisations',
      permanent: true,
    },
    {
      source: '/group',
      destination: '/groupe',
      permanent: true,
    },
    {
      source: '/devis',
      destination: '/contact?type=devis',
      permanent: true,
    },
  ]

  return [internetExplorerRedirect, ...legacyRedirects]
}
