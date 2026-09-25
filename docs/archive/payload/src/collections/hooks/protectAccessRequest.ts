import {
  APIError,
  type CollectionBeforeValidateHook,
  type CollectionBeforeChangeHook,
  type CollectionAfterChangeHook,
} from 'payload'
import { isSuperAdmin } from '../../access/roles'
import { prepareUserInvitation, generateActivationToken } from '../../services/invitation'

/**
 * Durée de validité d'une demande d'accès en attente : 15 jours.
 */
export const ACCESS_REQUEST_EXPIRATION_DAYS = 15
export const ACCESS_REQUEST_EXPIRATION_MS =
  ACCESS_REQUEST_EXPIRATION_DAYS * 24 * 60 * 60 * 1000

/**
 * Hook beforeValidate & beforeChange : garantit l'intégrité des statuts,
 * des rôles et l'interdiction stricte de toute auto-élévation.
 */
export const protectAccessRequestSubmission: CollectionBeforeValidateHook &
  CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  operation,
  req,
}) => {
  if (!data) return data

  const currentUser = req?.user

  // ==========================================================================
  // 1. OPÉRATION DE CRÉATION (CREATE)
  // ==========================================================================
  if (operation === 'create') {
    // a) Le statut initial d'une demande est OBLIGATOIREMENT 'pending'
    if (data.status && data.status !== 'pending') {
      throw new APIError(
        'Action non autorisée : le statut initial d\'une demande d\'accès est obligatoirement "pending".',
        403
      )
    }
    data.status = 'pending'

    // b) Le demandeur ne peut pas définir assignedRole, adminNotes, processedAt, processedBy à la création
    if ('assignedRole' in data && data.assignedRole !== undefined && data.assignedRole !== null) {
      throw new APIError(
        'Action non autorisée : l\'attribution d\'un rôle est réservée exclusivement au Super Administrateur.',
        403
      )
    }
    delete (data as any).assignedRole

    if ('adminNotes' in data && data.adminNotes !== undefined && data.adminNotes !== null && data.adminNotes !== '') {
      throw new APIError(
        'Action non autorisée : les notes administratives ne peuvent pas être définies lors de la soumission.',
        403
      )
    }
    delete (data as any).adminNotes

    if ('processedAt' in data && data.processedAt !== undefined && data.processedAt !== null) {
      throw new APIError(
        'Action non autorisée : la date de traitement ne peut pas être définie lors de la soumission.',
        403
      )
    }
    delete (data as any).processedAt

    if ('processedBy' in data && data.processedBy !== undefined && data.processedBy !== null) {
      throw new APIError(
        'Action non autorisée : l\'identifiant de traitement ne peut pas être défini lors de la soumission.',
        403
      )
    }
    delete (data as any).processedBy

    // c) Le rôle demandé ne peut être que 'admin' ou 'editor' (strictement JAMAIS 'super-admin')
    if (data.requestedRole === 'super-admin') {
      throw new APIError(
        'Action non autorisée : le rôle "super-admin" ne peut être ni demandé ni attribué via une demande d\'accès.',
        403
      )
    }
    if (data.requestedRole && !['admin', 'editor'].includes(data.requestedRole)) {
      throw new APIError(
        'Rôle demandé invalide : seuls "admin" et "editor" sont autorisés.',
        400
      )
    }
    if (!data.requestedRole) {
      data.requestedRole = 'editor'
    }

    // d) Le demandeur ne peut pas forcer expiresAt : calculé strictement côté serveur
    data.expiresAt = new Date(Date.now() + ACCESS_REQUEST_EXPIRATION_MS).toISOString()

    // e) Normalisation des chaînes et de l'email
    if (data.email) {
      data.email = data.email.trim().toLowerCase()
    }
    if (data.firstName) {
      data.firstName = data.firstName.trim()
    }
    if (data.lastName) {
      data.lastName = data.lastName.trim()
    }

    return data
  }

  // ==========================================================================
  // 2. OPÉRATION DE MISE À JOUR (UPDATE)
  // ==========================================================================
  if (operation === 'update') {
    // a) Seul le Super Admin ID 1 peut modifier une demande d'accès
    if (!isSuperAdmin(currentUser)) {
      throw new APIError(
        'Action non autorisée : seul le Super Administrateur ID 1 est habilité à traiter les demandes d\'accès.',
        403
      )
    }

    // b) Protection des états terminaux : une demande déjà approuvée, rejetée ou expirée est scellée
    if (originalDoc?.status && originalDoc.status !== 'pending') {
      if (data.status && data.status !== originalDoc.status) {
        throw new APIError(
          `Action impossible : cette demande d'accès a déjà été traitée (statut actuel: "${originalDoc.status}") et son statut ne peut plus être modifié.`,
          400
        )
      }
      if (data.assignedRole && data.assignedRole !== originalDoc.assignedRole) {
        throw new APIError(
          `Action impossible : cette demande d'accès a déjà été traitée et son rôle attribué ne peut plus être modifié.`,
          400
        )
      }
    }

    // c) Interdiction absolue d'attribuer le rôle 'super-admin'
    if (data.assignedRole === 'super-admin') {
      throw new APIError(
        'Action non autorisée : le rôle "super-admin" ne peut jamais être attribué via une demande d\'accès.',
        403
      )
    }
    if (data.requestedRole === 'super-admin') {
      throw new APIError(
        'Action non autorisée : le rôle "super-admin" ne peut jamais être sollicité ou modifié.',
        403
      )
    }

    // d) Vérification d'expiration : une demande expirée ne peut plus être approuvée
    const originalExpiresAt = originalDoc?.expiresAt
    const isExpired =
      originalDoc?.status === 'pending' &&
      originalExpiresAt &&
      new Date(originalExpiresAt).getTime() < Date.now()

    if (isExpired && data.status === 'approved') {
      throw new APIError(
        'Action impossible : cette demande d\'accès est expirée (> 15 jours) et ne peut plus être approuvée.',
        400
      )
    }

    // Si expirée et consultée sans changement explicite de statut, actualiser vers 'expired'
    if (isExpired && data.status === 'pending') {
      data.status = 'expired'
    }

    // d) Traitement de l'approbation ou du refus
    if (
      (data.status === 'approved' || data.status === 'rejected') &&
      originalDoc?.status === 'pending'
    ) {
      data.processedAt = new Date().toISOString()
      if (currentUser?.id) {
        data.processedBy = currentUser.id
      }

      if (data.status === 'approved') {
        // Déterminer assignedRole si non spécifié explicitement lors de l'update
        if (!data.assignedRole) {
          data.assignedRole = originalDoc?.assignedRole || originalDoc?.requestedRole || 'editor'
        }
        if (data.assignedRole === 'super-admin') {
          throw new APIError(
            'Action non autorisée : le rôle "super-admin" ne peut jamais être attribué.',
            403
          )
        }
      }
    }

    return data
  }

  return data
}

/**
 * Hook afterChange : déclenche la création du compte utilisateur et la préparation
 * du jeton d'invitation lors de l'approbation par le Super Administrateur.
 */
export const handleAccessRequestApproval: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  // Se déclenche UNIQUEMENT lors d'une transition pending -> approved
  if (operation !== 'update') return doc
  if (previousDoc?.status !== 'pending' || doc.status !== 'approved') return doc

  const targetEmail = doc.email?.trim().toLowerCase()
  if (!targetEmail) return doc

  // 1. Détection de collision / double approbation simultanée
  const existingUsers = await req.payload.find({
    collection: 'users',
    where: {
      email: {
        equals: targetEmail,
      },
    },
    limit: 1,
    req,
  })

  if (existingUsers.docs.length > 0) {
    throw new APIError(
      `Un compte utilisateur existe déjà pour l'adresse email ${targetEmail}.`,
      400
    )
  }

  // 2. Détermination du rôle attribué (strictement jamais super-admin)
  const roleToAssign = doc.assignedRole || doc.requestedRole || 'editor'
  if (roleToAssign === 'super-admin') {
    throw new APIError(
      'Action non autorisée : le rôle "super-admin" ne peut pas être attribué.',
      403
    )
  }

  // 3. Préparation du jeton d'activation cryptographique (48h)
  const invitation = prepareUserInvitation({
    email: targetEmail,
    name: `${doc.firstName} ${doc.lastName}`.trim(),
  })

  // 4. Création transactionnelle du compte Users
  try {
    await req.payload.create({
      collection: 'users',
      data: {
        name: `${doc.firstName} ${doc.lastName}`.trim(),
        email: targetEmail,
        role: roleToAssign,
        status: 'active',
        // Mot de passe inaccessible généré aléatoirement : activation via token reset password
        password: generateActivationToken(),
        resetPasswordToken: invitation.token,
        resetPasswordExpiration: invitation.expiresAt,
      } as any,
      req,
    })
  } catch (err: any) {
    // Si la création échoue, l'exception interrompt la transaction Payload
    // et garantit que la demande n'est pas faussement marquée 'approved'
    throw new APIError(
      `Échec de la création du compte utilisateur associé : ${err.message}`,
      500
    )
  }

  return doc
}
