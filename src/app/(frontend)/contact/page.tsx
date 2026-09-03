import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import { ContactForm } from '@/components/bokengi/ContactForm'
import { CalBooking } from '@/components/bokengi/CalBooking'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Contact & Demande de Devis · Cadrage Technique — Bokengi Group',
  description:
    'Contactez la direction technique de Bokengi Group ou formulez votre demande de devis pour vos projets d\'infrastructures, logiciels, digitalisation et événements.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]">
      <Navbar />

      <main className="flex-1">
        {/* ── EN-TÊTE DE LA PAGE CONTACT ── */}
        <section className="py-24 border-b border-[var(--border-subtle)] relative overflow-hidden">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <div className="container-v4 relative z-10 max-w-4xl">
            <Kicker>PRISE DE CONTACT & DEVIS</Kicker>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-3 mb-6">
              Parlons de votre projet.
            </h1>
            <p className="text-lg md:text-xl text-[var(--ink-muted)] leading-relaxed font-light">
              Décrivez votre besoin et nos ingénieurs et directeurs de pôles reviendront vers vous avec une proposition concrète, chiffrée et adaptée sous 24 à 48 heures ouvrées.
            </p>
          </div>
        </section>

        {/* ── SECTION CONTACT (2 COLONNES) ── */}
        <section className="py-20">
          <div className="container-v4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Colonne gauche : Coordonnées, Garanties & Emplacement Cal.com */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <Kicker>ÉCHANGE DIRECT</Kicker>
                  <h2 className="text-2xl font-bold text-[var(--ink-heading)] mt-2 mb-4">
                    Un accompagnement sur mesure pour vos ambitions
                  </h2>
                  <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                    Que vous disposiez d\'un cahier des charges rigoureusement rédigé ou d\'une vision initiale à structurer, nos équipes vous orientent vers la division opérationnelle appropriée.
                  </p>
                </div>

                {/* Carte de coordonnées officielles */}
                <div className="p-6 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                  <h3 className="text-xs uppercase font-mono tracking-wider text-[var(--blue-cyan)] font-bold">
                    Coordonnées officielles
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="block text-xs text-[var(--ink-muted)] font-mono uppercase">
                        Email de réception officiel :
                      </span>
                      {siteConfig.contact.email ? (
                        <a
                          href={`mailto:${siteConfig.contact.email}`}
                          className="font-mono text-sm text-[var(--blue-cyan)] hover:underline"
                        >
                          {siteConfig.contact.email}
                        </a>
                      ) : (
                        <span className="font-mono text-sm text-[var(--ink-heading)]">
                          Via formulaire ci-contre
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="block text-xs text-[var(--ink-muted)] font-mono uppercase">
                        Délai moyen de réponse :
                      </span>
                      <span className="text-sm text-[var(--ink-heading)] font-medium">
                        Sous {siteConfig.contact.responseTime}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-[var(--ink-muted)] font-mono uppercase">
                        Zones d\'intervention :
                      </span>
                      <span className="text-sm text-[var(--ink-heading)] font-medium">
                        Afrique centrale · International · À distance
                      </span>
                    </div>
                  </div>
                </div>

                {/* Emplacement préparé Cal.com */}
                <CalBooking />

                {/* Garantie de confidentialité */}
                <div className="p-6 rounded-[var(--radius-md)] bg-[var(--bg-elevated)]/40 border border-[var(--border-subtle)]">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-[var(--ink-heading)] font-bold mb-2 flex items-center gap-1.5">
                    <span>🛡️</span> Confidentialité garantie
                  </h4>
                  <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                    Les informations, architectures et documents transmis dans le cadre de vos consultations restent strictement confidentiels et soumis au secret professionnel le plus rigoureux.
                  </p>
                </div>
              </div>

              {/* Colonne droite : Formulaire Bokengi V4 */}
              <div className="lg:col-span-7">
                <Suspense
                  fallback={
                    <div className="p-12 text-center rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                      <span className="text-sm font-mono text-[var(--ink-muted)]">
                        Chargement du formulaire sécurisé...
                      </span>
                    </div>
                  }
                >
                  <ContactForm />
                </Suspense>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
