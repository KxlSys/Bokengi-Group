import type { GlobalConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Pied de page (Footer)',
  admin: {
    group: 'Configuration',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: 'Colonnes de liens',
      labels: {
        singular: 'Colonne',
        plural: 'Colonnes',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Titre de la colonne (ex: Navigation, Pôles d\'expertise)',
        },
        {
          name: 'links',
          type: 'array',
          label: 'Liens de la colonne',
          labels: {
            singular: 'Lien',
            plural: 'Liens',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Libellé',
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'URL cible',
            },
            {
              name: 'newTab',
              type: 'checkbox',
              defaultValue: false,
              label: 'Ouvrir dans un nouvel onglet',
            },
          ],
        },
      ],
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Liens légaux de bas de page',
      labels: {
        singular: 'Lien légal',
        plural: 'Liens légaux',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Libellé (ex: Mentions Légales, Politique de Confidentialité)',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      defaultValue: 'Bokengi Group. Tous droits réservés.',
      label: 'Texte de copyright',
    },
  ],
}

export default Footer
