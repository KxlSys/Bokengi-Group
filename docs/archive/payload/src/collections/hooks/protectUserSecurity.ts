import {
  APIError,
  type CollectionBeforeValidateHook,
  type CollectionBeforeChangeHook,
  type CollectionBeforeDeleteHook,
} from 'payload'
import { isSuperAdmin, isAdmin } from '../../access/roles'

/**
 * Hook serveur vérifiant la conformité RBAC et la sanctuarisation de l'utilisateur ID 1
 * lors de toute création ou mise à jour.
 * S'exécute en beforeValidate et beforeChange pour une protection absolue à la racine.
 */
export const protectUserSecurity: CollectionBeforeValidateHook & CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  operation,
  req,
}) => {
  if (!data) return data

  const currentUser = req?.user
  const targetId = originalDoc?.id ?? (data as any)?.id
  const isTargetUser1 = targetId === 1 || targetId === '1'

  // ==========================================================================
  // 1. OPÉRATION DE MISE À JOUR (UPDATE)
  // ==========================================================================
  if (operation === 'update') {
    // ------------------------------------------------------------------------
    // A. SANCTUARISATION STRICTE DE L'UTILISATEUR ID 1
    // ------------------------------------------------------------------------
    if (isTargetUser1) {
      // a) Interdiction de modification par un tiers (seul ID 1 peut modifier ses infos de profil)
      if (currentUser && Number(currentUser.id) !== 1) {
        throw new APIError(
          'Action non autorisée : le compte Super Administrateur ID 1 est strictement sanctuarisé et ne peut être modifié que par lui-même.',
          403
        )
      }

      // b) Interdiction de rétrogradation (le rôle ID 1 doit rester exclusivement 'super-admin')
      if ('role' in data && data.role !== undefined && data.role !== 'super-admin') {
        throw new APIError(
          'Action non autorisée : le compte Super Administrateur ID 1 est strictement sanctuarisé et ne peut pas être rétrogradé.',
          403
        )
      }

      // c) Interdiction de suspension, rejet ou désactivation (le statut ID 1 doit rester 'active')
      if ('status' in data && data.status !== undefined && data.status !== 'active') {
        throw new APIError(
          'Action non autorisée : le compte Super Administrateur ID 1 est strictement sanctuarisé et ne peut pas être suspendu, rejeté ou désactivé.',
          403
        )
      }
    }

    // ------------------------------------------------------------------------
    // B. PROTECTION CONTRE L'AUTO-ÉLÉVATION (SELF-PROMOTION) & ÉLÉVATION TIERS
    // ------------------------------------------------------------------------
    if (!isTargetUser1) {
      // a) Aucun autre utilisateur ne peut recevoir le rôle 'super-admin'
      if ('role' in data && data.role === 'super-admin') {
        throw new APIError(
          'Action non autorisée : le rôle "super-admin" est strictement réservé au compte sanctuarisé ID 1.',
          403
        )
      }

      // b) Un utilisateur non Super-Admin ne peut pas modifier son propre rôle
      const isSelf = currentUser && (currentUser.id === targetId || String(currentUser.id) === String(targetId))
      if (isSelf && !isSuperAdmin(currentUser)) {
        if ('role' in data && data.role !== undefined && data.role !== (originalDoc as any)?.role) {
          throw new APIError(
            'Action non autorisée : vous ne possédez pas les permissions nécessaires pour modifier votre propre rôle.',
            403
          )
        }

        // c) Un utilisateur ne peut pas modifier son propre statut (ex: réactivation clandestine)
        if ('status' in data && data.status !== undefined && data.status !== (originalDoc as any)?.status) {
          throw new APIError(
            'Action non autorisée : vous ne possédez pas les permissions nécessaires pour modifier votre propre statut.',
            403
          )
        }
      }

      // d) Un éditeur ne peut modifier ni rôle ni statut de qui que ce soit
      if (currentUser && !isAdmin(currentUser)) {
        if ('role' in data && data.role !== undefined && data.role !== (originalDoc as any)?.role) {
          throw new APIError(
            'Action non autorisée : les éditeurs ne sont pas autorisés à modifier les rôles.',
            403
          )
        }
        if ('status' in data && data.status !== undefined && data.status !== (originalDoc as any)?.status) {
          throw new APIError(
            'Action non autorisée : les éditeurs ne sont pas autorisés à modifier les statuts utilisateurs.',
            403
          )
        }
      }
    }

    return data
  }

  // ==========================================================================
  // 2. OPÉRATION DE CRÉATION (CREATE)
  // ==========================================================================
  if (operation === 'create') {
    // a) Interdiction absolue de créer un compte avec le rôle 'super-admin'
    if ('role' in data && data.role === 'super-admin') {
      throw new APIError(
        'Action non autorisée : le rôle "super-admin" ne peut pas être attribué lors de la création d\'un utilisateur.',
        403
      )
    }

    // b) Un éditeur ne peut jamais créer d'utilisateur
    if (currentUser && !isAdmin(currentUser)) {
      throw new APIError(
        'Action non autorisée : les éditeurs ne sont pas autorisés à créer des utilisateurs.',
        403
      )
    }

    return data
  }

  return data
}

/**
 * Hook serveur garantissant l'impossibilité absolue de supprimer le compte ID 1
 * et protégeant contre la suppression d'administrateurs par des tiers non autorisés.
 */
export const preventUser1Deletion: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const isTargetUser1 = id === 1 || id === '1'

  // 1. Sanctuarisation absolue de l'utilisateur ID 1 contre toute suppression
  if (isTargetUser1) {
    throw new APIError(
      'Action non autorisée : le compte Super Administrateur ID 1 est strictement sanctuarisé et ne peut jamais être supprimé.',
      403
    )
  }

  const currentUser = req?.user

  // 2. Un éditeur ne peut supprimer personne
  if (currentUser && !isAdmin(currentUser)) {
    throw new APIError(
      'Action non autorisée : les éditeurs ne sont pas autorisés à supprimer des utilisateurs.',
      403
    )
  }

  // 3. Un administrateur standard ne peut pas supprimer un autre administrateur
  if (currentUser && !isSuperAdmin(currentUser)) {
    try {
      const targetUser = await req.payload.findByID({
        collection: 'users',
        id,
      })
      const role = (targetUser as any)?.role
      if (targetUser && (role === 'admin' || role === 'super-admin')) {
        throw new APIError(
          'Action non autorisée : un administrateur ne peut pas supprimer un autre administrateur.',
          403
        )
      }
    } catch (err: any) {
      if (err instanceof APIError) throw err
      // Fallback si findByID échoue
    }
  }
}
