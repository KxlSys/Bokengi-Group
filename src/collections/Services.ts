import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { seoFields } from '../fields/seo'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Service',
    plural: 'Services',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'pole', 'category', 'featured', 'order'],
    group: 'Organisation',
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
      label: 'Titre du service',
      admin: {
        placeholder: 'Ex: Audit de sécurité & Pentest, Infrastructure Cloud...',
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
        description: 'Slug URL (ex: audit-securite-pentest).',
      },
    },
    {
      name: 'pole',
      type: 'relationship',
      relationTo: 'poles',
      required: true,
      hasMany: false,
      label: 'Pôle d\'expertise de rattachement',
      admin: {
        description: 'Sélectionnez le pôle auquel ce service est affilié.',
      },
    },
    {
      name: 'category',
      type: 'text',
      label: 'Catégorie fonctionnelle',
      admin: {
        placeholder: 'Ex: Cybersécurité, Développement, Gouvernance...',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Description courte',
      admin: {
        description: 'Résumé synthétique pour les grilles et listes de services.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Détail de l\'offre & livrables',
      admin: {
        description: 'Description détaillée de la prestation, méthodologie et livrables attendus.',
      },
    },
    {
      name: 'technicalTags',
      type: 'array',
      label: 'Tags techniques & méthodologies',
      labels: {
        singular: 'Tag',
        plural: 'Tags',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
          label: 'Libellé du tag (ex: ISO 27001, Kubernetes, Next.js)',
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Mettre en avant sur la page d\'accueil',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Ordre d\'affichage',
      admin: {
        position: 'sidebar',
      },
    },
    seoFields,
  ],
}

export default Services
