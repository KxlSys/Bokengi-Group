import type { CollectionConfig, CollectionAfterChangeHook } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { sendLeadNotifications } from '../lib/notifications'
import { protectLeadImmutability } from './hooks/protectLeadImmutability'

const leadAfterChangeHook: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation === 'create') {
    let poleName: string | undefined
    if (doc.pole && typeof doc.pole === 'object' && 'name' in doc.pole) {
      poleName = (doc.pole as any).name
    } else if (doc.pole) {
      try {
        const poleDoc = await req.payload.findByID({
          collection: 'poles',
          id: doc.pole,
        })
        if (poleDoc) poleName = (poleDoc as any).name
      } catch (_err) {
        // Fallback silencieux
      }
    }

    // Exécution asynchrone non-bloquante
    void sendLeadNotifications({
      id: doc.id,
      firstname: doc.firstname,
      lastname: doc.lastname,
      company: doc.company,
      email: doc.email,
      phone: doc.phone,
      requestType: doc.requestType,
      poleName,
      message: doc.message,
      source: doc.source,
      createdAt: doc.createdAt,
    })
  }

  return doc
}

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: {
    singular: 'Demande & Prospect',
    plural: 'Demandes & Prospects',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['lastname', 'firstname', 'company', 'requestType', 'status', 'createdAt'],
    group: 'Commercial & CRM',
  },
  access: {
    // Les visiteurs peuvent soumettre des demandes via formulaire public
    create: anyone,
    // La lecture et modification des prospects est strictement réservée aux administrateurs authentifiés
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeValidate: [protectLeadImmutability],
    beforeChange: [protectLeadImmutability],
    afterChange: [leadAfterChangeHook],
  },
  fields: [
    {
      name: 'firstname',
      type: 'text',
      required: true,
      label: 'Prénom',
      admin: {
        readOnly: true,
        description: 'Prénom soumis par le prospect (strictement immuable).',
      },
    },
    {
      name: 'lastname',
      type: 'text',
      required: true,
      label: 'Nom de famille',
      admin: {
        readOnly: true,
        description: 'Nom de famille soumis par le prospect (strictement immuable).',
      },
    },
    {
      name: 'company',
      type: 'text',
      label: 'Organisation / Entreprise',
      admin: {
        readOnly: true,
        description: 'Organisation / Entreprise renseignée par le prospect (immuable).',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Adresse e-mail professionnelle',
      admin: {
        readOnly: true,
        description: 'Adresse e-mail originale fournie par le prospect (strictement immuable).',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Numéro de téléphone',
      admin: {
        readOnly: true,
        description: 'Numéro de contact renseigné par le prospect (immuable).',
      },
    },
    {
      name: 'requestType',
      type: 'select',
      required: true,
      label: 'Type de sollicitation',
      defaultValue: 'devis',
      options: [
        { label: 'Demande de devis', value: 'devis' },
        { label: 'Cadrage de projet', value: 'cadrage' },
        { label: 'Partenariat institutionnel', value: 'partenariat' },
        { label: 'Autre demande', value: 'autre' },
      ],
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Type de demande original choisi par le prospect (immuable).',
      },
    },
    {
      name: 'pole',
      type: 'relationship',
      relationTo: 'poles',
      hasMany: false,
      label: 'Pôle d\'expertise concerné',
      admin: {
        readOnly: true,
        description: 'Pôle d\'expertise ciblé par le prospect lors de la soumission (immuable).',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Description du projet & besoin',
      admin: {
        readOnly: true,
        description: 'Message original transmis par le prospect (strictement immuable).',
      },
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'website',
      label: 'Origine de la demande',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Origine technique de la demande (immuable).',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      label: 'Statut du prospect',
      options: [
        { label: 'Nouveau', value: 'new' },
        { label: 'Contacté', value: 'contacted' },
        { label: 'Qualifié', value: 'qualified' },
        { label: 'Converti', value: 'converted' },
        { label: 'Archivé', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
        components: {
          Cell: '@/components/admin/leads/LeadStatusCell',
        },
      },
    },
  ],
  timestamps: true,
}

export default Leads
