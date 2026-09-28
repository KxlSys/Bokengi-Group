import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  buildMattermostMessage,
  sendMattermostNotification,
  type MattermostEventPayload,
} from '../../src/lib/mattermost'

describe('Mattermost Integration & Data Minimization Suite', () => {
  // ──────────────────────────────────────────────────────────────────────────
  // 1. VÉRIFICATION DES 8 ÉVÉNEMENTS STANDARDISÉS
  // ──────────────────────────────────────────────────────────────────────────
  it('MM-1: Formats all 8 business events with appropriate kickers, emojis and titles', () => {
    const events: Array<{ type: MattermostEventPayload['eventType']; expectedKicker: string }> = [
      { type: 'NEW_LEAD', expectedKicker: 'CRM LEADS' },
      { type: 'QUALIFIED_LEAD', expectedKicker: 'CRM QUALIFICATION' },
      { type: 'CALCOM_BOOKING', expectedKicker: 'AGENDA & CADRAGE' },
      { type: 'QUOTATION_DRAFT', expectedKicker: 'AFFAIRES & DEVIS' },
      { type: 'QUOTATION_SUBMITTED', expectedKicker: 'AFFAIRES & DEVIS' },
      { type: 'SALES_ORDER_SUBMITTED', expectedKicker: 'COMMANDES CLIENT' },
      { type: 'SALES_INVOICE_SUBMITTED', expectedKicker: 'FINANCE & FACTURATION' },
      { type: 'MANUAL_INTERVENTION_REQUIRED', expectedKicker: 'OPS & ALERTES' },
    ]

    for (const evt of events) {
      const msg = buildMattermostMessage({
        eventType: evt.type,
        title: `Test ${evt.type}`,
        clientName: 'Acme Corp Contact',
        documentId: 'DOC-12345',
      })

      assert(msg.text.includes(`[${evt.expectedKicker}]`), `Expected kicker [${evt.expectedKicker}] in event ${evt.type}`)
      assert(msg.text.includes('DOC-12345'), `Expected doc ID in event ${evt.type}`)
      assert(msg.text.includes('Acme Corp Contact'), `Expected client name in event ${evt.type}`)
      assert(msg.text.includes('https://erp.bokengi-group.com/app'), `Expected deep link in event ${evt.type}`)
    }
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 2. RÈGLE STRICTE DE MINIMISATION DES DONNÉES (ZÉRO FUITE BANCAIRE / SECRETS)
  // ──────────────────────────────────────────────────────────────────────────
  it('MM-2: Data Minimization filter strips forbidden keys and masks sensitive patterns', () => {
    const msg = buildMattermostMessage({
      eventType: 'SALES_INVOICE_SUBMITTED',
      title: 'Facture soumise FAC-2026-0001',
      clientName: 'Entreprise Partenaire',
      amount: 15000,
      currency: 'EUR',
      extraDetails: {
        'Description Mission': 'Audit de sécurité SI',
        'iban_compte': 'FR7630004000011234567890145', // Interdit
        'bic_swift': 'BNPAFRPPXXX', // Interdit
        'api_token': 'secret-token-123456', // Interdit
        'password': 'SuperSecretPassword', // Interdit
        'Date d\'échéance': '30 Octobre 2026', // Autorisé
      },
    })

    // Vérification que les clés interdites ont été supprimées
    assert(!msg.text.includes('iban_compte'), 'IBAN key must NOT be present in payload')
    assert(!msg.text.includes('bic_swift'), 'BIC key must NOT be present in payload')
    assert(!msg.text.includes('api_token'), 'API token key must NOT be present in payload')
    assert(!msg.text.includes('password'), 'Password key must NOT be present in payload')
    assert(!msg.text.includes('SuperSecretPassword'), 'Secret password must NOT be leaked')

    // Vérification que les détails légitimes sont présents
    assert(msg.text.includes('Audit de sécurité SI'), 'Allowed details must be retained')
    assert(msg.text.includes('30 Octobre 2026'), 'Due date must be retained')
    assert(msg.text.includes('15000 EUR'), 'Global amount must be displayed')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 3. RÉSILIENCE ET NON-BLOCAGE LORSQUE MATTERMOST EST HORS-LIGNE
  // ──────────────────────────────────────────────────────────────────────────
  it('MM-3: sendMattermostNotification succeeds silently when no webhook is configured', async () => {
    const originalEnv = process.env.MATTERMOST_WEBHOOK_URL
    delete process.env.MATTERMOST_WEBHOOK_URL
    delete process.env.MATTERMOST_WEBHOOK_LEADS

    const res = await sendMattermostNotification({
      eventType: 'NEW_LEAD',
      title: 'Prospect test hors-ligne',
    })

    assert.strictEqual(res.success, true, 'Should succeed gracefully without throwing')

    if (originalEnv) {
      process.env.MATTERMOST_WEBHOOK_URL = originalEnv
    }
  })
})
