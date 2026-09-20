import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_LOCALES = ['fr', 'en'] as const
type Locale = (typeof PUBLIC_LOCALES)[number]

function getLocale(request: NextRequest): Locale {
  // 1. Check cookie: bokengi_locale or payload-lng
  const cookieLocale =
    request.cookies.get('bokengi_locale')?.value ||
    request.cookies.get('payload-lng')?.value
  if (cookieLocale && (PUBLIC_LOCALES as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as Locale
  }

  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const lower = acceptLanguage.toLowerCase()
    const enIndex = lower.indexOf('en')
    const frIndex = lower.indexOf('fr')
    if (enIndex !== -1 && (frIndex === -1 || enIndex < frIndex)) {
      return 'en'
    }
  }

  // 3. Fallback default
  return 'fr'
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // 1. Never redirect Payload admin, API, media, next internal, or static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/media') ||
    pathname.startsWith('/next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 2. Check if the pathname already starts with a supported locale (/fr or /en)
  const pathnameHasLocale = PUBLIC_LOCALES.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`),
  )

  if (pathnameHasLocale) {
    const locale = pathname.split('/')[1] as Locale
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-bokengi-locale', locale)

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
    return response
  }

  // 3. Unprefixed route: detect locale and redirect cleanly
  const locale = getLocale(request)
  const targetPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`
  const targetUrl = new URL(targetPath + search, request.url)

  return NextResponse.redirect(targetUrl, 307)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - admin
     * - api
     */
    '/((?!_next/static|_next/image|admin|api|media|favicon.ico).*)',
  ],
}
