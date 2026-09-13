/**
 * MODULE DE NOTIFICATIONS EMAIL BOKENGI GROUP 2.0 (RESEND)
 *
 * Principes de sécurité et résilience :
 * - Aucune clé API hardcodée (uniquement lue depuis process.env.RESEND_API_KEY).
 * - Domaine officiel d'envoi : contact@bokengi-group.com.
 * - Ne bloque JAMAIS l'enregistrement du lead en cas d'absence de clé ou d'erreur réseau.
 * - Envoi asynchrone non-bloquant après confirmation d'écriture en base (CREATE uniquement).
 */

export interface LeadNotificationData {
  id?: string | number
  firstname: string
  lastname: string
  company?: string | null
  email: string
  phone?: string | null
  requestType: string
  poleName?: string
  message: string
  source?: string
  status?: string
  priority?: string
  createdAt?: string
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatParisDate(isoDate?: string): string {
  try {
    const d = isoDate ? new Date(isoDate) : new Date()
    if (isNaN(d.getTime())) return new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Paris',
    }).format(d)
  } catch {
    return new Date().toISOString()
  }
}

export const REQUEST_TYPE_LABELS: Record<string, string> = {
  devis: 'Devis chiffré',
  cadrage: 'Cadrage de projet & audit',
  support: 'Support technique',
  partenariat: 'Partenariat institutionnel',
  autre: 'Autre sollicitation',
}

export const STATUS_LABELS: Record<string, string> = {
  new: 'Nouveau',
  contacted: 'Contacté',
  qualifying: 'Qualifié',
  converted: 'Converti',
  archived: 'Archivé',
}

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
  urgent: 'Urgente',
}

export function formatLeadEmailSubject(lead: { requestType?: string; company?: string | null }): string {
  const typeLabel = (lead.requestType && REQUEST_TYPE_LABELS[lead.requestType]) || lead.requestType || 'Demande'
  const companyPart = lead.company && lead.company.trim() ? lead.company.trim() : 'Particulier / Non renseigné'
  return `[Bokengi] Nouveau projet reçu — ${typeLabel} — ${companyPart}`
}

export function buildLeadNotificationContent(lead: LeadNotificationData): {
  subject: string
  html: string
  text: string
  adminLeadUrl: string
  formattedDate: string
} {
  const fullName = `${lead.firstname} ${lead.lastname}`.trim() || 'Prospect inconnu'
  const poleLabel = lead.poleName || 'Général / Non spécifié'
  const typeLabel = (lead.requestType && REQUEST_TYPE_LABELS[lead.requestType]) || lead.requestType || 'Demande'
  const statusLabel = (lead.status && STATUS_LABELS[lead.status]) || lead.status || 'Nouveau'
  const priorityLabel = (lead.priority && PRIORITY_LABELS[lead.priority]) || lead.priority || 'Moyenne'
  const formattedDate = formatParisDate(lead.createdAt)

  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.NODE_ENV === 'production' ? 'https://bokengi-group.com' : 'http://localhost:3000')

  const adminLeadUrl = lead.id
    ? `${serverUrl}/admin/collections/leads/${lead.id}`
    : `${serverUrl}/admin/collections/leads`

  const teamSubject = formatLeadEmailSubject(lead)

  const teamHtml = `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${escapeHtml(teamSubject)}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #0F172A; background-color: #F1F5F9; margin: 0; padding: 24px 12px; }
          .container { max-width: 620px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
          .banner { background: #00124D; border-bottom: 3px solid #0033A0; padding: 24px 30px; }
          .banner-kicker { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #16B8F3; margin-bottom: 6px; }
          .banner-title { font-size: 20px; font-weight: 700; color: #FFFFFF; margin: 0; }
          .content { padding: 30px; }
          .badge-bar { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #E2E8F0; display: flex; gap: 8px; flex-wrap: wrap; }
          .badge { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; letter-spacing: 0.5px; }
          .badge-type { background: #0033A0; color: #FFFFFF; }
          .badge-status { background: #E0F2FE; color: #0369A1; }
          .badge-priority { background: #FEF3C7; color: #B45309; }
          .grid { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          .grid td { padding: 8px 0; vertical-align: top; }
          .grid-label { width: 36%; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748B; letter-spacing: 0.5px; }
          .grid-value { width: 64%; font-size: 14px; color: #0F172A; font-weight: 500; }
          .grid-value strong { color: #00124D; }
          .message-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-left: 4px solid #0033A0; padding: 18px 20px; border-radius: 4px; margin: 20px 0 28px 0; }
          .message-title { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #0033A0; margin-bottom: 10px; letter-spacing: 0.5px; }
          .message-body { font-size: 14px; color: #0F172A; white-space: pre-wrap; line-height: 1.6; word-break: break-word; }
          .cta-wrap { text-align: center; margin: 30px 0 10px 0; }
          .cta-button { display: inline-block; background-color: #0033A0; color: #FFFFFF !important; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0, 51, 160, 0.25); }
          .footer { background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 18px 30px; font-size: 12px; color: #64748B; text-align: center; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="banner">
            <div class="banner-kicker">CRM Bokengi Group · Nouveau projet</div>
            <h1 class="banner-title">[Bokengi] Nouveau projet reçu</h1>
          </div>
          <div class="content">
            <div class="badge-bar">
              <span class="badge badge-type">${escapeHtml(typeLabel)}</span>
              <span class="badge badge-status">Statut : ${escapeHtml(statusLabel)}</span>
              <span class="badge badge-priority">Priorité : ${escapeHtml(priorityLabel)}</span>
            </div>

            <table class="grid" role="presentation">
              <tr>
                <td class="grid-label">Date & Heure</td>
                <td class="grid-value">${escapeHtml(formattedDate)}</td>
              </tr>
              <tr>
                <td class="grid-label">Contact</td>
                <td class="grid-value"><strong>${escapeHtml(fullName)}</strong></td>
              </tr>
              <tr>
                <td class="grid-label">Entreprise</td>
                <td class="grid-value">${escapeHtml(lead.company || 'Particulier / Non renseigné')}</td>
              </tr>
              <tr>
                <td class="grid-label">Email</td>
                <td class="grid-value"><a href="mailto:${escapeHtml(lead.email)}" style="color: #0055D4; text-decoration: none; font-weight: 600;">${escapeHtml(lead.email)}</a></td>
              </tr>
              <tr>
                <td class="grid-label">Téléphone</td>
                <td class="grid-value">${escapeHtml(lead.phone || 'Non renseigné')}</td>
              </tr>
              <tr>
                <td class="grid-label">Pôle ciblé</td>
                <td class="grid-value"><strong>${escapeHtml(poleLabel)}</strong></td>
              </tr>
              <tr>
                <td class="grid-label">Type sollicitation</td>
                <td class="grid-value">${escapeHtml(typeLabel)}</td>
              </tr>
              <tr>
                <td class="grid-label">Origine technique</td>
                <td class="grid-value"><code style="font-size: 12px; background: #E2E8F0; padding: 2px 6px; border-radius: 3px;">${escapeHtml(lead.source || 'website-contact-form')}</code></td>
              </tr>
            </table>

            <div class="message-box">
              <div class="message-title">💬 Description du projet & besoin original</div>
              <div class="message-body">${escapeHtml(lead.message)}</div>
            </div>

            <div class="cta-wrap">
              <a href="${adminLeadUrl}" class="cta-button" target="_blank" rel="noopener noreferrer">
                Consulter le dossier dans l'Admin →
              </a>
            </div>
          </div>
          <div class="footer">
            Notification automatique envoyée à l'équipe Bokengi Group.<br>
            Plateforme officielle : <a href="${serverUrl}" style="color: #0055D4; text-decoration: none;">bokengi-group.com</a>
          </div>
        </div>
      </body>
    </html>
  `

  const teamText = [
    `======================================================`,
    `BOKENGI GROUP — NOUVEAU PROJET REÇU`,
    `======================================================`,
    ``,
    `Date & Heure      : ${formattedDate}`,
    `Type de projet    : ${typeLabel}`,
    `Pôle d'expertise  : ${poleLabel}`,
    `Statut initial    : ${statusLabel}`,
    `Priorité initiale : ${priorityLabel}`,
    ``,
    `COORDONNÉES DU CONTACT`,
    `----------------------`,
    `Nom du contact    : ${fullName}`,
    `Entreprise        : ${lead.company || 'Particulier / Non renseigné'}`,
    `Email             : ${lead.email}`,
    `Téléphone         : ${lead.phone || 'Non renseigné'}`,
    `Source technique  : ${lead.source || 'website-contact-form'}`,
    ``,
    `DESCRIPTION DU PROJET / BESOIN`,
    `------------------------------`,
    lead.message,
    ``,
    `ACCÉDER AU DOSSIER DANS PAYLOAD ADMIN :`,
    adminLeadUrl,
    ``,
    `------------------------------------------------------`,
    `Bokengi Group · Construire. Protéger. Développer.`,
  ].join('\n')

  return { subject: teamSubject, html: teamHtml, text: teamText, adminLeadUrl, formattedDate }
}

/**
 * Envoie la notification à l'équipe interne et l'accusé de réception au prospect.
 */
export async function sendLeadNotifications(
  lead: LeadNotificationData
): Promise<{ success: boolean; details?: string }> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.info(
      `[Notifications CRM] Clé RESEND_API_KEY non configurée. Lead #${lead.id || 'new'} (${lead.email}) enregistré en base sans envoi d'e-mail.`
    )
    return { success: true, details: 'Mode hors-ligne / Clé Resend non fournie' }
  }

  const teamEmail = process.env.CONTACT_EMAIL || 'contact@bokengi-group.com'
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Bokengi Group <contact@bokengi-group.com>'
  const fullName = `${lead.firstname} ${lead.lastname}`.trim() || 'Prospect inconnu'
  const poleLabel = lead.poleName || 'Général / Non spécifié'
  const typeLabel = (lead.requestType && REQUEST_TYPE_LABELS[lead.requestType]) || lead.requestType || 'Demande'

  const { subject: teamSubject, html: teamHtml, text: teamText, adminLeadUrl } = buildLeadNotificationContent(lead)

  // 2. Template Email Accusé de réception Prospect (HTML)
  const clientHtml = `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0F172A; background-color: #F8FAFC; margin: 0; padding: 20px; }
          .card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; max-width: 600px; margin: 0 auto; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
          .header { border-bottom: 2px solid #0033A0; padding-bottom: 15px; margin-bottom: 20px; }
          .title { font-size: 20px; font-weight: bold; color: #00124D; margin: 0; }
          .highlight { color: #0055D4; font-weight: 600; }
          .recap-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 15px; margin: 20px 0; font-size: 13px; color: #334155; }
          .footer { font-size: 11px; color: #94A3B8; margin-top: 25px; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h2 class="title">Bokengi Group · Confirmation de réception</h2>
          </div>
          <p>Bonjour ${escapeHtml(lead.firstname)},</p>
          <p>
            Nous vous confirmons la bonne réception de votre demande concernant <span class="highlight">${escapeHtml(poleLabel)}</span> (${escapeHtml(typeLabel)}).
          </p>
          <p>
            Notre équipe d'ingénieurs et de consultants étudie actuellement vos éléments. Nous reviendrons vers vous avec des propositions concrètes et un cadrage adapté dans un délai de <strong>24 à 48 heures ouvrées</strong>.
          </p>
          <div class="recap-box">
            <strong>Rappel de votre message :</strong><br>
            <em>${escapeHtml(lead.message.slice(0, 350))}${lead.message.length > 350 ? '...' : ''}</em>
          </div>
          <p>
            Pour toute précision complémentaire d'ici notre retour, vous pouvez nous écrire directement en réponse à ce message.
          </p>
          <p>
            Cordialement,<br>
            <strong>La Direction des Projets</strong><br>
            Bokengi Group · <em>Construire. Protéger. Développer.</em>
          </p>
          <div class="footer">
            Bokengi Group · Solutions Technologiques, Systèmes & Services Professionnels · bokengi-group.com
          </div>
        </div>
      </body>
    </html>
  `

  // Version texte brut / Plain-text fallback pour le client
  const clientText = [
    `Bonjour ${lead.firstname},`,
    ``,
    `Nous vous confirmons la bonne réception de votre demande concernant ${poleLabel} (${typeLabel}).`,
    ``,
    `Notre équipe d'ingénieurs et de consultants étudie actuellement vos éléments. Nous reviendrons vers vous avec des propositions concrètes et un cadrage adapté dans un délai de 24 à 48 heures ouvrées.`,
    ``,
    `Rappel de votre message :`,
    `"${lead.message.slice(0, 350)}${lead.message.length > 350 ? '...' : ''}"`,
    ``,
    `Pour toute précision complémentaire d'ici notre retour, vous pouvez nous écrire directement en réponse à ce message.`,
    ``,
    `Cordialement,`,
    `La Direction des Projets`,
    `Bokengi Group · Construire. Protéger. Développer.`,
    `https://bokengi-group.com`,
  ].join('\n')

  try {
    // Envoi 1 : Notification interne à l'équipe Bokengi
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [teamEmail],
        reply_to: lead.email,
        subject: teamSubject,
        html: teamHtml,
        text: teamText,
      }),
    })

    // Envoi 2 : Accusé de réception client
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [lead.email],
        subject: `Votre demande a bien été reçue — Bokengi Group`,
        html: clientHtml,
        text: clientText,
      }),
    })

    console.info(
      `[Notifications CRM] Emails envoyés avec succès pour le lead #${lead.id || 'new'} (${lead.email})`
    )
    return { success: true }
  } catch (err) {
    console.error('[Notifications CRM] Échec partiel de transmission Resend :', err)
    return { success: false, details: String(err) }
  }
}

export const notifyNewLeadReceived = sendLeadNotifications

export default sendLeadNotifications
