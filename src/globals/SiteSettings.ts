import type { GlobalConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Paramètres Généraux',
  admin: {
    group: 'Configuration',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      required: true,
      defaultValue: 'Bokengi Group',
      label: 'Raison sociale / Nom de l\'organisation',
    },
    {
      name: 'contactEmail',
      type: 'text',
      label: 'Adresse e-mail professionnelle de contact',
      admin: {
        description: 'L\'adresse officielle cible est contact@bokengi-group.com (injectable également via CONTACT_EMAIL).',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Numéro de téléphone institutionnel',
    },
    {
      name: 'address',
      type: 'group',
      label: 'Localisation & Siège',
      fields: [
        {
          name: 'street',
          type: 'text',
          label: 'Rue / Avenue',
        },
        {
          name: 'city',
          type: 'text',
          label: 'Ville',
        },
        {
          name: 'country',
          type: 'text',
          label: 'Pays',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Réseaux professionnels & Liens externes',
      labels: {
        singular: 'Lien réseau social',
        plural: 'Liens réseaux sociaux',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          label: 'Plateforme',
          options: [
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'GitHub', value: 'github' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Autre', value: 'other' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL du profil',
        },
      ],
    },
    {
      name: 'domains',
      type: 'group',
      label: 'Domaines & Environnements de la plateforme',
      fields: [
        {
          name: 'production',
          type: 'text',
          defaultValue: 'https://bokengi-group.com',
          label: 'Domaine de production officiel',
          admin: {
            description: 'URL canonique finale lors de la bascule DNS.',
          },
        },
        {
          name: 'preview',
          type: 'text',
          defaultValue: 'https://bokengi.vercel.app',
          label: 'Domaine technique Vercel (Preview/Staging)',
          admin: {
            description: 'Environnement technique intermédiaire.',
          },
        },
      ],
    },
  ],
}

export default SiteSettings
