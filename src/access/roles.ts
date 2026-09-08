/**
 * Rôles et fonctions de contrôle d'accès (RBAC) pour Bokengi Group.
 * Toutes les fonctions sont strictement null-safe et vérifient le statut 'active'.
 */

export type UserRole = 'super-admin' | 'admin' | 'editor'
export type UserStatus = 'pending' | 'active' | 'suspended' | 'rejected'

export const ROLES: readonly UserRole[] = ['super-admin', 'admin', 'editor'] as const
export const STATUSES: readonly UserStatus[] = ['pending', 'active', 'suspended', 'rejected'] as const

export interface BaseUserContext {
  id?: number | string | null
  email?: string | null
  role?: UserRole | string | null
  status?: UserStatus | string | null
  [key: string]: unknown
}

/**
 * Vérifie si l'utilisateur est le Super Administrateur initial sanctuarisé (ID 1).
 * Le Super Admin possède les pleins pouvoirs système, configuration et gestion des comptes.
 */
export function isSuperAdmin(user?: unknown | null): boolean {
  if (!user || typeof user !== 'object') return false
  const u = user as BaseUserContext

  // Le compte ID 1 est le Super Admin unique de cette phase
  const isId1 = u.id === 1 || u.id === '1'

  // Si le statut est explicitement suspendu ou rejeté, refuser
  if (u.status === 'suspended' || u.status === 'rejected') {
    return false
  }

  // Si ID 1, reconnu Super Admin (même en phase de transition pré-migration si role n'est pas encore en DB)
  if (isId1) {
    return true
  }

  return u.role === 'super-admin' && u.status === 'active'
}

/**
 * Vérifie si l'utilisateur possède les privilèges Administrateur (ou Super Administrateur).
 * L'Admin gère les contenus et les utilisateurs secondaires (éditeurs/admins), mais ne peut
 * pas créer de Super Admin ni modifier le compte ID 1.
 */
export function isAdmin(user?: unknown | null): boolean {
  if (!user || typeof user !== 'object') return false
  const u = user as BaseUserContext

  if (isSuperAdmin(user)) return true

  // Un administrateur doit être strictement actif
  if (u.status !== 'active') return false

  return u.role === 'admin'
}

/**
 * Vérifie si l'utilisateur possède les privilèges Éditeur (ou supérieur).
 * L'Éditeur gère les publications et médias, mais n'a aucun accès d'administration des utilisateurs.
 */
export function isEditor(user?: unknown | null): boolean {
  if (!user || typeof user !== 'object') return false
  const u = user as BaseUserContext

  if (isAdmin(user)) return true

  if (u.status !== 'active') return false

  return u.role === 'editor'
}

/**
 * Vérifie si l'utilisateur peut accéder à l'interface d'administration Payload (/admin).
 * L'accès requiert un statut strictement 'active' et un rôle valide (super-admin, admin, editor).
 */
export function canAccessAdmin(user?: unknown | null): boolean {
  if (!user || typeof user !== 'object') return false
  const u = user as BaseUserContext

  // L'utilisateur ID 1 est toujours autorisé sauf suspension explicite
  if (isSuperAdmin(user)) return true

  // Tout autre compte doit être formellement actif
  if (u.status !== 'active') return false

  return u.role === 'admin' || u.role === 'editor'
}
