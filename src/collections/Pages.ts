import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { seoFields } from '../fields/seo'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Page institutionnelle',
    plural: 'Pages institutionnelles',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
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
      label: 'Titre de la page',
      admin: {
        placeholder: 'Ex: Le Groupe, Mentions Légales...',
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
        description: 'Slug URL (ex: groupe, legal, confidentialite).',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Contenu éditorial de la page',
      admin: {
        description: 'Corps de texte structuré de la page institutionnelle.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      required: true,
      label: 'Statut de publication',
      options: [
        { label: 'Brouillon', value: 'draft' },
        { label: 'Publié', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    seoFields,
  ],
  timestamps: true,
}

export default Pages
