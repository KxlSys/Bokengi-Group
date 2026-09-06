import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { Navbar } from '@/components/bokengi/Navbar'
import { Footer } from '@/components/bokengi/Footer'
import { Kicker } from '@/components/bokengi/Kicker'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité & RGPD · Bokengi Group',
  description:
    'Découvrez nos engagements en matière de protection des données personnelles, conformité RGPD, gestion des leads et sécurité des échanges.',
}

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--ink-body)]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* ── EN-TÊTE DE LA PAGE ── */}
        <section className="py-20 border-b border-[var(--border-subtle)] relative overflow-hidden">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <div className="container-v4 relative z-10 max-w-4xl">
            <Kicker>PROTECTION DES DONNÉES PERSONNELLES</Kicker>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-3 mb-6">
              Politique de Confidentialité
            </h1>
            <p className="text-base md:text-lg text-[var(--ink-muted)] leading-relaxed font-light">
              Bokengi Group accorde une importance primordiale à la confidentialité, à la sécurité et à la maîtrise de vos données à caractère personnel. La présente politique détaille nos pratiques conformément au Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679).
            </p>
          </div>
        </section>

        {/* ── CORPS DU DOCUMENT ── */}
        <section className="py-16">
          <div className="container-v4 max-w-4xl space-y-12">
            {/* 1. Responsable de traitement */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>01 · RESPONSABLE DU TRAITEMENT</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                Qui est responsable du traitement de vos données ?
              </h2>
              <div className="space-y-3 text-sm text-[var(--ink-body)] leading-relaxed pt-2">
                <p>
                  Le responsable du traitement des données à caractère personnel collectées sur le site{' '}
                  <a href={siteConfig.domains.production} className="text-[var(--blue-cyan)] hover:underline">
                    {siteConfig.domains.production}
                  </a>{' '}
                  est la société <strong>Bokengi Group</strong>.
                </p>
                <ul className="space-y-2 pt-2">
                  <li className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="font-mono text-xs text-[var(--ink-muted)] sm:w-48 shrink-0">Responsable :</span>
                    <span className="font-semibold text-[var(--ink-heading)]">Bokengi Group</span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="font-mono text-xs text-[var(--ink-muted)] sm:w-48 shrink-0">Siège social :</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono text-xs border border-amber-500/20">
                      [À compléter : Adresse postale complète du siège social]
                    </span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="font-mono text-xs text-[var(--ink-muted)] sm:w-48 shrink-0">Contact Référent Données / DPO :</span>
                    <a href="mailto:contact@bokengi-group.com" className="text-[var(--blue-cyan)] hover:underline font-mono">
                      contact@bokengi-group.com
                    </a>
                  </li>
                </ul>
              </div>
            </article>

            {/* 2. Données collectées */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>02 · DONNÉES COLLECTÉES</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                Quelles informations recueillons-nous ?
              </h2>
              <div className="space-y-3 text-sm text-[var(--ink-body)] leading-relaxed pt-2">
                <p>
                  Dans le cadre de l’utilisation de notre formulaire de contact et de demande de devis, nous collectons les données suivantes :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <strong className="block text-[var(--ink-heading)] mb-1">Identité & Contact</strong>
                    <span className="text-xs text-[var(--ink-muted)]">Prénom, Nom de famille, Adresse email professionnelle, Numéro de téléphone (optionnel).</span>
                  </div>
                  <div className="p-3 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <strong className="block text-[var(--ink-heading)] mb-1">Contexte Professionnel</strong>
                    <span className="text-xs text-[var(--ink-muted)]">Organisation / Entreprise, Pôle d’expertise visé, Type de demande (devis, cadrage, support, partenariat).</span>
                  </div>
                  <div className="p-3 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <strong className="block text-[var(--ink-heading)] mb-1">Détails du Projet</strong>
                    <span className="text-xs text-[var(--ink-muted)]">Description détaillée du besoin exprimé dans le message.</span>
                  </div>
                  <div className="p-3 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <strong className="block text-[var(--ink-heading)] mb-1">Données Techniques & Sécurité</strong>
                    <span className="text-xs text-[var(--ink-muted)]">Horodatage de la demande, adresse IP (utilisée temporairement pour la prévention des attaques et la limitation de débit).</span>
                  </div>
                </div>
              </div>
            </article>

            {/* 3. Finalités et Bases Légales */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>03 · FINALITÉS & BASES LÉGALES</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                Pourquoi et sur quelle base traitons-nous vos données ?
              </h2>
              <div className="space-y-4 text-sm text-[var(--ink-body)] leading-relaxed pt-2">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[var(--border-subtle)] text-[var(--ink-muted)] font-mono">
                        <th className="py-2.5 pr-4">Finalité du traitement</th>
                        <th className="py-2.5 px-4">Base légale (RGPD)</th>
                        <th className="py-2.5 pl-4">Justification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)]">
                      <tr>
                        <td className="py-3 pr-4 font-semibold text-[var(--ink-heading)]">
                          Gestion, instruction et réponse aux demandes de devis et cadrage technique
                        </td>
                        <td className="py-3 px-4 font-mono text-[var(--blue-cyan)]">
                          Article 6.1.b (Mesures précontractuelles)
                        </td>
                        <td className="py-3 pl-4 text-[var(--ink-muted)]">
                          Le traitement est nécessaire à l’exécution de démarches préalables à la conclusion d’un contrat, engagées à votre demande expresse.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4 font-semibold text-[var(--ink-heading)]">
                          Suivi de la relation commerciale & historique des échanges
                        </td>
                        <td className="py-3 px-4 font-mono text-[var(--blue-cyan)]">
                          Article 6.1.f (Intérêt légitime)
                        </td>
                        <td className="py-3 pl-4 text-[var(--ink-muted)]">
                          Intérêt légitime de Bokengi Group à organiser le suivi de ses prospects et partenaires professionnels.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4 font-semibold text-[var(--ink-heading)]">
                          Protection anti-abus, sécurité du site et filtrage du spam
                        </td>
                        <td className="py-3 px-4 font-mono text-[var(--blue-cyan)]">
                          Article 6.1.f (Intérêt légitime)
                        </td>
                        <td className="py-3 pl-4 text-[var(--ink-muted)]">
                          Maintien de l’intégrité, de la disponibilité et de la cybersécurité des systèmes d'information.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-[var(--ink-muted)] italic">
                  Note : Aucune donnée issue du formulaire de cadrage n'est utilisée à des fins de profilage publicitaire ou revendue à des courtiers de données.
                </p>
              </div>
            </article>

            {/* 4. Destinataires & Sous-traitance */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>04 · DESTINATAIRES & SOUS-TRAITANCE</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                Qui a accès à vos données ?
              </h2>
              <div className="space-y-4 text-sm text-[var(--ink-body)] leading-relaxed pt-2">
                <p>
                  Vos données sont traitées de manière confidentielle. Seules les personnes habilitées de Bokengi Group (direction technique, responsables de divisions opérationnelles et directeurs de projets) y ont accès dans le cadre exclusif du traitement de votre dossier.
                </p>
                <h3 className="text-base font-bold text-[var(--ink-heading)] pt-2">
                  Sous-traitants techniques intervenant dans la chaîne de traitement :
                </h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <div className="flex items-baseline justify-between mb-1">
                      <strong className="text-[var(--ink-heading)]">Resend, Inc.</strong>
                      <span className="font-mono text-xs text-[var(--blue-cyan)]">Notification & Transactionnel</span>
                    </div>
                    <p className="text-xs text-[var(--ink-muted)]">
                      Utilisé pour la distribution des courriels de notification interne à nos équipes et l’envoi de l’accusé de réception automatique au demandeur. Les données transitent de manière chiffrée via l’API Resend.
                    </p>
                  </div>
                  <div className="p-4 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <div className="flex items-baseline justify-between mb-1">
                      <strong className="text-[var(--ink-heading)]">Cloudflare, Inc.</strong>
                      <span className="font-mono text-xs text-[var(--blue-cyan)]">Edge Computing & Sécurité</span>
                    </div>
                    <p className="text-xs text-[var(--ink-muted)]">
                      Exécution de l’application via Cloudflare Workers, protection DDoS et routage réseau.
                    </p>
                  </div>
                  <div className="p-4 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <div className="flex items-baseline justify-between mb-1">
                      <strong className="text-[var(--ink-heading)]">Neon, Inc.</strong>
                      <span className="font-mono text-xs text-[var(--blue-cyan)]">Stockage CRM PostgreSQL</span>
                    </div>
                    <p className="text-xs text-[var(--ink-muted)]">
                      Hébergement sécurisé de la base de données relationnelle où sont enregistrées les demandes de prospects pour le backoffice Bokengi Admin.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* 5. Transferts hors Union Européenne */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>05 · TRANSFERTS INTERNATIONAUX</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                Transferts de données hors UE
              </h2>
              <div className="space-y-3 text-sm text-[var(--ink-body)] leading-relaxed pt-2">
                <p>
                  Dans le cadre de l’utilisation de services cloud (Cloudflare, Neon, Resend) dont les serveurs ou sièges sont situés aux États-Unis, des transferts de données peuvent être opérés hors de l’Union Européenne.
                </p>
                <p>
                  Ces transferts sont strictement encadrés par les mécanismes prévus par le RGPD, notamment l’adhésion des prestataires au cadre de protection des données UE-États-Unis (Data Privacy Framework) et/ou la conclusion des Clauses Contractuelles Types adoptées par la Commission Européenne.
                </p>
              </div>
            </article>

            {/* 6. Durée de conservation */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>06 · DURÉE DE CONSERVATION</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                Combien de temps conservons-nous vos données ?
              </h2>
              <div className="space-y-3 text-sm text-[var(--ink-body)] leading-relaxed pt-2">
                <ul className="list-disc pl-5 space-y-2 text-[var(--ink-body)]">
                  <li>
                    <strong>Données relatives aux prospects non clients :</strong> Conservées pendant la durée nécessaire à l’instruction de la demande, puis conservées pour une durée maximale de <strong>3 ans</strong> à compter du dernier contact émanant du prospect (conformément aux recommandations de la CNIL).
                  </li>
                  <li>
                    <strong>Données relatives aux clients et projets contractualisés :</strong> Conservées pendant toute la durée de la relation contractuelle, puis archivées conformément aux délais légaux de prescription (5 ans en matière commerciale, 10 ans pour les pièces comptables).
                  </li>
                  <li>
                    <strong>Logs techniques de limitation de débit :</strong> Conservés en mémoire vive pour une durée glissante de 60 secondes puis détruits.
                  </li>
                </ul>
              </div>
            </article>

            {/* 7. Droits des personnes */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>07 · VOS DROITS RGPD</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                Quels sont vos droits et comment les exercer ?
              </h2>
              <div className="space-y-4 text-sm text-[var(--ink-body)] leading-relaxed pt-2">
                <p>
                  Conformément au Règlement Général sur la Protection des Données (articles 15 à 22 du RGPD), vous disposez des droits suivants concernant vos données à caractère personnel :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <strong className="block text-[var(--ink-heading)] text-xs mb-1">Droit d'accès (Art. 15)</strong>
                    <span className="text-xs text-[var(--ink-muted)]">Obtenir la confirmation du traitement de vos données et en recevoir copie.</span>
                  </div>
                  <div className="p-3 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <strong className="block text-[var(--ink-heading)] text-xs mb-1">Droit de rectification (Art. 16)</strong>
                    <span className="text-xs text-[var(--ink-muted)]">Demander la correction de données inexactes ou incomplètes.</span>
                  </div>
                  <div className="p-3 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <strong className="block text-[var(--ink-heading)] text-xs mb-1">Droit à l'effacement (Art. 17)</strong>
                    <span className="text-xs text-[var(--ink-muted)]">Demander la suppression de vos données dans les limites légales.</span>
                  </div>
                  <div className="p-3 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <strong className="block text-[var(--ink-heading)] text-xs mb-1">Droit à la limitation (Art. 18)</strong>
                    <span className="text-xs text-[var(--ink-muted)]">Geler temporairement l'utilisation de vos données dans les cas prévus par la loi.</span>
                  </div>
                  <div className="p-3 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <strong className="block text-[var(--ink-heading)] text-xs mb-1">Droit à la portabilité (Art. 20)</strong>
                    <span className="text-xs text-[var(--ink-muted)]">Recevoir vos données dans un format structuré et couramment utilisé.</span>
                  </div>
                  <div className="p-3 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <strong className="block text-[var(--ink-heading)] text-xs mb-1">Droit d'opposition (Art. 21)</strong>
                    <span className="text-xs text-[var(--ink-muted)]">Vous opposer à tout moment au traitement basé sur l'intérêt légitime.</span>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <h3 className="font-bold text-[var(--ink-heading)]">Comment exercer vos droits ?</h3>
                  <p className="text-sm text-[var(--ink-muted)]">
                    Vous pouvez exercer l’ensemble de vos droits à tout moment en nous adressant une demande accompagnée d'un justificatif d'identité :
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-[var(--ink-muted)]">
                    <li>
                      Par courrier électronique :{' '}
                      <a href="mailto:contact@bokengi-group.com" className="text-[var(--blue-cyan)] hover:underline font-mono">
                        contact@bokengi-group.com
                      </a>
                    </li>
                    <li>
                      Par courrier postal :{' '}
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono text-xs border border-amber-500/20">
                        [À compléter : Adresse postale du siège social]
                      </span>
                    </li>
                  </ul>
                  <p className="text-xs text-[var(--ink-muted)] pt-2">
                    Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous avez la faculté d’introduire une réclamation auprès de l’autorité de protection des données compétente (ex. la CNIL en France — www.cnil.fr).
                  </p>
                </div>
              </div>
            </article>

            {/* 8. Sécurité des données */}
            <article className="p-8 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <Kicker>08 · SÉCURITÉ DES ÉCHANGES</Kicker>
              <h2 className="text-2xl font-bold text-[var(--ink-heading)]">
                Mesures de sécurité techniques & organisationnelles
              </h2>
              <div className="space-y-3 text-sm text-[var(--ink-body)] leading-relaxed pt-2">
                <p>
                  Bokengi Group applique des standards d’ingénierie rigoureux afin d’assurer l’intégrité et la confidentialité des données :
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-[var(--ink-muted)]">
                  <li>Chiffrement systématique de toutes les communications en transit (TLS 1.3 avec HSTS et preload actif).</li>
                  <li>Filtrage anti-spam multicouche (Honeypot applicatif + limitation de débit glissante par adresse IP).</li>
                  <li>Cloisonnement des accès d’administration et authentification sécurisée.</li>
                  <li>Hébergement de base de données managée avec isolation des environnements et sauvegardes automatiques.</li>
                </ul>
              </div>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
