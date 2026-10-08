/**
 * MODULE D'INTÉGRATION CAL.COM & WEBHOOKS BOKENGI GROUP 2.0
 *
 * Traitement sécurisé des événements de réservation Cal.com :
 * 1. Vérification de la signature cryptographique HMAC SHA-256.
 * 2. Contrôle strict d'idempotence basé sur `booking.uid`.
 * 3. Recherche et association au dossier Lead dans ERPNext.
 * 4. Déclenchement de la notification Mattermost (#commercial-leads).
 * 5. Résilience réseau (retry-safe) et ZÉRO création automatique de données financières.
 */

import crypto from 'node:crypto'
import { sendMattermostNotification } from './mattermost'
import { submitLeadToERPNext, attachBookingToERPNextLead } from './erpnext-client'

// Cache mémoire pour l'idempotence des webhooks (TTL: 24h)
const processedBookingsCache = new Map<string, number>()
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

function cleanupExpiredCache() {
  const now = Date.now()
  for (const [uid, timestamp] of processedBookingsCache.entries()) {
    if (now - timestamp > CACHE_TTL_MS) {
      processedBookingsCache.delete(uid)
    }
  }
}

/**
 * Vérifie la signature HMAC SHA-256 d'un webhook Cal.com.
 */
export function verifyCalcomSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret?: string,
  env?: Record<string, any>
): { isValid: boolean; reason?: string } {
  let webhookSecret = secret
  if (!webhookSecret) {
    try {
      const cf = (globalThis as any)[Symbol.for('__cloudflare-context__')]
      if (cf?.env?.CALCOM_WEBHOOK_SECRET) {
        webhookSecret = cf.env.CALCOM_WEBHOOK_SECRET
      }
    } catch {}
  }
  if (!webhookSecret) {
    webhookSecret = process.env.CALCOM_WEBHOOK_SECRET
  }

  // Si aucun secret n'est configuré en environnement, la signature ne peut être vérifiée
  if (!webhookSecret) {
    if (process.env.NODE_ENV === 'production') {
      return { isValid: false, reason: 'CALCOM_WEBHOOK_SECRET is not configured in production' }
    }
    return { isValid: true, reason: 'No webhook secret configured (Development mode)' }
  }

  if (!signatureHeader) {
    return { isValid: false, reason: 'Missing X-Cal-Signature-256 header' }
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex')

    const cleanSignature = signatureHeader.replace(/^sha256=/i, '').trim()

    // Comparaison temporelle sécurisée anti-timing attack
    const signatureBuffer = Buffer.from(cleanSignature, 'hex')
    const expectedBuffer = Buffer.from(expectedSignature, 'hex')

    if (signatureBuffer.length !== expectedBuffer.length) {
      return { isValid: false, reason: 'Signature length mismatch' }
    }

    const match = crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    return { isValid: match, reason: match ? undefined : 'Signature hash mismatch' }
  } catch (err: any) {
    return { isValid: false, reason: `Verification error: ${err.message || String(err)}` }
  }
}

export interface CalcomWebhookPayload {
  triggerEvent: string
  createdAt?: string
  payload: {
    uid?: string
    id?: number | string
    bookingId?: number | string
    title?: string
    description?: string
    startTime?: string
    endTime?: string
    status?: string
    organizer?: {
      name?: string
      email?: string
      timeZone?: string
    }
    attendees?: Array<{
      name?: string
      email?: string
      timeZone?: string
    }>
    responses?: {
      name?: { value?: string }
      email?: { value?: string }
      notes?: { value?: string }
      [key: string]: any
    }
    metadata?: Record<string, any>
  }
}

/**
 * Traite le payload du webhook Cal.com de façon idempotente et sécurisée.
 */
export async function processCalcomWebhook(
  rawBody: string,
  signatureHeader: string | null,
  env?: Record<string, any>
): Promise<{
  statusCode: number
  success: boolean
  message: string
  bookingUid?: string
  leadId?: string | null
  isDuplicate?: boolean
}> {
  cleanupExpiredCache()

  // 1. Vérification de la signature HMAC
  const signatureCheck = verifyCalcomSignature(rawBody, signatureHeader, undefined, env)
  if (!signatureCheck.isValid) {
    console.warn(`[Cal.com Webhook] Signature invalide : ${signatureCheck.reason}`)
    return {
      statusCode: 401,
      success: false,
      message: `Signature verification failed: ${signatureCheck.reason}`,
    }
  }

  // 2. Parsing du payload
  let data: CalcomWebhookPayload
  try {
    data = JSON.parse(rawBody)
  } catch (err) {
    return {
      statusCode: 400,
      success: false,
      message: 'Invalid JSON payload',
    }
  }

  const { triggerEvent, payload } = data

  if (!payload) {
    return {
      statusCode: 400,
      success: false,
      message: 'Missing payload object in webhook',
    }
  }

  // 3. Extraction de l'identifiant idempotent unique (booking.uid)
  const bookingUid = String(payload.uid || payload.bookingId || payload.id || '').trim()

  if (!bookingUid) {
    return {
      statusCode: 400,
      success: false,
      message: 'Missing booking UID in Cal.com event',
    }
  }

  // 4. Contrôle d'idempotence (anti-doublon)
  if (processedBookingsCache.has(bookingUid)) {
    console.info(`[Cal.com Webhook] Événement déjà traité (Idempotence hit) pour le booking ${bookingUid}`)
    return {
      statusCode: 200,
      success: true,
      message: 'Event already processed (idempotent duplicate)',
      bookingUid,
      isDuplicate: true,
    }
  }

  // Enregistrement immédiat dans le cache d'idempotence
  processedBookingsCache.set(bookingUid, Date.now())

  // 5. Extraction des coordonnées du prospect
  const attendee = payload.attendees?.[0]
  const attendeeEmail = (
    attendee?.email ||
    payload.responses?.email?.value ||
    ''
  ).trim().toLowerCase()

  const attendeeName = (
    attendee?.name ||
    payload.responses?.name?.value ||
    'Prospect Cal.com'
  ).trim()

  const meetingTitle = payload.title || 'Cadrage de projet / Visioconférence'
  const startTime = payload.startTime || new Date().toISOString()
  const notes = payload.description || payload.responses?.notes?.value || ''

  let erpLeadId: string | null = null

  // 6. Interaction ERPNext (Recherche ou Création du Lead & Rattachement)
  try {
    const attachResult = await attachBookingToERPNextLead(
      {
        email: attendeeEmail,
        name: attendeeName,
        bookingUid,
        title: meetingTitle,
        startTime,
        notes,
      },
      env
    )

    erpLeadId = attachResult.leadId || null
  } catch (erpError: any) {
    console.warn(`[Cal.com Webhook] ERPNext indisponible lors du rattachement :`, erpError.message || erpError)
    // En cas d'échec ERPNext, retirer du cache pour autoriser le retry Cal.com
    processedBookingsCache.delete(bookingUid)
    return {
      statusCode: 503,
      success: false,
      message: 'ERPNext service temporarily unavailable (retry-safe)',
      bookingUid,
    }
  }

  // 7. Déclenchement de la notification Mattermost (#commercial-leads)
  try {
    const formattedDate = new Date(startTime).toLocaleString('fr-FR', {
      timeZone: 'Europe/Paris',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    await sendMattermostNotification({
      eventType: 'CALCOM_BOOKING',
      documentId: erpLeadId || `BOOKING-${bookingUid}`,
      title: `Réservation d'échange confirmée : ${meetingTitle}`,
      clientName: attendeeName,
      companyName: 'À qualifier lors de l\'échange',
      needType: 'Cadrage technique / Visioconférence',
      scheduledAt: `${formattedDate} (Heure de Paris)`,
      summary: `Réservation Cal.com UID: ${bookingUid}\nNotes: ${notes || 'Aucune note additionnelle'}`,
      status: 'Confirmé',
    })
  } catch (mmErr) {
    console.warn('[Cal.com Webhook] Notification Mattermost non transmise :', mmErr)
  }

  return {
    statusCode: 200,
    success: true,
    message: 'Booking successfully associated and notified',
    bookingUid,
    leadId: erpLeadId,
    isDuplicate: false,
  }
}
