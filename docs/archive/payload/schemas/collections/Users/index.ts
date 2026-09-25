import type { CollectionConfig, Where } from 'payload'

import { canAccessAdmin, isSuperAdmin, isAdmin } from '../../access/roles'
import {
  protectUserSecurity,
  preventUser1Deletion,
} from '../hooks/protectUserSecurity'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Utilisateur',
    plural: 'Utilisateurs',
  },
  admin: {
    defaultColumns: ['name', 'email', 'role', 'status'],
    useAsTitle: 'name',
    group: 'Paramètres & Système',
    hidden: ({ user }) => !isAdmin(user),
    description: 'Gestion des comptes collaborateurs et attributions des habilitations RBAC.',
  },
  access: {
    // Contrôle d'accès à l'interface d'administration
    admin: ({ req: { user } }) => canAccessAdmin(user),

    // Création d'utilisateurs : réservée au Super Admin et aux Admins actifs (éditeurs exclus)
    create: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || (isAdmin(user) && (user as any)?.status === 'active')
    },

    // Lecture d'utilisateurs : Super Admin et Admin voient tout ; les éditeurs voient uniquement leur compte
    read: ({ req: { user } }): boolean | Where => {
      if (!user) return false
      if (isAdmin(user)) return true
      return {
        id: {
          equals: user.id,
        },
      }
    },

    // Mise à jour : Super Admin peut tout mettre à jour (ID 1 protégé par hooks) ;
    // Admin peut modifier les comptes sauf ID 1 ; les éditeurs modifient uniquement leur profil
    update: ({ req: { user } }): boolean | Where => {
      if (!user) return false
      if (isSuperAdmin(user)) return true
      if (isAdmin(user)) {
        return {
          id: {
            not_equals: 1,
          },
        }
      }
      return {
        id: {
          equals: user.id,
        },
      }
    },

    // Suppression : Super Admin peut supprimer (sauf ID 1 sanctuarisé) ;
    // Admin peut supprimer des éditeurs ; les éditeurs ne peuvent supprimer personne
    delete: ({ req: { user } }): boolean | Where => {
      if (!user) return false
      if (isSuperAdmin(user)) {
        return {
          id: {
            not_equals: 1,
          },
        }
      }
      if (isAdmin(user)) {
        return {
          and: [
            { id: { not_equals: 1 } },
            { role: { equals: 'editor' } },
          ],
        }
      }
      return false
    },

    // Déverrouillage de compte (CVE-2026-11779) : strictement réservé au Super Administrateur ID 1
    unlock: ({ req: { user } }) => isSuperAdmin(user),
  },
  hooks: {
    beforeValidate: [protectUserSecurity],
    beforeChange: [protectUserSecurity],
    beforeDelete: [preventUser1Deletion],
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nom complet',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      label: 'Rôle d’accès',
      options: [
        { label: 'Administrateur', value: 'admin' },
        { label: 'Éditeur', value: 'editor' },
        { label: 'Super Administrateur (Sanctuarisé ID 1)', value: 'super-admin' },
      ],
      filterOptions: ({ options }) => {
        // Garantit que 'super-admin' n'est jamais proposé comme rôle librement attribuable dans l'UI
        return options.filter((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value
          return val !== 'super-admin'
        })
      },
      admin: {
        description:
          'Rôle d’habilitation système. Le rôle Super Administrateur est réservé exclusivement au compte sanctuarisé ID 1.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Statut du compte',
      options: [
        { label: 'Actif', value: 'active' },
        { label: 'En attente', value: 'pending' },
        { label: 'Suspendu', value: 'suspended' },
        { label: 'Rejeté', value: 'rejected' },
      ],
      admin: {
        description: 'État d’activation du compte. Seuls les comptes "Actif" peuvent se connecter.',
      },
    },
  ],
  timestamps: true,
  versions: false,
}

export default Users
