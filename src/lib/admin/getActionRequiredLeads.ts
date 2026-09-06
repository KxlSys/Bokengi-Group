import type { Payload, Where } from 'payload'
import type { Lead } from '@/payload-types'

export type ActionLeadStatus = 'new' | 'contacted' | 'qualified'

export interface ActionRequiredLead {
  id: number
  firstname: string
  lastname: string
  company?: string | null
  email: string
  phone?: string | null
  requestType: 'devis' | 'cadrage' | 'partenariat' | 'autre'
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'archived'
  createdAt: string
  message: string
}

export interface GetActionRequiredOptions {
  statuses?: ActionLeadStatus[]
  limit?: number
}

export interface ActionRequiredLeadsResult {
  data: ActionRequiredLead[] | null
  totalCount: number
  error: string | null
}

const DEFAULT_STATUSES: ActionLeadStatus[] = ['new', 'contacted']
const DEFAULT_LIMIT = 6

/**
 * Récupère côté serveur les demandes (Leads) nécessitant une action prioritaire.
 * Utilise l'API native Payload avec overrideAccess: true sans créer de connexion DB parallèle.
 */
export async function getActionRequiredLeads(
  payloadInstance?: Payload,
  options?: GetActionRequiredOptions
): Promise<ActionRequiredLeadsResult> {
  const statuses = options?.statuses ?? DEFAULT_STATUSES
  const limit = options?.limit ?? DEFAULT_LIMIT

  try {
    let payload = payloadInstance
    if (!payload) {
      const { getPayload } = await import('payload')
      const configPromise = (await import('@payload-config')).default
      payload = await getPayload({ config: configPromise })
    }

    const whereClause: Where = {
      status: {
        in: statuses,
      },
    }

    const result = await payload.find({
      collection: 'leads',
      where: whereClause,
      sort: '-createdAt',
      limit,
      depth: 0,
      overrideAccess: true,
    })

    const leads: ActionRequiredLead[] = (result.docs as unknown as Lead[]).map((doc) => ({
      id: doc.id,
      firstname: doc.firstname || '',
      lastname: doc.lastname || '',
      company: doc.company ?? null,
      email: doc.email || '',
      phone: doc.phone ?? null,
      requestType: doc.requestType || 'autre',
      status: doc.status || 'new',
      createdAt: doc.createdAt,
      message: doc.message || '',
    }))

    return {
      data: leads,
      totalCount: typeof result.totalDocs === 'number' ? result.totalDocs : leads.length,
      error: null,
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erreur inconnue lors de la récupération des demandes à traiter'
    console.error('getActionRequiredLeads failed:', message)
    return {
      data: null,
      totalCount: 0,
      error: message,
    }
  }
}
