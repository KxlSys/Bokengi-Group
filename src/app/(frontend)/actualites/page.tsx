import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import { getPosts, getPostCategories, formatFrenchDate } from '@/lib/data'
import { siteConfig } from '@/config/site'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Actualités & Publications d’Expertise — Bokengi Group',
  description:
    'Découvrez les articles d’ingénierie, retours de terrain et visions technologiques des experts de Bokengi Group : infrastructures résilientes, cybersécurité et transformation numérique.',
  alternates: {
    canonical: '/actualites',
  },
  openGraph: {
    title: 'Actualités & Publications d’Expertise — Bokengi Group',
    description:
      'Analyses d’ingénierie, retours de terrain et perspectives technologiques par Bokengi Group.',
    url: `${siteConfig.domains.production}/actualites`,
    siteName: 'Bokengi Group',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Actualités & Publications d’Expertise — Bokengi Group',
      },
    ],
  },
}

interface ActualitesPageProps {
  searchParams: Promise<{ categorie?: string }>
}

export default async function ActualitesPage({ searchParams }: ActualitesPageProps) {
  const { categorie } = await searchParams
  const selectedCategory = categorie ? decodeURIComponent(categorie) : undefined

  const [posts, categories] = await Promise.all([
    getPosts({ category: selectedCategory }),
    getPostCategories(),
  ])

  const featuredPost = posts[0]
  const remainingPosts = posts.slice(1)

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Actualités & Publications Bokengi Group',
    description:
      'Analyses d’ingénierie, retours de terrain et perspectives technologiques par les experts de Bokengi Group.',
    url: `${siteConfig.domains.production}/actualites`,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.domains.production,
    },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.excerpt,
      url: `${siteConfig.domains.production}/actualites/${p.slug}`,
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
            <Kicker>PUBLICATIONS & PERSPECTIVES</Kicker>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-3 mb-6">
              Analyses d’ingénierie, retours de terrain et visions technologiques.
            </h1>
            <p className="text-lg md:text-xl text-[var(--ink-muted)] leading-relaxed font-light">
              Retrouvez les publications de nos ingénieurs et experts : décryptage des défis d’infrastructure,
              souveraineté numérique, sécurité dès la conception et modernisation des systèmes d’information.
            </p>
          </div>
        </section>

        {/* ── FILTRE PAR CATÉGORIE MÉTIER ── */}
        {categories.length > 0 && (
          <section className="py-6 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/40 sticky top-16 z-20 backdrop-blur-md">
            <div className="container-v4 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <span className="text-xs font-mono uppercase text-[var(--ink-muted)] mr-2 shrink-0">
                Thématiques :
              </span>
              <Link
                href="/actualites"
                className={`px-3 py-1.5 text-xs font-mono rounded-[var(--radius-xs)] border transition-colors shrink-0 ${
                  !selectedCategory
                    ? 'border-[var(--blue-cyan)] text-[var(--blue-cyan)] bg-[var(--bg-elevated)] font-semibold'
                    : 'border-[var(--border-subtle)] text-[var(--ink-muted)] hover:border-[var(--border-medium)] hover:text-[var(--ink-heading)]'
                }`}
              >
                Toutes les publications ({posts.length})
              </Link>
              {categories.map((cat) => {
                const isActive = selectedCategory?.toLowerCase() === cat.toLowerCase()
                return (
                  <Link
                    key={cat}
                    href={`/actualites?categorie=${encodeURIComponent(cat)}`}
                    className={`px-3 py-1.5 text-xs font-mono rounded-[var(--radius-xs)] border transition-colors shrink-0 ${
                      isActive
                        ? 'border-[var(--blue-cyan)] text-[var(--blue-cyan)] bg-[var(--bg-elevated)] font-semibold'
                        : 'border-[var(--border-subtle)] text-[var(--ink-muted)] hover:border-[var(--border-medium)] hover:text-[var(--ink-heading)]'
                    }`}
                  >
                    {cat}
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ── GRILLE DES PUBLICATIONS ── */}
        <section className="py-20">
          <div className="container-v4 space-y-16">
            {posts.length === 0 ? (
              <div className="text-center py-20 p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] max-w-2xl mx-auto">
                <p className="text-lg text-[var(--ink-muted)] mb-4">
                  Aucune publication ne correspond à ce critère pour le moment.
                </p>
                <Link href="/actualites" className="btn-v4-secondary inline-flex items-center gap-2">
                  ← Voir toutes les publications
                </Link>
              </div>
            ) : (
              <>
                {/* ── ARTICLE MIS EN AVANT (FEATURED) ── */}
                {featuredPost && (
                  <article className="p-8 md:p-12 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="font-mono text-xs font-bold text-[var(--blue-cyan)] uppercase">
                        {featuredPost.categories[0] || 'PUBLICATION MAJEURE'}
                      </span>
                      <span className="text-xs text-[var(--ink-muted)]">/</span>
                      <span className="text-xs font-mono text-[var(--ink-muted)]">
                        {formatFrenchDate(featuredPost.publishedAt)}
                      </span>
                      <span className="text-xs text-[var(--ink-muted)]">/</span>
                      <span className="text-xs font-mono text-[var(--ink-muted)]">
                        {featuredPost.readingTime} min de lecture
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-4xl font-extrabold text-[var(--ink-heading)] tracking-tight mb-4">
                      <Link
                        href={`/actualites/${featuredPost.slug}`}
                        className="hover:text-[var(--blue-cyan)] transition-colors"
                      >
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <p className="text-base md:text-lg text-[var(--ink-muted)] leading-relaxed font-light mb-8 max-w-4xl">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[var(--border-subtle)]">
                      <div className="flex items-center gap-3">
                        {featuredPost.author && (
                          <div className="text-xs font-mono text-[var(--ink-muted)]">
                            Auteur :{' '}
                            <strong className="text-[var(--ink-heading)]">
                              {featuredPost.author.name}
                            </strong>
                            {featuredPost.author.role && (
                              <span className="opacity-70"> · {featuredPost.author.role}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <Link
                        href={`/actualites/${featuredPost.slug}`}
                        className="text-sm font-semibold text-[var(--blue-cyan)] hover:underline inline-flex items-center gap-1.5"
                      >
                        Lire la publication complète <span>→</span>
                      </Link>
                    </div>
                  </article>
                )}

                {/* ── GRILLE 2 COLONNES POUR LES SUIVANTS ── */}
                {remainingPosts.length > 0 && (
                  <div>
                    <div className="mb-8">
                      <Kicker>TOUTES LES PERSPECTIVES</Kicker>
                      <h3 className="text-2xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-1">
                        Dernières publications parues
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {remainingPosts.map((post) => (
                        <article
                          key={post.slug}
                          className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className="font-mono text-xs font-bold text-[var(--blue-cyan)] uppercase">
                                {post.categories[0] || 'ACTUALITÉ'}
                              </span>
                              <span className="text-xs text-[var(--ink-muted)]">·</span>
                              <span className="text-xs font-mono text-[var(--ink-muted)]">
                                {formatFrenchDate(post.publishedAt)}
                              </span>
                              <span className="text-xs text-[var(--ink-muted)]">·</span>
                              <span className="text-xs font-mono text-[var(--ink-muted)]">
                                {post.readingTime} min
                              </span>
                            </div>

                            <h3 className="text-xl font-bold text-[var(--ink-heading)] tracking-tight mb-3">
                              <Link
                                href={`/actualites/${post.slug}`}
                                className="hover:text-[var(--blue-cyan)] transition-colors"
                              >
                                {post.title}
                              </Link>
                            </h3>

                            <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-6 font-light line-clamp-3">
                              {post.excerpt}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-4">
                            {post.author ? (
                              <span className="text-xs font-mono text-[var(--ink-muted)] truncate max-w-[200px]">
                                {post.author.name}
                              </span>
                            ) : (
                              <span className="text-xs font-mono text-[var(--ink-muted)]">Bokengi Group</span>
                            )}

                            <Link
                              href={`/actualites/${post.slug}`}
                              className="text-xs font-mono font-semibold text-[var(--blue-cyan)] hover:underline shrink-0"
                            >
                              Lire l’article →
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ── SECTION CTA TECHNIQUE ── */}
        <section className="py-20 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/30 relative overflow-hidden">
          <div className="pattern-dotted-radial-center" aria-hidden="true" />
          <div className="container-v4 relative z-10 text-center max-w-3xl mx-auto">
            <Kicker>COLLABORATION TECHNIQUE</Kicker>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--ink-heading)] mt-2 mb-4">
              Un enjeu technologique à résoudre dans votre organisation ?
            </h2>
            <p className="text-base text-[var(--ink-muted)] mb-8 leading-relaxed">
              Consultez notre direction technique pour analyser l’architecture de vos systèmes,
              renforcer votre résilience et accélérer vos livrables.
            </p>
            <Link href="/contact?type=cadrage" className="btn-v4-primary">
              Échanger avec notre direction technique →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
