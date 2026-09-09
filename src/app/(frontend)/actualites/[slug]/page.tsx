import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import { LexicalRenderer } from '@/components/bokengi/LexicalRenderer'
import { getPosts, getPostBySlug, formatFrenchDate } from '@/lib/data'
import { siteConfig } from '@/config/site'

export const revalidate = 300

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post || post.status !== 'published') {
    return {
      title: 'Publication introuvable · Bokengi Group',
      description: 'L’article demandé est indisponible ou n’a pas encore été publié.',
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
      canonical: `/actualites/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.domains.production}/actualites/${post.slug}`,
      siteName: 'Bokengi Group',
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
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post || post.status !== 'published') {
    notFound()
  }

  // Récupération des articles connexes (autres publications publiées)
  const allPosts = await getPosts()
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
    url: `${siteConfig.domains.production}/actualites/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    image: fullCoverUrl,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Bokengi Group',
      ...(post.author?.role ? { jobTitle: post.author.role } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.domains.production,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.domains.production}/bokengi-logo-horizontal.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.domains.production}/actualites/${post.slug}`,
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* ── EN-TÊTE ÉDITORIAL DE L'ARTICLE ── */}
        <section className="py-20 border-b border-[var(--border-subtle)] relative overflow-hidden">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <div className="container-v4 relative z-10 max-w-4xl">
            {/* Fil d'Ariane */}
            <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 mb-4">
              <Link href="/" className="text-xs font-mono text-[var(--ink-muted)] hover:underline">
                Accueil
              </Link>
              <span className="text-xs text-[var(--ink-muted)]">/</span>
              <Link href="/actualites" className="text-xs font-mono text-[var(--ink-muted)] hover:underline">
                Actualités
              </Link>
              <span className="text-xs text-[var(--ink-muted)]">/</span>
              <span className="text-xs font-mono text-[var(--blue-cyan)] uppercase">
                {post.categories[0] || 'Article'}
              </span>
            </nav>

            <Kicker>{post.categories[0] || 'PUBLICATION D’EXPERTISE'}</Kicker>

            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-3 mb-6">
              {post.title}
            </h1>

            <p className="text-lg md:text-xl text-[var(--ink-muted)] leading-relaxed font-light mb-8">
              {post.excerpt}
            </p>

            {/* Méta-barre Auteur, Date & Temps de lecture */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[var(--border-subtle)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center font-mono text-xs font-bold text-[var(--blue-cyan)]">
                  BK
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--ink-heading)]">
                    {post.author?.name || 'Bokengi Group'}
                  </div>
                  {post.author?.role && (
                    <div className="text-xs font-mono text-[var(--ink-muted)]">
                      {post.author.role}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-[var(--ink-muted)]">
                <span>{formatFrenchDate(post.publishedAt)}</span>
                <span>·</span>
                <span>{post.readingTime} min de lecture</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── IMAGE DE COUVERTURE OPTIONNELLE ── */}
        {post.coverImage && post.coverImage.url && (
          <section className="pt-12">
            <div className="container-v4 max-w-4xl">
              <figure className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40">
                <img
                  src={post.coverImage.url}
                  alt={post.coverImage.alt || post.title}
                  className="w-full h-auto object-cover max-h-[440px]"
                  loading="eager"
                />
              </figure>
            </div>
          </section>
        )}

        {/* ── CORPS DE L'ARTICLE ── */}
        <section className="py-16">
          <div className="container-v4 max-w-3xl">
            <article>
              <LexicalRenderer
                rawContent={post.rawContent}
                contentText={post.content}
              />
            </article>

            {/* ── TAGS DE L'ARTICLE ── */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-8 mt-12 border-t border-[var(--border-subtle)]">
                <div className="text-xs font-mono uppercase text-[var(--ink-muted)] mb-3">
                  Indexation & Mots-clés :
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs font-mono rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] text-[var(--ink-heading)] border border-[var(--border-subtle)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── ENCADRÉ AUTEUR & SIGNATURE ── */}
            <div className="mt-12 p-6 rounded-[var(--radius-sm)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono uppercase text-[var(--blue-cyan)] mb-1">
                  Direction de publication
                </div>
                <div className="text-base font-bold text-[var(--ink-heading)]">
                  {post.author?.name || 'Bokengi Group'}
                </div>
                <p className="text-xs text-[var(--ink-muted)] mt-1">
                  Ingénierie informatique, résilience des infrastructures et développement numérique.
                </p>
              </div>

              <Link href="/contact?type=cadrage" className="btn-v4-secondary shrink-0 text-xs font-mono">
                Consulter l’équipe →
              </Link>
            </div>

            {/* Retour aux actualités */}
            <div className="mt-8 text-center">
              <Link
                href="/actualites"
                className="text-xs font-mono text-[var(--ink-muted)] hover:text-[var(--blue-cyan)] transition-colors inline-flex items-center gap-1.5"
              >
                ← Retour à toutes les publications
              </Link>
            </div>
          </div>
        </section>

        {/* ── ARTICLES CONNEXES ── */}
        {relatedPosts.length > 0 && (
          <section className="py-16 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/30">
            <div className="container-v4 max-w-4xl">
              <div className="mb-8">
                <Kicker>POURSUIVRE LA LECTURE</Kicker>
                <h3 className="text-2xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-1">
                  Autres publications recommandées
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((rel) => (
                  <article
                    key={rel.slug}
                    className="p-6 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs font-bold text-[var(--blue-cyan)] uppercase">
                          {rel.categories[0] || 'PUBLICATION'}
                        </span>
                        <span className="text-xs text-[var(--ink-muted)]">·</span>
                        <span className="text-xs font-mono text-[var(--ink-muted)]">
                          {rel.readingTime} min
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-[var(--ink-heading)] mb-2">
                        <Link href={`/actualites/${rel.slug}`} className="hover:text-[var(--blue-cyan)]">
                          {rel.title}
                        </Link>
                      </h4>
                      <p className="text-xs text-[var(--ink-muted)] line-clamp-2 mb-4 font-light">
                        {rel.excerpt}
                      </p>
                    </div>

                    <Link
                      href={`/actualites/${rel.slug}`}
                      className="text-xs font-mono font-semibold text-[var(--blue-cyan)] hover:underline inline-flex items-center gap-1"
                    >
                      Lire l’article <span>→</span>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA CONTEXTUEL ── */}
        <section className="py-20 border-t border-[var(--border-subtle)] relative overflow-hidden">
          <div className="pattern-dotted-radial-center" aria-hidden="true" />
          <div className="container-v4 relative z-10 max-w-3xl text-center mx-auto">
            <Kicker>ACCOMPAGNEMENT EXPERT</Kicker>
            <h2 className="text-3xl font-extrabold text-[var(--ink-heading)] mt-2 mb-4">
              Un projet en lien avec cette expertise ?
            </h2>
            <p className="text-base text-[var(--ink-muted)] mb-8 leading-relaxed">
              Nos ingénieurs et consultants conçoivent des architectures résilientes et adaptées à vos contraintes opérationnelles.
            </p>
            <Link href="/contact?type=cadrage" className="btn-v4-primary">
              Cadrer votre projet avec nos spécialistes →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
