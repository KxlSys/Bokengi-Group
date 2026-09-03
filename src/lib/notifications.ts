/**
 * MODULE DE NOTIFICATIONS EMAIL BOKENGI GROUP 2.0 (RESEND)
 *
 * Principes de sécurité et résilience :
 * - Aucune clé API hardcodée (uniquement lue depuis process.env.RESEND_API_KEY).
 * - Domaine officiel d'envoi : contact@bokengi-group.com.
 * - Ne bloque JAMAIS l'enregistrement du lead en cas d'absence de clé ou d'erreur réseau.
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

/**
 * Envoie la notification à l'équipe interne et l'accusé de réception au prospect.
 */
export async function sendLeadNotifications(lead: LeadNotificationData): Promise<{ success: boolean; details?: string }> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.info(
      `[Notifications CRM] Clé RESEND_API_KEY non configurée. Lead #${lead.id || 'new'} (${lead.email}) enregistré en base sans envoi d'e-mail.`
    )
    return { success: true, details: 'Mode hors-ligne / Clé Resend non fournie' }
  }

  const teamEmail = process.env.CONTACT_EMAIL || 'contact@bokengi-group.com'
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Bokengi Group <contact@bokengi-group.com>'
  const fullName = `${lead.firstname} ${lead.lastname}`.trim()
  const companyLabel = lead.company ? ` (${lead.company})` : ''
  const poleLabel = lead.poleName || 'Général / Non spécifié'

  const requestTypeLabels: Record<string, string> = {
    devis: 'Demande de devis',
    cadrage: 'Cadrage technique',
    partenariat: 'Partenariat institutionnel',
    autre: 'Autre sollicitation',
  }
  const typeLabel = requestTypeLabels[lead.requestType] || lead.requestType

  // 1. Template Email Équipe Interne Bokengi
  const teamHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0F172A; background-color: #F8FAFC; margin: 0; padding: 20px; }
          .card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; max-width: 600px; margin: 0 auto; padding: 30px; }
          .header { border-bottom: 2px solid #0033A0; padding-bottom: 15px; margin-bottom: 20px; }
          .title { font-size: 20px; font-weight: bold; color: #00124D; margin: 0; }
          .badge { display: inline-block; background: #0033A0; color: #FFFFFF; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; margin-top: 5px; }
          .field { margin-bottom: 12px; }
          .label { font-size: 12px; text-transform: uppercase; color: #64748B; font-weight: bold; }
          .value { font-size: 15px; color: #0F172A; }
          .message-box { background: #F1F5F9; border-left: 4px solid #16B8F3; padding: 15px; border-radius: 4px; font-size: 14px; white-space: pre-wrap; margin-top: 15px; }
          .footer { font-size: 11px; color: #94A3B8; margin-top: 25px; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h2 class="title">Nouveau Prospect Enregistré — Bokengi CRM</h2>
            <div class="badge">${escapeHtml(typeLabel)}</div>
          </div>
          <div class="field">
            <div class="label">Pôle d'expertise concerné</div>
            <div class="value"><strong>${escapeHtml(poleLabel)}</strong></div>
          </div>
          <div class="field">
            <div class="label">Identité du contact</div>
            <div class="value">${escapeHtml(fullName)}${escapeHtml(companyLabel)}</div>
          </div>
          <div class="field">
            <div class="label">Coordonnées</div>
            <div class="value">
              Email : <a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a><br>
              Téléphone : ${escapeHtml(lead.phone || 'Non renseigné')}
            </div>
          </div>
          <div class="field">
            <div class="label">Description du projet / besoin</div>
            <div class="message-box">${escapeHtml(lead.message)}</div>
          </div>
          <div class="footer">
            Lead collecté via le portail officiel Bokengi Group (bokengi-group.com).
          </div>
        </div>
      </body>
    </html>
  `

  // 2. Template Email Accusé de réception Prospect
  const clientHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0F172A; background-color: #F8FAFC; margin: 0; padding: 20px; }
          .card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; max-width: 600px; margin: 0 auto; padding: 30px; }
          .header { border-bottom: 2px solid #0033A0; padding-bottom: 15px; margin-bottom: 20px; }
          .title { font-size: 20px; font-weight: bold; color: #00124D; margin: 0; }
          .highlight { color: #0055D4; font-weight: 600; }
          .recap-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 15px; margin: 20px 0; font-size: 13px; }
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
            <em>${escapeHtml(lead.message.slice(0, 300))}${lead.message.length > 300 ? '...' : ''}</em>
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

  try {
    // Envoi 1 : Notification interne
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
        subject: `[Bokengi CRM] ${typeLabel} — ${lead.firstname} ${lead.lastname} (${poleLabel})`,
        html: teamHtml,
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
      }),
    })

    console.info(`[Notifications CRM] Emails envoyés avec succès pour le lead #${lead.id || 'new'}`)
    return { success: true }
  } catch (err) {
    console.error('[Notifications CRM] Échec partiel de transmission Resend :', err)
    return { success: false, details: String(err) }
  }
}
