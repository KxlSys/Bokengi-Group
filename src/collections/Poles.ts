import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { seoFields } from '../fields/seo'

export const Poles: CollectionConfig = {
  slug: 'poles',
  labels: {
    singular: 'Pôle d\'expertise',
    plural: 'Pôles d\'expertise',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order', 'status'],
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
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nom du pôle',
      admin: {
        placeholder: 'Ex: Bokengi IT, Bokengi Digital...',
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
        description: 'Identifiant unique pour l\'URL (ex: it, digital, business, consulting, events).',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Description synthétique (accroche)',
      admin: {
        description: 'Présentation concise utilisée sur la page d\'accueil et les cartes d\'aperçu.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description détaillée',
      admin: {
        description: 'Présentation complète des missions, de la vision et de la proposition de valeur du pôle.',
      },
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Identifiant d\'icône',
      admin: {
        description: 'Code de l\'icône SVG (ex: server, code, trending-up, compass, calendar).',
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
}

export default Poles
