import { APIError, type CollectionBeforeValidateHook, type CollectionBeforeChangeHook } from 'payload'

/**
 * Liste des champs constituant la soumission originale du prospect.
 * Ces données sont strictement immuables après création du Lead.
 */
export const IMMUTABLE_PROSPECT_FIELDS = [
  'firstname',
  'lastname',
  'company',
  'email',
  'phone',
  'requestType',
  'pole',
  'message',
  'source',
] as const

export type ImmutableProspectField = (typeof IMMUTABLE_PROSPECT_FIELDS)[number]

/**
 * Normalise l'identifiant d'une relation (ex: pole).
 * Supporte un ID numérique, un ID string ou un objet document peuplé { id: ... }.
 */
export function normalizeRelationId(val: unknown): string | null {
  if (val === null || val === undefined || val === '') return null
  if (typeof val === 'object' && val !== null && 'id' in val) {
    const id = (val as { id: unknown }).id
    return id !== null && id !== undefined && id !== '' ? String(id) : null
  }
  return String(val)
}

/**
 * Normalise une chaîne textuelle pour comparaison (espaces, null/undefined).
 */
export function normalizeString(val: unknown): string | null {
  if (val === null || val === undefined) return null
  const str = String(val).trim()
  return str.length === 0 ? null : str
}

/**
 * Détecte si la valeur entrante dans un champ immuable est différente
 * de la valeur originale persistée en base de données.
 */
export function isFieldDifferent(
  incomingVal: unknown,
  originalVal: unknown,
  field: ImmutableProspectField
): boolean {
  if (field === 'pole') {
    const incId = normalizeRelationId(incomingVal)
    const origId = normalizeRelationId(originalVal)
    return incId !== origId
  }

  if (field === 'email') {
    const incEmail = normalizeString(incomingVal)?.toLowerCase() ?? null
    const origEmail = normalizeString(originalVal)?.toLowerCase() ?? null
    return incEmail !== origEmail
  }

  const incStr = normalizeString(incomingVal)
  const origStr = normalizeString(originalVal)
  return incStr !== origStr
}

/**
 * Hook serveur vérifiant l'immutabilité des champs prospect lors de tout UPDATE.
 * Rejette explicitement avec HTTP 403 (APIError) si un champ prospect est modifié.
 */
export const protectLeadImmutability: CollectionBeforeValidateHook & CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  operation,
}) => {
  // L'immutabilité ne s'applique qu'aux opérations de modification (UPDATE)
  if (operation !== 'update' || !originalDoc || !data) {
    return data
  }

  const modifiedFields: ImmutableProspectField[] = []

  for (const field of IMMUTABLE_PROSPECT_FIELDS) {
    // Si le champ n'est pas présent dans le payload entrant, il n'est pas ciblé par la requête
    if (!(field in data) || data[field] === undefined) {
      continue
    }

    const incomingVal = data[field]
    const originalVal = (originalDoc as any)[field]

    if (isFieldDifferent(incomingVal, originalVal, field)) {
      modifiedFields.push(field)
    }
  }

  if (modifiedFields.length > 0) {
    const fieldDescriptions = modifiedFields.map((f) => `"${f}"`).join(', ')
    const message =
      modifiedFields.length === 1
        ? `Action non autorisée : le champ ${fieldDescriptions} fait partie de la soumission originale du prospect et est strictement immuable.`
        : `Action non autorisée : les champs ${fieldDescriptions} font partie de la soumission originale du prospect et sont strictement immuables.`

    throw new APIError(message, 403)
  }

  return data
}
