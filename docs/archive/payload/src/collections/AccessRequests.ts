import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access/roles'
import {
  protectAccessRequestSubmission,
  handleAccessRequestApproval,
} from './hooks/protectAccessRequest'

export const AccessRequests: CollectionConfig = {
  slug: 'access-requests',
  labels: {
    singular: 'Demande d’accès',
    plural: 'Demandes d’accès',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'requestedRole', 'status', 'createdAt'],
    group: 'Paramètres & Système',
    hidden: ({ user }) => !isSuperAdmin(user),
    description: 'Demandes d\'accès et habilitations en attente d\'approbation Super Admin.',
  },
  access: {
    // Interface d'administration : visible et manipulable exclusivement par le Super Administrateur ID 1
    admin: ({ req: { user } }) => isSuperAdmin(user),
    read: ({ req: { user } }) => isSuperAdmin(user),
    create: ({ req: { user } }) => isSuperAdmin(user), // Restreint au Super Admin. Les soumissions publiques transitent obligatoirement par le endpoint dédié POST /api/access-requests
    update: ({ req: { user } }) => isSuperAdmin(user),
    delete: ({ req: { user } }) => isSuperAdmin(user),
  },
  hooks: {
    beforeValidate: [protectAccessRequestSubmission],
    beforeChange: [protectAccessRequestSubmission],
    afterChange: [handleAccessRequestApproval],
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      label: 'Prénom',
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      label: 'Nom',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email professionnel',
    },
    {
      name: 'requestedRole',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      label: 'Rôle souhaité (consultatif)',
      options: [
        { label: 'Éditeur de contenu', value: 'editor' },
        { label: 'Administrateur', value: 'admin' },
      ],
      admin: {
        description: 'Préférence consultative exprimée par le demandeur.',
      },
    },
    {
      name: 'justification',
      type: 'textarea',
      required: true,
      label: 'Justification & Motivation',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Statut du traitement',
      options: [
        { label: 'En attente', value: 'pending' },
        { label: 'Approuvée', value: 'approved' },
        { label: 'Rejetée', value: 'rejected' },
        { label: 'Expirée', value: 'expired' },
      ],
      admin: {
        description: 'Statut du cycle de vie de la demande.',
      },
    },
    {
      name: 'assignedRole',
      type: 'select',
      label: 'Rôle attribué (décision Super Admin)',
      options: [
        { label: 'Éditeur de contenu', value: 'editor' },
        { label: 'Administrateur', value: 'admin' },
      ],
      admin: {
        description:
          'Rôle formellement attribué lors de l\'approbation par le Super Administrateur.',
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Notes internes de décision',
    },
    {
      name: 'processedAt',
      type: 'date',
      label: 'Date de traitement',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'processedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Traité par',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Date d’expiration (+15 jours)',
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}

export default AccessRequests
