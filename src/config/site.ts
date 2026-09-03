/**
 * BOKENGI GROUP 2.0 — CONFIGURATION CENTRALISÉE DU SITE
 *
 * Ce module centralise les paramètres essentiels du projet :
 * - Informations de contact (via la variable CONTACT_EMAIL)
 * - Gestion des environnements et domaines canoniques
 *
 * GESTION DES DOMAINES :
 * - Production future : https://bokengi-group.com (domaine officiel définitif)
 * - Preview / Déploiement Vercel : https://bokengi.vercel.app (domaine technique temporaire)
 */

export const siteConfig = {
  name: 'Bokengi Group',
  shortName: 'Bokengi',
  baseline: 'Construire. Protéger. Développer.',
  tagline: 'Technology & Services',
  description:
    'Bokengi Group réunit cinq expertises complémentaires : Bokengi IT, Bokengi Digital, Bokengi Business, Bokengi Consulting et Bokengi Events pour accompagner les organisations.',

  /**
   * Configuration centralisée des informations de contact.
   * Aucune adresse finale n'est codée en dur.
   * La valeur est injectée via CONTACT_EMAIL ou NEXT_PUBLIC_CONTACT_EMAIL.
   */
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || process.env.CONTACT_EMAIL || '',
    responseTime: '24 à 48h ouvrées',
  },

  /**
   * Cartographie des domaines de la plateforme.
   */
  domains: {
    /** Domaine canonique officiel de production finale */
    production: 'https://bokengi-group.com',

    /** Domaine technique Vercel pour la preview et les tests intermédiaires */
    preview: 'https://bokengi.vercel.app',

    /** Résolution de l'URL courante du serveur */
    get current(): string {
      return (
        process.env.NEXT_PUBLIC_SERVER_URL ||
        (process.env.NODE_ENV === 'production'
          ? 'https://bokengi.vercel.app'
          : 'http://localhost:3000')
      )
    },
  },
} as const

export default siteConfig
