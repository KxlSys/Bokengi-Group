import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import { getPoles, getPoleBySlug, getServices } from '@/lib/data'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const poles = await getPoles()
  return poles.map((pole) => ({
    slug: pole.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const pole = await getPoleBySlug(slug)

  if (!pole) {
    return {
      title: 'Pôle introuvable · Bokengi Group',
    }
  }

  return {
    title: pole.seo.title,
    description: pole.seo.description,
    openGraph: {
      title: pole.seo.title,
      description: pole.seo.description,
      url: `https://bokengi.vercel.app/expertises/${pole.slug}`,
      siteName: 'Bokengi Group',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: pole.name,
        },
      ],
    },
  }
}

export default async function PoleDetailPage({ params }: PageProps) {
  const { slug } = await params
  const pole = await getPoleBySlug(slug)

  if (!pole) {
    notFound()
  }

  const allPoles = await getPoles()
  const services = await getServices(slug)

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]">
      <Navbar />

      <main className="flex-1">
        {/* ── EN-TÊTE DU PÔLE SPÉCIFIQUE ── */}
        <section className="py-24 border-b border-[var(--border-subtle)] relative overflow-hidden">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <div className="container-v4 relative z-10 max-w-4xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs font-bold text-[var(--blue-cyan)]">
                PÔLE {pole.num}
              </span>
              <span className="text-xs text-[var(--ink-muted)]">/</span>
              <Link href="/expertises" className="text-xs font-mono text-[var(--ink-muted)] hover:underline">
                EXPERTISES
              </Link>
            </div>
            <Kicker>DIVISION OPÉRATIONNELLE</Kicker>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-3 mb-4">
              {pole.name}
            </h1>
            <p className="text-sm font-mono text-[var(--blue-cyan)] mb-6">
              {pole.domains}
            </p>
            <p className="text-lg md:text-xl text-[var(--ink-muted)] leading-relaxed font-light">
              {pole.description}
            </p>
          </div>
        </section>

        {/* ── CATALOGUE DES SERVICES DU PÔLE ── */}
        <section className="py-20">
          <div className="container-v4">
            <div className="mb-12">
              <Kicker>PRESTATIONS DU PÔLE</Kicker>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-2">
                Offre de services & livrables
              </h2>
              <p className="text-sm text-[var(--ink-muted)] mt-2">
                Des interventions modulaires pour répondre à chaque étape de vos projets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((srv) => (
                <div
                  key={srv.slug}
                  className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between hover:border-[var(--border-medium)] transition-colors"
                >
                  <div>
                    <div className="text-xs font-mono text-[var(--blue-cyan)] mb-2">
                      {srv.category}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--ink-heading)] mb-3">
                      {srv.title}
                    </h3>
                    <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-4">
                      {srv.shortDescription}
                    </p>
                    <p className="text-sm text-[var(--ink-body)] leading-relaxed mb-6 font-light">
                      {srv.content}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--border-subtle)]">
                    <div className="text-xs font-mono text-[var(--ink-muted)] mb-2">Méthodes & Stacks :</div>
                    <div className="flex flex-wrap gap-1.5">
                      {srv.technicalTags.map((t) => (
                        <span
                          key={t.tag}
                          className="px-2 py-1 text-xs font-mono rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] text-[var(--ink-heading)] border border-[var(--border-subtle)]"
                        >
                          {t.tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NAVIGATION ENTRE LES AUTRES PÔLES ── */}
        <section className="py-16 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/30">
          <div className="container-v4">
            <div className="text-xs font-mono uppercase tracking-wider text-[var(--ink-muted)] mb-6 text-center">
              Explorer les autres divisions du Groupe
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {allPoles
                .filter((p) => p.slug !== pole.slug)
                .map((otherPole) => (
                  <Link
                    key={otherPole.slug}
                    href={`/expertises/${otherPole.slug}`}
                    className="p-4 rounded-[var(--radius-sm)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--blue-cyan)] transition-colors text-center group"
                  >
                    <div className="font-mono text-xs text-[var(--blue-cyan)] mb-1">
                      {otherPole.num}
                    </div>
                    <div className="text-sm font-bold text-[var(--ink-heading)] group-hover:text-[var(--blue-cyan)] transition-colors">
                      {otherPole.name}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* ── CTA CONTEXTUEL DU PÔLE ── */}
        <section className="py-20 border-t border-[var(--border-subtle)]">
          <div className="container-v4 max-w-3xl text-center mx-auto">
            <Kicker>COLLABORER AVEC CE PÔLE</Kicker>
            <h2 className="text-3xl font-extrabold text-[var(--ink-heading)] mt-2 mb-4">
              Besoin d\'une intervention {pole.name} ?
            </h2>
            <p className="text-base text-[var(--ink-muted)] mb-8 leading-relaxed">
              Consultez notre équipe d\'ingénieurs et spécialistes pour un devis détaillé, un diagnostic initial ou un cadrage technique d\'envergure.
            </p>
            <Link
              href={`/contact?pole=${pole.slug}&type=devis`}
              className="btn-v4-primary inline-flex items-center gap-2"
            >
              Demander un devis pour {pole.name} <span>→</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
