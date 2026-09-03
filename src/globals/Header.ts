import type { GlobalConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'En-tête & Navigation',
  admin: {
    group: 'Configuration',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'navigation',
      type: 'array',
      label: 'Liens de navigation principale',
      labels: {
        singular: 'Lien',
        plural: 'Liens',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Texte du lien',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL cible (ex: /groupe, /expertises)',
        },
        {
          name: 'newTab',
          type: 'checkbox',
          defaultValue: false,
          label: 'Ouvrir dans un nouvel onglet',
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Bouton d\'action principal (CTA)',
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Demander un devis →',
          label: 'Libellé du bouton',
        },
        {
          name: 'url',
          type: 'text',
          defaultValue: '/contact?type=devis',
          label: 'Destination',
        },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Afficher le CTA',
        },
      ],
    },
  ],
}

export default Header
