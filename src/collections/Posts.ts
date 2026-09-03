import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { seoFields } from '../fields/seo'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Article d\'expertise',
    plural: 'Articles d\'expertise',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'publishedAt'],
    group: 'Publications',
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
      label: 'Titre de l\'article',
      admin: {
        placeholder: 'Ex: Les défis de la souveraineté numérique en Afrique centrale...',
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
        description: 'Slug URL de l\'article.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Extrait introductif (chapeau)',
      admin: {
        description: 'Bref aperçu affiché dans les flux RSS et les cartes d\'articles.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Corps de l\'article',
      admin: {
        description: 'Contenu éditorial complet rédigé avec l\'éditeur Lexical.',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Auteur / Contributeur',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Image de couverture',
    },
    {
      name: 'categories',
      type: 'array',
      label: 'Catégories',
      labels: {
        singular: 'Catégorie',
        plural: 'Catégories',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Libellé de la catégorie',
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags d\'indexation',
      labels: {
        singular: 'Tag',
        plural: 'Tags',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
          label: 'Mot-clé',
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Date de publication',
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

export default Posts
