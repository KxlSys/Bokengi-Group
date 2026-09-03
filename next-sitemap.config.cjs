const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  'https://bokengi.vercel.app'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: ['/admin', '/admin/*', '/api/*', '/next/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*', '/next/*'],
      },
    ],
  },
}
