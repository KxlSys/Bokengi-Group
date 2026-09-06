import type { Payload, Where } from 'payload'

export interface LeadKpisData {
  total: number
  newCount: number
  contactedCount: number
  qualifiedCount: number
  convertedCount: number
  archivedCount: number
}

export interface LeadKpisResult {
  data: LeadKpisData | null
  error: string | null
}

async function countDocs(payload: Payload, where?: Where): Promise<number> {
  if (typeof payload.count === 'function') {
    const res = await payload.count({
      collection: 'leads',
      where,
      overrideAccess: true,
    })
    return typeof res.totalDocs === 'number' ? res.totalDocs : 0
  }

  const res = await payload.find({
    collection: 'leads',
    limit: 0,
    depth: 0,
    pagination: true,
    where,
    overrideAccess: true,
  })
  return typeof res.totalDocs === 'number' ? res.totalDocs : 0
}

export async function getLeadKpis(payloadInstance?: Payload): Promise<LeadKpisResult> {
  try {
    let payload = payloadInstance
    if (!payload) {
      const { getPayload } = await import('payload')
      const configPromise = (await import('@payload-config')).default
      payload = await getPayload({ config: configPromise })
    }

    const [total, newCount, contactedCount, qualifiedCount, convertedCount, archivedCount] =
      await Promise.all([
        countDocs(payload),
        countDocs(payload, { status: { equals: 'new' } }),
        countDocs(payload, { status: { equals: 'contacted' } }),
        countDocs(payload, { status: { equals: 'qualified' } }),
        countDocs(payload, { status: { equals: 'converted' } }),
        countDocs(payload, { status: { equals: 'archived' } }),
      ])

    return {
      data: {
        total,
        newCount,
        contactedCount,
        qualifiedCount,
        convertedCount,
        archivedCount,
      },
      error: null,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue lors du calcul des KPI'
    console.error('getLeadKpis failed:', message)
    return {
      data: null,
      error: message,
    }
  }
}