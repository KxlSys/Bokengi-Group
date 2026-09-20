import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import { getPosts, getPostCategories, formatDate } from '@/lib/data'
import { siteConfig } from '@/config/site'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/types'

export const revalidate = 300

interface ActualitesPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ categorie?: string }>
}

export async function generateMetadata({ params }: ActualitesPageProps): Promise<Metadata> {
  const { locale } = await params
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr'
  const t = getDictionary(currentLocale)

  return {
    title: t.news.metaTitle,
    description: t.news.metaDescription,
    alternates: {
      canonical: `/${currentLocale}/actualites`,
      languages: {
        fr: '/fr/actualites',
        en: '/en/actualites',
        'x-default': '/fr/actualites',
      },
    },
    openGraph: {
      title: t.news.metaTitle,
      description: t.news.metaDescription,
      url: `${siteConfig.domains.production}/${currentLocale}/actualites`,
      siteName: siteConfig.name,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: t.news.metaTitle,
        },
      ],
      locale: currentLocale === 'en' ? 'en_US' : 'fr_FR',
    },
  }
}

export default async function ActualitesPage({ params, searchParams }: ActualitesPageProps) {
  const { locale } = await params
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr'
  const t = getDictionary(currentLocale)

  const { categorie } = await searchParams
  const selectedCategory = categorie ? decodeURIComponent(categorie) : undefined

  const [posts, categories] = await Promise.all([
    getPosts({ category: selectedCategory }, currentLocale),
    getPostCategories(),
  ])

  const featuredPost = posts[0]
  const remainingPosts = posts.slice(1)

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: t.news.metaTitle,
    description: t.news.metaDescription,
    url: `${siteConfig.domains.production}/${currentLocale}/actualites`,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.domains.production,
    },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.excerpt,
      url: `${siteConfig.domains.production}/${currentLocale}/actualites/${p.slug}`,
      datePublished: p.publishedAt,
      author: {
        '@type': 'Person',
        name: p.author?.name || 'Bokengi Group',
      },
    })),
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* ── EN-TÊTE ÉDITORIAL ── */}
        <section className="py-24 border-b border-[var(--border-subtle)] relative overflow-hidden">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <div className="container-v4 relative z-10 max-w-4xl">
            <Kicker>{t.news.kicker}</Kicker>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-3 mb-6">
              {t.news.title}
            </h1>
            <p className="text-lg md:text-xl text-[var(--ink-muted)] leading-relaxed font-light">
              {t.news.lead}
            </p>
          </div>
        </section>

        {/* ── FILTRES PAR CATÉGORIES ── */}
        {categories.length > 0 && (
          <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/40">
            <div className="container-v4 py-4">
              <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
                <span className="text-[var(--ink-muted)] mr-2 shrink-0">{t.common.filter} :</span>
                <Link
                  href={`/${currentLocale}/actualites`}
                  className={`px-3 py-1.5 rounded-[var(--radius-xs)] border transition-colors shrink-0 ${
                    !selectedCategory
                      ? 'bg-[var(--blue-cyan)] text-[var(--bg-main)] font-bold border-[var(--blue-cyan)]'
                      : 'bg-[var(--bg-surface)] text-[var(--ink-muted)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
                  }`}
                >
                  {t.common.all}
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/${currentLocale}/actualites?categorie=${encodeURIComponent(cat)}`}
                    className={`px-3 py-1.5 rounded-[var(--radius-xs)] border transition-colors shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-[var(--blue-cyan)] text-[var(--bg-main)] font-bold border-[var(--blue-cyan)]'
                        : 'bg-[var(--bg-surface)] text-[var(--ink-muted)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
                    }`}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── LISTING DES ARTICLES ── */}
        <section className="py-16">
          <div className="container-v4">
            {posts.length === 0 ? (
              <div className="p-12 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center max-w-xl mx-auto">
                <p className="text-base text-[var(--ink-muted)] mb-4">
                  {t.news.noPosts}
                </p>
                <Link href={`/${currentLocale}/actualites`} className="btn-v4-secondary text-xs">
                  {t.common.all}
                </Link>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Article à la une (Uniquement si aucun filtre de catégorie actif) */}
                {featuredPost && !selectedCategory && (
                  <article className="p-8 md:p-12 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      <div className="lg:col-span-8">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="font-mono text-xs font-bold text-[var(--blue-cyan)] uppercase">
                            {t.news.featuredBadge}
                          </span>
                          <span className="text-xs text-[var(--ink-muted)]">·</span>
                          <span className="text-xs font-mono text-[var(--ink-muted)]">
                            {formatDate(featuredPost.publishedAt, currentLocale)}
                          </span>
                          {featuredPost.category && (
                            <>
                              <span className="text-xs text-[var(--ink-muted)]">·</span>
                              <span className="text-xs font-mono text-[var(--blue-cyan)]">
                                {featuredPost.category}
                              </span>
                            </>
                          )}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--ink-heading)] tracking-tight mb-4">
                          <Link
                            href={`/${currentLocale}/actualites/${featuredPost.slug}`}
                            className="hover:text-[var(--blue-cyan)] transition-colors"
                          >
                            {featuredPost.title}
                          </Link>
                        </h2>
                        <p className="text-base text-[var(--ink-muted)] leading-relaxed mb-6 font-light">
                          {featuredPost.excerpt}
                        </p>
                        <Link
                          href={`/${currentLocale}/actualites/${featuredPost.slug}`}
                          className="text-sm font-mono text-[var(--blue-cyan)] hover:underline inline-flex items-center gap-1.5"
                        >
                          {t.news.readFullPublication} <span>→</span>
                        </Link>
                      </div>
                      {featuredPost.coverImage?.url && (
                        <div className="lg:col-span-4 rounded-[var(--radius-sm)] overflow-hidden border border-[var(--border-subtle)]">
                          <img
                            src={featuredPost.coverImage.url}
                            alt={featuredPost.coverImage.alt || featuredPost.title}
                            className="w-full h-48 lg:h-56 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </article>
                )}

                {/* Grille des autres articles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(selectedCategory ? posts : remainingPosts).map((post) => (
                    <article
                      key={post.slug}
                      className="p-6 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between hover:border-[var(--border-medium)] transition-colors"
                    >
                      <div>
                        {post.coverImage?.url && (
                          <div className="mb-4 rounded-[var(--radius-xs)] overflow-hidden border border-[var(--border-subtle)]">
                            <img
                              src={post.coverImage.url}
                              alt={post.coverImage.alt || post.title}
                              className="w-full h-40 object-cover"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[var(--ink-muted)]">
                          <span>{formatDate(post.publishedAt, currentLocale)}</span>
                          {post.category && (
                            <>
                              <span>·</span>
                              <span className="text-[var(--blue-cyan)]">{post.category}</span>
                            </>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-[var(--ink-heading)] mb-3 leading-snug">
                          <Link
                            href={`/${currentLocale}/actualites/${post.slug}`}
                            className="hover:text-[var(--blue-cyan)] transition-colors"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-6">
                          {post.excerpt}
                        </p>
                      </div>

                      <Link
                        href={`/${currentLocale}/actualites/${post.slug}`}
                        className="text-xs font-mono text-[var(--blue-cyan)] hover:underline inline-flex items-center gap-1 mt-auto"
                      >
                        {t.common.readMore} <span>→</span>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
