import type { GlobalConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { isAdmin } from '../access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Paramètres Généraux',
  admin: {
    group: 'Paramètres & Système',
    hidden: ({ user }) => !isAdmin(user),
    description: 'Identité corporative, coordonnées officielles, mentions légales et paramètres de facturation.',
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
      name: 'legalForm',
      type: 'text',
      defaultValue: 'SAS',
      label: 'Forme juridique',
      admin: {
        description: 'Ex: SAS, SARL, SA...',
      },
    },
    {
      name: 'capital',
      type: 'text',
      defaultValue: '7 500 €',
      label: 'Capital social',
    },
    {
      name: 'rcs',
      type: 'text',
      label: 'Immatriculation RCS',
      admin: {
        placeholder: 'Ex: RCS Paris B ...',
        description: 'Numéro d\'immatriculation au Registre du Commerce et des Sociétés.',
      },
    },
    {
      name: 'siren',
      type: 'text',
      label: 'Numéro SIREN',
      admin: {
        placeholder: 'Ex: 912 345 678',
        description: 'Identifiant unique à 9 chiffres de l\'entreprise.',
      },
    },
    {
      name: 'siret',
      type: 'text',
      label: 'Numéro SIRET',
      admin: {
        placeholder: 'Ex: 912 345 678 00012',
        description: 'Identifiant à 14 chiffres de l\'établissement.',
      },
    },
    {
      name: 'vatNumber',
      type: 'text',
      label: 'Numéro de TVA Intracommunautaire',
      admin: {
        placeholder: 'Ex: FR 12 ...',
        description: 'Numéro d\'assujetti à la TVA pour la facturation.',
      },
    },
    {
      name: 'contactEmail',
      type: 'text',
      defaultValue: 'contact@bokengi-group.com',
      label: 'Adresse e-mail professionnelle de contact',
      admin: {
        description: 'Adresse officielle : contact@bokengi-group.com (injectable également via CONTACT_EMAIL).',
      },
    },
    {
      name: 'phone',
      type: 'text',
      defaultValue: '07 58 88 84 34',
      label: 'Numéro de téléphone institutionnel',
    },
    {
      name: 'bankDetails',
      type: 'group',
      label: 'Coordonnées Bancaires Officielles',
      fields: [
        {
          name: 'bankName',
          type: 'text',
          label: 'Nom de l\'établissement bancaire',
          admin: {
            placeholder: 'Ex: Nom de la banque',
          },
        },
        {
          name: 'iban',
          type: 'text',
          label: 'IBAN',
          admin: {
            placeholder: 'Ex: FR76 ...',
          },
        },
        {
          name: 'bic',
          type: 'text',
          label: 'Code BIC / SWIFT',
          admin: {
            placeholder: 'Ex: BNPAFRPPXXX',
          },
        },
      ],
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
          defaultValue: 'Paris',
          label: 'Ville',
        },
        {
          name: 'country',
          type: 'text',
          defaultValue: 'France',
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
          defaultValue: 'https://bokengi-group.com',
          label: 'Domaine de prévisualisation / Staging',
          admin: {
            description: 'Environnement technique de prévisualisation.',
          },
        },
      ],
    },
  ],
}

export default SiteSettings
