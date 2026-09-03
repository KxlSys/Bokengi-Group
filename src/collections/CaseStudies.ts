import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { seoFields } from '../fields/seo'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: {
    singular: 'Étude de cas (Réalisation)',
    plural: 'Études de cas (Réalisations)',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'clientName', 'category', 'featured', 'publishedDate'],
    group: 'Contenu Métier',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Nom du projet / Titre de la réalisation',
      admin: {
        placeholder: 'Ex: ESIIKA, Portail Kongama, FleetGuard...',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Slug URL (ex: esiika, portail-kongama, fleetguard).',
      },
    },
    {
      name: 'clientName',
      type: 'text',
      label: 'Client / Partenaire / Écosystème',
      admin: {
        placeholder: 'Ex: Kongama Group, Gouvernement, Entreprise...',
      },
    },
    {
      name: 'category',
      type: 'text',
      label: 'Catégorie / Domaine d\'application',
      admin: {
        placeholder: 'Ex: EdTech & E-learning, FinTech, Logistique & IoT...',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Résumé exécutif',
      admin: {
        description: 'Synthèse concise pour les cartes de présentation et les pages listes.',
      },
    },
    {
      name: 'context',
      type: 'richText',
      label: '1. Contexte & Problématique',
      admin: {
        description: 'Environnement du projet, contraintes de départ et attentes initiales.',
      },
    },
    {
      name: 'challenge',
      type: 'richText',
      label: '2. Défi technique & opérationnel',
      admin: {
        description: 'Obstacles critiques résolus (scalabilité, latence, cybersécurité, intégration legacy).',
      },
    },
    {
      name: 'solution',
      type: 'richText',
      label: '3. Solution déployée par Bokengi',
      admin: {
        description: 'Architecture, choix d\'ingénierie et méthodologie mise en œuvre.',
      },
    },
    {
      name: 'results',
      type: 'richText',
      label: '4. Résultats & Indicateurs d\'impact',
      admin: {
        description: 'Gains qualitatifs et quantitatifs (performances, adoption, sécurité, rentabilité).',
      },
    },
    {
      name: 'technologies',
      type: 'array',
      label: 'Technologies & Outils clés',
      labels: {
        singular: 'Technologie',
        plural: 'Technologies',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nom de la technologie (ex: Next.js, PostgreSQL, Docker, Rust)',
        },
      ],
    },
    {
      name: 'architecture',
      type: 'richText',
      label: 'Schéma & Détails d\'architecture technique',
      admin: {
        description: 'Détails des flux de données, micro-services, sécurité réseau et infrastructure.',
      },
    },
    {
      name: 'screenshots',
      type: 'array',
      label: 'Captures d\'écran & Visuels d\'illustration',
      labels: {
        singular: 'Visuel',
        plural: 'Visuels',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Fichier média',
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Légende explicative',
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Mettre en avant sur la page Réalisations & Accueil',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      label: 'Date de réalisation / livraison',
      admin: {
        position: 'sidebar',
      },
    },
    seoFields,
  ],
}

export default CaseStudies
