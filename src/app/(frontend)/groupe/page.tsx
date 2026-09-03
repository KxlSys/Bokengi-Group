import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import { getPoles } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Le Groupe · Vision, Gouvernance & Pôles Intégrés — Bokengi Group',
  description:
    'Découvrez l\'organisation et la vision de Bokengi Group : cinq expertises synergiques au service de la transformation technologique et de la souveraineté numérique.',
}

export default async function GroupePage() {
  const poles = await getPoles()

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]">
      <Navbar />

      <main className="flex-1">
        {/* ── EN-TÊTE INSTITUTIONNEL ── */}
        <section className="py-24 border-b border-[var(--border-subtle)] relative overflow-hidden">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <div className="container-v4 relative z-10 max-w-4xl">
            <Kicker>LE GROUPE</Kicker>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-3 mb-6">
              Construire. Protéger. Développer.
            </h1>
            <p className="text-lg md:text-xl text-[var(--ink-muted)] leading-relaxed mb-6 font-light">
              Bokengi Group réunit des compétences technologiques, numériques et professionnelles au service des organisations privées et publiques en Afrique et à l\'international.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-[var(--blue-cyan)]">
              <span className="px-3 py-1.5 rounded-[var(--radius-xs)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                5 DIVISIONS INTÉGRÉES
              </span>
              <span className="px-3 py-1.5 rounded-[var(--radius-xs)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                SOUVERAINETÉ NUMÉRIQUE
              </span>
              <span className="px-3 py-1.5 rounded-[var(--radius-xs)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                INGÉNIERIE DURCIE
              </span>
            </div>
          </div>
        </section>

        {/* ── NOTRE MISSION & VISION ── */}
        <section className="py-20 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/40">
          <div className="container-v4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <Kicker>NOTRE MISSION</Kicker>
                <h3 className="text-2xl font-bold text-[var(--ink-heading)] mt-2 mb-4">
                  Bâtir des solutions résilientes et pérennes
                </h3>
                <p className="text-base text-[var(--ink-muted)] leading-relaxed">
                  Fournir aux entreprises, institutions et porteurs de projets des infrastructures stables, des logiciels sur-mesure et un accompagnement de proximité. Nous refusons les solutions éphémères au profit d\'architectures rigoureusement pensées pour durer.
                </p>
              </div>

              <div className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <Kicker>NOTRE VISION</Kicker>
                <h3 className="text-2xl font-bold text-[var(--ink-heading)] mt-2 mb-4">
                  Être le partenaire technologique de référence
                </h3>
                <p className="text-base text-[var(--ink-muted)] leading-relaxed">
                  Valoriser les talents locaux, favoriser la maîtrise technologique endogène et hisser les standards de cybersécurité et de digitalisation aux meilleurs niveaux internationaux pour le continent.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── UN MODÈLE EN 5 DIVISIONS SYNERGIQUES ── */}
        <section className="py-24">
          <div className="container-v4">
            <div className="max-w-2xl mb-14">
              <Kicker>ORGANISATION OPÉRATIONNELLE</Kicker>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-2">
                Cinq pôles pour couvrir l\'intégralité du cycle de valeur
              </h2>
              <p className="text-base text-[var(--ink-muted)] mt-4 leading-relaxed">
                Chaque pôle dispose d\'une équipe dédiée tout en collaborant étroitement avec les autres divisions sur les projets transverses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {poles.map((pole) => (
                <div
                  key={pole.slug}
                  className="p-6 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between hover:border-[var(--border-medium)] transition-colors"
                >
                  <div>
                    <div className="font-mono text-sm font-bold text-[var(--blue-cyan)] mb-2">
                      {pole.num}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--ink-heading)] mb-3">
                      {pole.name}
                    </h3>
                    <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-6">
                      {pole.shortDescription}
                    </p>
                  </div>
                  <Link
                    href={`/expertises/${pole.slug}`}
                    className="text-xs font-mono text-[var(--blue-cyan)] hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    Explorer les expertises <span>→</span>
                  </Link>
                </div>
              ))}

              <div className="p-6 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col justify-between">
                <div>
                  <div className="font-mono text-sm font-bold text-[var(--blue-cyan)] mb-2">
                    SYNERGIE
                  </div>
                  <h3 className="text-xl font-bold text-[var(--ink-heading)] mb-3">
                    Projets Transverses
                  </h3>
                  <p className="text-sm text-[var(--ink-muted)] leading-relaxed mb-6">
                    Mobilisation coordonnée de plusieurs divisions (ex: IT + Digital pour une marketplace, Consulting + IT pour un plan de cybersécurité).
                  </p>
                </div>
                <Link
                  href="/contact?type=cadrage"
                  className="text-xs font-mono text-[var(--blue-cyan)] hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  Demander un cadrage transverse <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── ENGAGEMENT & SOUVERAINETÉ ── */}
        <section className="py-20 bg-[var(--bg-surface)]/50 border-t border-[var(--border-subtle)]">
          <div className="container-v4 max-w-4xl text-center mx-auto">
            <Kicker>VALEURS & RIGUEUR</Kicker>
            <h2 className="text-3xl font-extrabold text-[var(--ink-heading)] mt-2 mb-6">
              Souveraineté, éthique et conformité sans compromis
            </h2>
            <p className="text-base text-[var(--ink-muted)] leading-relaxed mb-8">
              Dans un monde de dépendances technologiques croissantes, Bokengi Group préconise l\'autonomie technique, le recours aux standards ouverts audités, la protection rigoureuse des données professionnelles et le transfert méthodique de compétences aux équipes internes de nos clients.
            </p>
            <Link href="/contact?type=partenariat" className="btn-v4-primary">
              Construire un partenariat institutionnel →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
