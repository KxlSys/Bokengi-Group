import type { Field } from 'payload'

export const seoFields: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO & Réseaux Sociaux',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titre SEO',
      admin: {
        description: 'Titre spécifique pour les moteurs de recherche (laisser vide pour utiliser le titre par défaut).',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description SEO',
      admin: {
        description: 'Description pour les moteurs de recherche et les partages sociaux (150-160 caractères recommandés).',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image OpenGraph (Partage)',
      admin: {
        description: 'Image au format 1200x630px recommandée pour les aperçus sociaux.',
      },
    },
  ],
}

export default seoFields
