import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import { LexicalRenderer } from '@/components/bokengi/LexicalRenderer'
import { getPosts, getPostBySlug, formatDate } from '@/lib/data'
import { siteConfig } from '@/config/site'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/types'

export const revalidate = 300

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const posts = await getPosts({}, 'fr')
  const locales: Locale[] = ['fr', 'en']
  const params: Array<{ locale: string; slug: string }> = []

  for (const loc of locales) {
    for (const post of posts) {
      params.push({ locale: loc, slug: post.slug })
    }
  }

  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr'
  const t = getDictionary(currentLocale)
  const post = await getPostBySlug(slug, currentLocale)

  if (!post || post.status !== 'published') {
    return {
      title: `${t.errors.notFoundTitle} · Bokengi Group`,
      description: t.errors.notFoundDesc,
    }
  }

  const title = post.seo?.title || `${post.title} — Bokengi Group`
  const description = post.seo?.description || post.excerpt
  const coverUrl = post.coverImage?.url || '/og-image.png'
  const fullCoverUrl = coverUrl.startsWith('http')
    ? coverUrl
    : `${siteConfig.domains.production}${coverUrl}`

  return {
    title,
    description,
    alternates: {
      canonical: `/${currentLocale}/actualites/${post.slug}`,
      languages: {
        fr: `/fr/actualites/${post.slug}`,
        en: `/en/actualites/${post.slug}`,
        'x-default': `/fr/actualites/${post.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.domains.production}/${currentLocale}/actualites/${post.slug}`,
      siteName: siteConfig.name,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author?.name || 'Bokengi Group'],
      images: [
        {
          url: fullCoverUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: currentLocale === 'en' ? 'en_US' : 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullCoverUrl],
    },
  }
}

export default async function PostDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr'
  const t = getDictionary(currentLocale)
  const post = await getPostBySlug(slug, currentLocale)

  if (!post || post.status !== 'published') {
    notFound()
  }

  const allPosts = await getPosts({}, currentLocale)
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2)

  const coverUrl = post.coverImage?.url || '/og-image.png'
  const fullCoverUrl = coverUrl.startsWith('http')
    ? coverUrl
    : `${siteConfig.domains.production}${coverUrl}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    description: post.excerpt,
    url: `${siteConfig.domains.production}/${currentLocale}/actualites/${post.slug}`,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Bokengi Group',
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.domains.production,
      logo: `${siteConfig.domains.production}/bokengi-logo-horizontal.png`,
    },
    image: fullCoverUrl,
  }

  // Estimation du temps de lecture
  const textContent = typeof post.content === 'string' ? post.content : ''
  const wordCount = textContent.split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* ── EN-TÊTE ÉDITORIAL DE L'ARTICLE ── */}
        <header className="py-20 border-b border-[var(--border-subtle)] relative overflow-hidden bg-[var(--bg-surface)]/30">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <div className="container-v4 relative z-10 max-w-4xl">
            {/* Fil d'Ariane & Méta-infos */}
            <div className="flex flex-wrap items-center gap-3 mb-6 text-xs font-mono text-[var(--ink-muted)]">
              <Link
                href={`/${currentLocale}/actualites`}
                className="text-[var(--blue-cyan)] hover:underline inline-flex items-center gap-1"
              >
                ← {t.news.backToNews}
              </Link>
              <span>/</span>
              {post.category && (
                <>
                  <span className="text-[var(--ink-heading)] uppercase font-semibold">
                    {post.category}
                  </span>
                  <span>/</span>
                </>
              )}
              <span>{formatDate(post.publishedAt, currentLocale)}</span>
              <span>·</span>
              <span>{readingTime} {t.common.minuteShort}</span>
            </div>

            {/* Titre Principal */}
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-heading)] tracking-tight leading-tight mb-6">
              {post.title}
            </h1>

            {/* Chapô / Résumé */}
            <p className="text-lg md:text-xl text-[var(--ink-muted)] leading-relaxed font-light mb-8">
              {post.excerpt}
            </p>

            {/* Cartouche Auteur & Direction de Publication */}
            <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--blue-cyan)]/20 border border-[var(--blue-cyan)]/40 flex items-center justify-center font-bold text-[var(--blue-cyan)]">
                  {(post.author?.name || 'BG').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <strong className="text-[var(--ink-heading)] block">{post.author?.name || 'Bokengi Group'}</strong>
                  <span className="text-[var(--ink-muted)]">{post.author?.role || t.common.editorialDirection}</span>
                </div>
              </div>

              {post.category && (
                <span className="px-3 py-1 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--ink-muted)] uppercase">
                  {post.category}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* ── IMAGE DE COUVERTURE ── */}
        {post.coverImage?.url && (
          <div className="container-v4 max-w-4xl mt-12">
            <div className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-subtle)] shadow-lg bg-[var(--bg-surface)]">
              <img
                src={post.coverImage.url}
                alt={post.coverImage.alt || post.title}
                className="w-full max-h-[480px] object-cover"
              />
            </div>
          </div>
        )}

        {/* ── CORPS DE L'ARTICLE (LEXICAL / STRUCTURED BODY) ── */}
        <section className="py-16">
          <div className="container-v4 max-w-3xl">
            {/* Si version anglaise et contenu absent, afficher mention explicite */}
            {currentLocale === 'en' && !post.content && (
              <div className="mb-8 p-4 rounded-[var(--radius-xs)] bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-sm leading-relaxed">
                <strong>{t.common.translationMissing} :</strong> {t.common.translationMissingNotice}
              </div>
            )}

            <LexicalRenderer
              rawContent={post.rawContent}
              contentText={typeof post.content === 'string' ? post.content : undefined}
            />

            {/* Mots-clés / Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-[var(--border-subtle)]">
                <h4 className="text-xs uppercase font-mono tracking-wider text-[var(--ink-muted)] mb-3">
                  {t.news.keywordsLabel}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 text-xs font-mono rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--ink-muted)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── ARTICLES CONNEXES ── */}
        {relatedPosts.length > 0 && (
          <section className="py-16 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/20">
            <div className="container-v4 max-w-4xl">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <Kicker>{t.news.relatedTitle.toUpperCase()}</Kicker>
                  <h3 className="text-2xl font-bold text-[var(--ink-heading)] mt-1">
                    {t.news.relatedTitle}
                  </h3>
                </div>
                <Link
                  href={`/${currentLocale}/actualites`}
                  className="text-xs font-mono text-[var(--blue-cyan)] hover:underline"
                >
                  {t.common.viewAllPublications} →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((rPost) => (
                  <Link
                    key={rPost.slug}
                    href={`/${currentLocale}/actualites/${rPost.slug}`}
                    className="group p-6 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-[var(--ink-muted)] block mb-2">
                        {formatDate(rPost.publishedAt, currentLocale)}
                      </span>
                      <h4 className="text-base font-bold text-[var(--ink-heading)] group-hover:text-[var(--blue-cyan)] transition-colors mb-2">
                        {rPost.title}
                      </h4>
                      <p className="text-xs text-[var(--ink-muted)] line-clamp-2 leading-relaxed">
                        {rPost.excerpt}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-[var(--blue-cyan)] mt-4 inline-flex items-center gap-1">
                      {t.common.readMore} →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
