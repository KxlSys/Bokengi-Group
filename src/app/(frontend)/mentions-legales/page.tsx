import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Mentions Légales · Bokengi Group',
  description:
    'Consultez les mentions légales, informations éditoriales, hébergement et propriété intellectuelle de la plateforme officielle Bokengi Group.',
}

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* ── EN-TÊTE DE LA PAGE ── */}
        <section className="py-20 border-b border-[var(--border-subtle)] relative overflow-hidden">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <div className="container-v4 relative z-10 max-w-4xl">
            <Kicker>CADRE JURIDIQUE & RÉGLEMENTAIRE</Kicker>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-3 mb-6">
              Mentions Légales
            </h1>
            <p className="text-base md:text-lg text-[var(--ink-muted)] leading-relaxed font-light">
              Conformément aux dispositions des lois pour la confiance dans l’économie numérique et aux obligations légales de transparence, retrouvez ci-dessous les informations relatives à l’éditeur et à l’hébergement du site {siteConfig.domains.production}.
            </p>
          </div>
        </section>

        {/* ── CONTENU DES MENTIONS LÉGALES ── */}
        <section className="py-16">
          <div className="container-v4 max-w-4xl space-y-12">
            {/* 1. Éditeur de la plateforme */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>01 · ÉDITEUR DU SITE</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                Identification de la société éditrice
              </h2>
              <div className="space-y-3 text-sm text-[var(--ink-body)] leading-relaxed pt-2">
                <p>
                  Le présent site internet accessible à l’adresse{' '}
                  <a href={siteConfig.domains.production} className="text-[var(--blue-cyan)] hover:underline">
                    {siteConfig.domains.production}
                  </a>{' '}
                  est édité et exploité par <strong>Bokengi Group</strong>.
                </p>
                <ul className="space-y-2.5 pt-2">
                  <li className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="font-mono text-xs text-[var(--ink-muted)] sm:w-48 shrink-0">Dénomination :</span>
                    <span className="font-semibold text-[var(--ink-heading)]">Bokengi Group</span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="font-mono text-xs text-[var(--ink-muted)] sm:w-48 shrink-0">Forme juridique :</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono text-xs border border-amber-500/20">
                      [À compléter : Forme juridique de la société, ex: SAS / SARL / SA]
                    </span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="font-mono text-xs text-[var(--ink-muted)] sm:w-48 shrink-0">Capital social :</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono text-xs border border-amber-500/20">
                      [À compléter : Montant du capital social en € ou devise d’enregistrement]
                    </span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="font-mono text-xs text-[var(--ink-muted)] sm:w-48 shrink-0">Siège social :</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono text-xs border border-amber-500/20">
                      [À compléter : Adresse postale complète du siège social]
                    </span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="font-mono text-xs text-[var(--ink-muted)] sm:w-48 shrink-0">Immatriculation (RCS / SIREN) :</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono text-xs border border-amber-500/20">
                      [À compléter : Numéro RCS / Registre du Commerce ou SIREN / SIRET]
                    </span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="font-mono text-xs text-[var(--ink-muted)] sm:w-48 shrink-0">N° TVA intracommunautaire :</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono text-xs border border-amber-500/20">
                      [À compléter : Numéro de TVA intracommunautaire le cas échéant]
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* 2. Direction de publication */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>02 · DIRECTION DE LA PUBLICATION</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                Responsable éditorial
              </h2>
              <div className="space-y-3 text-sm text-[var(--ink-body)] leading-relaxed pt-2">
                <p>
                  <strong>Directeur de la publication :</strong>{' '}
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono text-xs border border-amber-500/20">
                    [À compléter : Nom et prénom du représentant légal ou directeur de publication]
                  </span>
                </p>
                <p>
                  <strong>Contact éditorial :</strong>{' '}
                  <a href="mailto:contact@bokengi-group.com" className="text-[var(--blue-cyan)] hover:underline font-mono">
                    contact@bokengi-group.com
                  </a>
                </p>
              </div>
            </article>

            {/* 3. Hébergement de la plateforme */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>03 · HÉBERGEMENT & INFRASTRUCTURE</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                Prestataires d’infrastructure technique
              </h2>
              <div className="space-y-4 text-sm text-[var(--ink-body)] leading-relaxed pt-2">
                <p>
                  La plateforme technologique de Bokengi Group est déployée sur une infrastructure edge distribuée haute disponibilité :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2">
                    <h3 className="font-semibold text-[var(--ink-heading)]">Réseau Edge & Exécution Serverless</h3>
                    <p className="text-xs text-[var(--ink-muted)]">
                      <strong>Cloudflare Workers / Cloudflare Inc.</strong><br />
                      101 Townsend St, San Francisco, CA 94107, USA<br />
                      Site web : <a href="https://www.cloudflare.com" target="_blank" rel="noopener noreferrer" className="text-[var(--blue-cyan)] hover:underline">cloudflare.com</a>
                    </p>
                  </div>
                  <div className="p-4 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2">
                    <h3 className="font-semibold text-[var(--ink-heading)]">Base de données managée (PostgreSQL)</h3>
                    <p className="text-xs text-[var(--ink-muted)]">
                      <strong>Neon Inc.</strong><br />
                      San Francisco, CA, USA<br />
                      Site web : <a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="text-[var(--blue-cyan)] hover:underline">neon.tech</a>
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[var(--ink-muted)] pt-2">
                  Les ressources multimédias et fichiers téléversés sont stockés sur la solution sécurisée <strong>Cloudflare R2 Storage</strong>.
                </p>
              </div>
            </article>

            {/* 4. Moyens de contact */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>04 · MOYENS DE CONTACT</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                Nous contacter
              </h2>
              <div className="space-y-3 text-sm text-[var(--ink-body)] leading-relaxed pt-2">
                <p>
                  Pour toute question concernant le site, son contenu ou l’activité du groupe, vous pouvez nous joindre :
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-[var(--ink-muted)]">
                  <li>
                    Par e-mail :{' '}
                    <a href="mailto:contact@bokengi-group.com" className="text-[var(--blue-cyan)] hover:underline font-mono">
                      contact@bokengi-group.com
                    </a>
                  </li>
                  <li>
                    Via le formulaire de cadrage technique :{' '}
                    <Link href="/contact" className="text-[var(--blue-cyan)] hover:underline">
                      Accéder au formulaire de contact
                    </Link>
                  </li>
                  <li>
                    Par voie postale :{' '}
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono text-xs border border-amber-500/20">
                      [À compléter : Adresse postale officielle de correspondance]
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* 5. Propriété intellectuelle */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>05 · PROPRIÉTÉ INTELLECTUELLE</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                Droits d'auteur, marques et exploitation
              </h2>
              <div className="space-y-3 text-sm text-[var(--ink-body)] leading-relaxed pt-2">
                <p>
                  L’ensemble des éléments constituant ce site (textes, graphismes, logiciels, photographies, images, vidéos, sons, plans, logos, marques, créations et œuvres protégeables diverses, bases de données, architecture technique) est la propriété exclusive de Bokengi Group ou de ses partenaires lui ayant concédé une licence d’exploitation.
                </p>
                <p>
                  Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit, est interdite sans l’autorisation écrite préalable de Bokengi Group.
                </p>
                <p className="text-xs text-[var(--ink-muted)]">
                  Toute exploitation non autorisée du site ou de son contenu engagerait la responsabilité civile et pénale de l’utilisateur en application du Code de la propriété intellectuelle.
                </p>
              </div>
            </article>

            {/* 6. Protection des données personnelles */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>06 · DONNÉES PERSONNELLES</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                Respect de la vie privée & RGPD
              </h2>
              <p className="text-sm text-[var(--ink-body)] leading-relaxed">
                Les informations relatives à la collecte, au traitement et à la conservation des données à caractère personnel sont détaillées dans notre politique dédiée.
              </p>
              <div className="pt-2">
                <Link href="/confidentialite" className="btn-v4-secondary inline-flex items-center gap-2">
                  Consulter la Politique de confidentialité <span>→</span>
                </Link>
              </div>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
