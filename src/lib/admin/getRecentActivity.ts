import type { Payload } from 'payload'
import type { Lead } from '@/payload-types'

export interface RecentActivityItem {
  id: number
  firstname: string
  lastname: string
  company?: string | null
  email: string
  requestType: 'devis' | 'cadrage' | 'partenariat' | 'autre'
  requestTypeLabel: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'archived'
  statusLabel: string
  createdAt: string
  leadUrl: string
}

export interface GetRecentActivityOptions {
  limit?: number
}

export interface RecentActivityResult {
  data: RecentActivityItem[] | null
  error: string | null
}

const DEFAULT_LIMIT = 6

const REQUEST_TYPE_LABELS: Record<string, string> = {
  devis: 'Demande de devis',
  cadrage: 'Cadrage de projet',
  partenariat: 'Partenariat',
  autre: 'Autre sollicitation',
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Nouveau',
  contacted: 'Contacté',
  qualified: 'Qualifié',
  converted: 'Converti',
  archived: 'Archivé',
}

/**
 * Récupère le flux chronologique des demandes récentes enregistrées dans Payload.
 * Basé strictement sur les données réelles de la collection Leads (aucun faux log).
 */
export async function getRecentActivity(
  payloadInstance?: Payload,
  options?: GetRecentActivityOptions
): Promise<RecentActivityResult> {
  const limit = options?.limit ?? DEFAULT_LIMIT

  try {
    let payload = payloadInstance
    if (!payload) {
      const { getPayload } = await import('payload')
      const configPromise = (await import('@payload-config')).default
      payload = await getPayload({ config: configPromise })
    }

    const result = await payload.find({
      collection: 'leads',
      sort: '-createdAt',
      limit,
      depth: 0,
      overrideAccess: true,
    })

    const activities: RecentActivityItem[] = (result.docs as unknown as Lead[]).map((doc) => ({
      id: doc.id,
      firstname: doc.firstname || '',
      lastname: doc.lastname || '',
      company: doc.company ?? null,
      email: doc.email || '',
      requestType: doc.requestType || 'autre',
      requestTypeLabel: REQUEST_TYPE_LABELS[doc.requestType] || doc.requestType || 'Demande',
      status: doc.status || 'new',
      statusLabel: STATUS_LABELS[doc.status] || doc.status || 'En attente',
      createdAt: doc.createdAt,
      leadUrl: `/admin/collections/leads/${doc.id}`,
    }))

    return {
      data: activities,
      error: null,
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur inconnue lors de la récupération de l'activité récente"
    console.error('getRecentActivity failed:', message)
    return {
      data: null,
      error: message,
    }
  }
}
