/**
 * MODULE ROUTEUR ET INTÉGRATION MATTERMOST PAR PÔLE BOKENGI GROUP 2.0
 *
 * Passerelle de notifications opérationnelles ciblées par pôle métier :
 * - POL-it          → #pole-it (MATTERMOST_WEBHOOK_POLE_IT)
 * - POL-digital     → #pole-digital (MATTERMOST_WEBHOOK_POLE_DIGITAL)
 * - POL-business    → #pole-business (MATTERMOST_WEBHOOK_POLE_BUSINESS)
 * - POL-consulting  → #pole-consulting (MATTERMOST_WEBHOOK_POLE_CONSULTING)
 * - POL-events      → #pole-events (MATTERMOST_WEBHOOK_POLE_EVENTS)
 *
 * RÈGLE ABSOLUE D'ISOLATION INTER-PÔLES :
 * - Un projet appartient à UN PÔLE PROPRIÉTAIRE PRINCIPAL et sa notification
 *   est envoyée UNIQUEMENT au canal du pôle concerné.
 * - AUCUNE diffusion globale / transverse (pas de fallback vers un canal commun).
 * - En cas de pôle inconnu ou d'absence de webhook configuré, la notification est ignorée
 *   avec un log sécurisé sans interrompre la création du Lead/Projet dans ERPNext.
 *
 * RÈGLE STRICTE DE MINIMISATION DES DONNÉES (RGPD & SÉCURITÉ) :
 * - INTERDICTION TOTALE d'inclure : IBAN, BIC/SWIFT, mots de passe, tokens API, secrets.
 */

export type MattermostEventType =
  | 'NEW_LEAD'
  | 'NEW_PROJECT'
  | 'PROJECT_UPDATED'
  | 'ACTION_REQUIRED'
  | 'QUALIFIED_LEAD'
  | 'CALCOM_BOOKING'
  | 'QUOTATION_DRAFT'
  | 'QUOTATION_SUBMITTED'
  | 'SALES_ORDER_SUBMITTED'
  | 'SALES_INVOICE_SUBMITTED'
  | 'MANUAL_INTERVENTION_REQUIRED'

export interface MattermostEventPayload {
  eventType: MattermostEventType
  documentId?: string | number
  title?: string
  clientName?: string
  companyName?: string
  email?: string
  poleName?: string | null
  needType?: string
  amount?: number | string
  currency?: string
  status?: string
  summary?: string
  scheduledAt?: string
  assignee?: string
  actionRequired?: string
  deskUrl?: string
  extraDetails?: Record<string, string | number | boolean | null | undefined>
}

// ── NORMALISATION DES PÔLES (POL-*) ──

/**
 * Normalise un identifiant ou slug de pôle vers sa forme canonique ERPNext (`POL-*`).
 * Accepte : 'it', 'bokengi-it', 'POL-it' -> 'POL-it'
 *           'digital', 'bokengi-digital', 'POL-digital' -> 'POL-digital'
 *           'business', 'bokengi-business', 'POL-business' -> 'POL-business'
 *           'consulting', 'bokengi-consulting', 'POL-consulting' -> 'POL-consulting'
 *           'events', 'bokengi-events', 'POL-events' -> 'POL-events'
 * Renvoie `null` si le pôle est absent, vide, invalide ou inconnu.
 */
export function normalizePoleId(rawPole?: string | null): string | null {
  if (!rawPole || typeof rawPole !== 'string') return null

  const clean = rawPole.trim().toLowerCase()
  if (!clean) return null

  if (clean === 'it' || clean === 'bokengi-it' || clean === 'pol-it') return 'POL-it'
  if (clean === 'digital' || clean === 'bokengi-digital' || clean === 'pol-digital') return 'POL-digital'
  if (clean === 'business' || clean === 'bokengi-business' || clean === 'pol-business') return 'POL-business'
  if (clean === 'consulting' || clean === 'bokengi-consulting' || clean === 'pol-consulting') return 'POL-consulting'
  if (clean === 'events' || clean === 'bokengi-events' || clean === 'pol-events') return 'POL-events'

  return null
}

/**
 * Retourne le nom d'affichage lisible du pôle.
 */
export function getPoleDisplayName(poleId?: string | null): string {
  const norm = normalizePoleId(poleId)
  switch (norm) {
    case 'POL-it':
      return 'BOKENGI IT'
    case 'POL-digital':
      return 'BOKENGI DIGITAL'
    case 'POL-business':
      return 'BOKENGI BUSINESS'
    case 'POL-consulting':
      return 'BOKENGI CONSULTING'
    case 'POL-events':
      return 'BOKENGI EVENTS'
    default:
      return 'Non Spécifié'
  }
}

// ── ROUTAGE ET OBTENTION DU WEBHOOK MATTERMOST PAR PÔLE ──

/**
 * Récupère le webhook Mattermost strictement associé à un pôle canonique (`POL-*`).
 * RÈGLE ABSOLUE D'ISOLATION ET DE SÉCURITÉ :
 * - Renvoie l'URL du webhook spécifique au pôle (ex: MATTERMOST_WEBHOOK_POLE_DIGITAL).
 * - Si le pôle est inconnu/null OU si le webhook du pôle n'est pas configuré :
 *   RENVOIE UNDEFINED. AUCUN FALLBACK vers un canal transverse (#commercial-leads, MATTERMOST_WEBHOOK_URL, etc.).
 */
export function getWebhookUrlForPole(poleId: string | null): string | undefined {
  const canonicalPole = normalizePoleId(poleId)
  if (!canonicalPole) {
    return undefined
  }

  let envVarName: string | undefined
  switch (canonicalPole) {
    case 'POL-it':
      envVarName = 'MATTERMOST_WEBHOOK_POLE_IT'
      break
    case 'POL-digital':
      envVarName = 'MATTERMOST_WEBHOOK_POLE_DIGITAL'
      break
    case 'POL-business':
      envVarName = 'MATTERMOST_WEBHOOK_POLE_BUSINESS'
      break
    case 'POL-consulting':
      envVarName = 'MATTERMOST_WEBHOOK_POLE_CONSULTING'
      break
    case 'POL-events':
      envVarName = 'MATTERMOST_WEBHOOK_POLE_EVENTS'
      break
  }

  if (!envVarName) return undefined

  let url: string | undefined
  try {
    const cf = (globalThis as any)[Symbol.for('__cloudflare-context__')]
    if (cf?.env) {
      url = cf.env[envVarName]
    }
  } catch {}

  if (!url) {
    url = process.env[envVarName]
  }

  return url && url.trim().length > 0 ? url.trim() : undefined
}

/**
 * Fallback uniquement pour les événements transverses comptables / ops généraux (non-liés au routage pôle).
 */
function getWebhookUrlForEvent(eventType: MattermostEventType): string | undefined {
  let webhookUrl: string | undefined

  try {
    const cf = (globalThis as any)[Symbol.for('__cloudflare-context__')]
    if (cf?.env) {
      if (['QUOTATION_DRAFT', 'QUOTATION_SUBMITTED', 'SALES_ORDER_SUBMITTED'].includes(eventType)) {
        webhookUrl = cf.env.MATTERMOST_WEBHOOK_SALES || cf.env.MATTERMOST_WEBHOOK_URL
      } else if (eventType === 'SALES_INVOICE_SUBMITTED') {
        webhookUrl = cf.env.MATTERMOST_WEBHOOK_FINANCE || cf.env.MATTERMOST_WEBHOOK_URL
      } else if (eventType === 'MANUAL_INTERVENTION_REQUIRED') {
        webhookUrl = cf.env.MATTERMOST_WEBHOOK_OPS || cf.env.MATTERMOST_WEBHOOK_URL
      }
    }
  } catch {}

  if (!webhookUrl) {
    if (['QUOTATION_DRAFT', 'QUOTATION_SUBMITTED', 'SALES_ORDER_SUBMITTED'].includes(eventType)) {
      webhookUrl = process.env.MATTERMOST_WEBHOOK_SALES || process.env.MATTERMOST_WEBHOOK_URL
    } else if (eventType === 'SALES_INVOICE_SUBMITTED') {
      webhookUrl = process.env.MATTERMOST_WEBHOOK_FINANCE || process.env.MATTERMOST_WEBHOOK_URL
    } else if (eventType === 'MANUAL_INTERVENTION_REQUIRED') {
      webhookUrl = process.env.MATTERMOST_WEBHOOK_OPS || process.env.MATTERMOST_WEBHOOK_URL
    }
  }

  return webhookUrl
}

// ── FILTRAGE STRICT RGPD / SÉCURITÉ ──
const FORBIDDEN_KEYS_REGEX = /(iban|bic|swift|password|token|secret|rib|credential|private_key|auth|bearer)/i

function sanitizeKey(key: string): boolean {
  return !FORBIDDEN_KEYS_REGEX.test(key)
}

function sanitizeValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  let str = String(value).trim()
  str = str.replace(/\b[A-Z]{2}\d{2}[A-Z0-9]{12,30}\b/gi, '[DONNÉE BANCAIRE MASQUÉE]')
  str = str.replace(/\b(eyJ[a-zA-Z0-9_\-]{10,}\.[a-zA-Z0-9_\-]{10,}\.[a-zA-Z0-9_\-]{10,}|tok_[a-zA-Z0-9_]{16,})\b/g, '[TOKEN MASQUÉ]')
  return str
}

// ── IDEMPOTENCE ET ANTI-DOUBLONS (CACHE TTL 24H) ──
const processedEventsCache = new Map<string, number>()
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

function cleanupExpiredCache() {
  const now = Date.now()
  for (const [key, timestamp] of processedEventsCache.entries()) {
    if (now - timestamp > CACHE_TTL_MS) {
      processedEventsCache.delete(key)
    }
  }
}

/**
 * Construit le payload Markdown formaté pour Mattermost.
 */
export function buildMattermostMessage(payload: MattermostEventPayload): {
  username: string
  icon_emoji: string
  text: string
} {
  const erpBaseUrl = process.env.ERPNEXT_API_URL || 'https://erp.bokengi-group.com'
  const poleLabel = getPoleDisplayName(payload.poleName)
  const deskLink = payload.deskUrl || (payload.documentId ? `${erpBaseUrl}/app` : erpBaseUrl)

  // 1. Événements métiers spécifiques de pôle (NEW_PROJECT, PROJECT_UPDATED, ACTION_REQUIRED)
  if (payload.eventType === 'NEW_PROJECT') {
    const lines: string[] = [
      '### 🚀 NOUVEAU PROJET',
      '',
      `**Projet :** ${sanitizeValue(payload.title || 'Projet non nommé')}`,
      `**Client :** ${sanitizeValue(payload.clientName || payload.companyName || 'N/A')}`,
      `**Pôle :** ${poleLabel}`,
      `**Statut :** ${sanitizeValue(payload.status || 'Nouveau')}`,
    ]

    if (payload.summary) {
      lines.push('')
      lines.push(`> ${sanitizeValue(payload.summary).replace(/\n/g, '\n> ')}`)
    }

    lines.push('')
    lines.push(`🔗 [Voir le projet dans ERPNext →](${deskLink})`)

    return {
      username: 'Support Bokengi Group',
      icon_emoji: ':rocket:',
      text: lines.join('\n'),
    }
  }

  if (payload.eventType === 'PROJECT_UPDATED') {
    const lines: string[] = [
      '### 🔄 PROJET MIS À JOUR',
      '',
      `**Projet :** ${sanitizeValue(payload.title || payload.documentId || 'Projet')}`,
      `**Pôle :** ${poleLabel}`,
      `**Nouveau statut :** ${sanitizeValue(payload.status || 'En cours')}`,
    ]

    if (payload.summary) {
      lines.push('')
      lines.push(`> ${sanitizeValue(payload.summary).replace(/\n/g, '\n> ')}`)
    }

    lines.push('')
    lines.push(`🔗 [Voir le projet dans ERPNext →](${deskLink})`)

    return {
      username: 'Support Bokengi Group',
      icon_emoji: ':arrows_counterclockwise:',
      text: lines.join('\n'),
    }
  }

  if (payload.eventType === 'ACTION_REQUIRED') {
    const lines: string[] = [
      '### ⚠️ ACTION REQUISE',
      '',
      `**Projet :** ${sanitizeValue(payload.title || payload.documentId || 'Projet')}`,
      `**Pôle :** ${poleLabel}`,
      `**Action / Alerte :** ${sanitizeValue(payload.actionRequired || payload.summary || 'Intervention nécessaire')}`,
    ]

    lines.push('')
    lines.push(`🔗 [Voir dans ERPNext →](${deskLink})`)

    return {
      username: 'Support Bokengi Group',
      icon_emoji: ':warning:',
      text: lines.join('\n'),
    }
  }

  // 2. Formatage standardisé pour NEW_LEAD et événements généraux
  let icon = ':briefcase:'
  let headerTitle = 'Notification Bokengi'
  let channelKicker = poleLabel !== 'Non Spécifié' ? poleLabel : 'BOKENGI GROUP'

  switch (payload.eventType) {
    case 'NEW_LEAD':
      icon = ':incoming_envelope:'
      headerTitle = 'Nouveau prospect reçu'
      channelKicker = 'CRM LEADS'
      break
    case 'QUALIFIED_LEAD':
      icon = ':white_check_mark:'
      headerTitle = 'Prospect Qualifié en Opportunité'
      channelKicker = 'CRM QUALIFICATION'
      break
    case 'CALCOM_BOOKING':
      icon = ':calendar:'
      headerTitle = 'Nouvelle Réservation Cal.com'
      channelKicker = 'AGENDA & CADRAGE'
      break
    case 'QUOTATION_DRAFT':
      icon = ':memo:'
      headerTitle = 'Devis Créé (Brouillon)'
      channelKicker = 'AFFAIRES & DEVIS'
      break
    case 'QUOTATION_SUBMITTED':
      icon = ':page_facing_up:'
      headerTitle = 'Devis Validé & Transmis au Client'
      channelKicker = 'AFFAIRES & DEVIS'
      break
    case 'SALES_ORDER_SUBMITTED':
      icon = ':star2:'
      headerTitle = 'Bon de Commande Signé (Sales Order)'
      channelKicker = 'COMMANDES CLIENT'
      break
    case 'SALES_INVOICE_SUBMITTED':
      icon = ':receipt:'
      headerTitle = 'Facture Émise (Validation Humaine)'
      channelKicker = 'FINANCE & FACTURATION'
      break
    case 'MANUAL_INTERVENTION_REQUIRED':
      icon = ':warning:'
      headerTitle = 'Intervention Manuelle Requise'
      channelKicker = 'OPS & ALERTES'
      break
  }

  const lines: string[] = [
    `### ${icon} [${channelKicker}] ${headerTitle}`,
    `**${sanitizeValue(payload.title || '')}**`,
    '',
    '| Paramètre | Valeur |',
    '| :--- | :--- |',
  ]

  if (payload.clientName) lines.push(`| **Client / Contact** | ${sanitizeValue(payload.clientName)} |`)
  if (payload.companyName) lines.push(`| **Entreprise** | ${sanitizeValue(payload.companyName)} |`)
  lines.push(`| **Pôle Concerné** | ${poleLabel} |`)
  if (payload.needType) lines.push(`| **Type de Sollicitation** | ${sanitizeValue(payload.needType)} |`)
  if (payload.documentId) lines.push(`| **Réf. ERPNext** | \`${sanitizeValue(payload.documentId)}\` |`)
  if (payload.amount !== undefined && payload.amount !== null) {
    lines.push(`| **Montant Global** | **${sanitizeValue(payload.amount)} ${payload.currency || 'EUR'}** |`)
  }
  if (payload.scheduledAt) lines.push(`| **Créneau Prévu** | ${sanitizeValue(payload.scheduledAt)} |`)
  if (payload.status) lines.push(`| **Statut Actuel** | \`${sanitizeValue(payload.status)}\` |`)
  if (payload.assignee) lines.push(`| **Responsable** | @${sanitizeValue(payload.assignee)} |`)

  // Détails additionnels assainis (extraDetails)
  if (payload.extraDetails) {
    for (const [k, v] of Object.entries(payload.extraDetails)) {
      if (sanitizeKey(k) && v !== undefined && v !== null) {
        lines.push(`| **${k}** | ${sanitizeValue(v)} |`)
      }
    }
  }

  if (payload.summary) {
    lines.push('')
    lines.push(`> ${sanitizeValue(payload.summary).replace(/\n/g, '\n> ')}`)
  }

  lines.push('')
  lines.push(`🔗 [Accéder au dossier dans ERPNext Desk →](${deskLink})`)

  return {
    username: 'Support Bokengi Group',
    icon_emoji: icon,
    text: lines.join('\n'),
  }
}

/**
 * Envoie une notification vers Mattermost avec routage strict par pôle.
 * Non bloquant, résilient et protégé contre les doublons.
 */
export async function sendMattermostNotification(
  payload: MattermostEventPayload
): Promise<{ success: boolean; routed?: boolean; duplicate?: boolean; error?: string }> {
  cleanupExpiredCache()

  const canonicalPole = normalizePoleId(payload.poleName)

  // Détermination du Webhook selon la nature de l'événement et le pôle
  let webhookUrl: string | undefined

  if (canonicalPole || ['NEW_LEAD', 'NEW_PROJECT', 'PROJECT_UPDATED', 'ACTION_REQUIRED'].includes(payload.eventType)) {
    // Événement lié à un pôle : ROUTAGE PAR PÔLE STRICT
    if (!canonicalPole) {
      console.warn(
        `[Mattermost Router] Pôle inconnu ou non spécifié ("${payload.poleName}"). Notification ignorée (zéro diffusion transverse).`
      )
      return { success: true, routed: false }
    }

    webhookUrl = getWebhookUrlForPole(canonicalPole)

    if (!webhookUrl) {
      console.info(
        `[Mattermost Router] Aucun webhook configuré pour le pôle ${canonicalPole}. Notification ignorée.`
      )
      return { success: true, routed: false }
    }
  } else {
    // Événement comptable / ops transverse d'arrière-plan
    webhookUrl = getWebhookUrlForEvent(payload.eventType)
    if (!webhookUrl) {
      console.info(`[Mattermost Router] Webhook non configuré pour l'événement ${payload.eventType}. Notification ignorée.`)
      return { success: true, routed: false }
    }
  }

  // Contrôle d'idempotence (anti-doublon)
  const eventId = payload.documentId || payload.title || 'generic-event'
  const idempotencyKey = `${canonicalPole || 'global'}:${payload.eventType}:${eventId}`

  if (processedEventsCache.has(idempotencyKey)) {
    console.info(`[Mattermost Router] Notification déjà transmise (idempotence hit) pour ${idempotencyKey}`)
    return { success: true, routed: true, duplicate: true }
  }

  processedEventsCache.set(idempotencyKey, Date.now())

  const message = buildMattermostMessage(payload)

  try {
    console.info(
      `[Mattermost Router] Envoi du webhook pour le pôle ${canonicalPole || 'global'} (${payload.eventType}, Doc ID: ${payload.documentId || 'N/A'})...`
    )

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.warn(
        `[Mattermost Router] Réponse HTTP ${res.status} reçue du webhook pour le pôle ${canonicalPole || payload.eventType} : ${errText}`
      )
      return { success: false, routed: true, error: `HTTP ${res.status}: ${errText}` }
    }

    console.info(
      `[Mattermost Router] Notification transmise avec succès au pôle ${canonicalPole || 'global'} (${payload.eventType}) - HTTP ${res.status}`
    )
    return { success: true, routed: true }
  } catch (err: any) {
    console.warn(
      `[Mattermost Router] Exception réseau lors de l'envoi du webhook pour le pôle ${canonicalPole || payload.eventType} :`,
      err?.message || err
    )
    return { success: false, routed: true, error: err?.message || String(err) }
  }
}
