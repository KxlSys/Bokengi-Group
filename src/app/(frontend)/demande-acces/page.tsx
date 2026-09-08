import React from 'react'
import { Metadata } from 'next'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import { AccessRequestForm } from '@/components/bokengi/AccessRequestForm'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Demande d’accès d’administration · Espace Professionnel — Bokengi Group',
  description:
    'Portail de demande d’habilitation et d’ouverture de compte administrateur ou éditeur pour les collaborateurs et partenaires de Bokengi Group.',
  alternates: {
    canonical: '/demande-acces',
  },
}

export default function AccessRequestPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* ── EN-TÊTE DU SAS D'ACCÈS ── */}
        <section className="py-20 md:py-28 border-b border-[var(--border-subtle)] relative overflow-hidden">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <div className="container-v4 relative z-10 max-w-3xl text-center mx-auto">
            <Kicker>ESPACE D’HABILITATION SÉCURISÉ</Kicker>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-3 mb-6">
              Demande d’accès d’administration.
            </h1>
            <p className="text-lg md:text-xl text-[var(--ink-muted)] leading-relaxed font-light">
              Vous collaborez avec Bokengi Group et devez intervenir sur la plateforme technique ou éditoriale ? Soumettez votre demande d’ouverture de compte pour instruction par le Super Administrateur.
            </p>
          </div>
        </section>

        {/* ── FORMULAIRE DU SAS ── */}
        <section className="py-16 md:py-24 bg-[var(--bg-card)]/50">
          <div className="container-v4 max-w-2xl mx-auto">
            <div className="p-8 md:p-12 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xl relative overflow-hidden">
              <div className="mb-8 pb-6 border-b border-[var(--border-subtle)]">
                <h2 className="text-xl font-bold text-[var(--ink-heading)] mb-2">
                  Protocole de vérification d’identité
                </h2>
                <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                  Conformément à la politique de sécurité Bokengi 2.0 (Zero-Trust), aucun compte n’est créé automatiquement. Toute demande est instruite sous 24 à 48h. Si elle est approuvée, un lien d’activation sécurisé vous sera envoyé par courriel.
                </p>
              </div>

              <AccessRequestForm />
            </div>

            <div className="mt-8 text-center text-xs text-[var(--ink-muted)]">
              Système d’authentification sécurisé Bokengi Group · ID 1 Sanctuarisé · Chiffrement de bout en bout
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
