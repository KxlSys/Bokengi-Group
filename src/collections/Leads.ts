import type { CollectionConfig, CollectionAfterChangeHook } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { sendLeadNotifications } from '../lib/notifications'

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
    singular: 'Lead (Prospect)',
    plural: 'Leads (Prospects)',
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
    afterChange: [leadAfterChangeHook],
  },
  fields: [
    {
      name: 'firstname',
      type: 'text',
      required: true,
      label: 'Prénom',
    },
    {
      name: 'lastname',
      type: 'text',
      required: true,
      label: 'Nom de famille',
    },
    {
      name: 'company',
      type: 'text',
      label: 'Organisation / Entreprise',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Adresse e-mail professionnelle',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Numéro de téléphone',
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
      },
    },
    {
      name: 'pole',
      type: 'relationship',
      relationTo: 'poles',
      hasMany: false,
      label: 'Pôle d\'expertise concerné',
      admin: {
        description: 'Pôle spécifique ciblé par la demande du prospect.',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Description du projet & besoin',
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'website',
      label: 'Origine de la demande',
      admin: {
        position: 'sidebar',
        readOnly: true,
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
      },
    },
  ],
  timestamps: true,
}

export default Leads
