import { describe, it, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert'
import {
  normalizePoleId,
  getWebhookUrlForPole,
  getPoleDisplayName,
  buildMattermostMessage,
  sendMattermostNotification,
  type MattermostEventPayload,
} from '../../src/lib/mattermost'

describe('BOKENGI 2.0 — Routage Mattermost par Pôle & Suite d\'Isolation Stricte', () => {
  const mockWebhooks = {
    MATTERMOST_WEBHOOK_POLE_IT: 'https://mattermost.bokengi-group.com/hooks/mock-it-key',
    MATTERMOST_WEBHOOK_POLE_DIGITAL: 'https://mattermost.bokengi-group.com/hooks/mock-digital-key',
    MATTERMOST_WEBHOOK_POLE_BUSINESS: 'https://mattermost.bokengi-group.com/hooks/mock-business-key',
    MATTERMOST_WEBHOOK_POLE_CONSULTING: 'https://mattermost.bokengi-group.com/hooks/mock-consulting-key',
    MATTERMOST_WEBHOOK_POLE_EVENTS: 'https://mattermost.bokengi-group.com/hooks/mock-events-key',
  }

  let originalFetch: typeof globalThis.fetch
  let interceptedCalls: Array<{ url: string; body: any }> = []

  beforeEach(() => {
    // Configuration des variables d'environnement de test
    process.env.MATTERMOST_WEBHOOK_POLE_IT = mockWebhooks.MATTERMOST_WEBHOOK_POLE_IT
    process.env.MATTERMOST_WEBHOOK_POLE_DIGITAL = mockWebhooks.MATTERMOST_WEBHOOK_POLE_DIGITAL
    process.env.MATTERMOST_WEBHOOK_POLE_BUSINESS = mockWebhooks.MATTERMOST_WEBHOOK_POLE_BUSINESS
    process.env.MATTERMOST_WEBHOOK_POLE_CONSULTING = mockWebhooks.MATTERMOST_WEBHOOK_POLE_CONSULTING
    process.env.MATTERMOST_WEBHOOK_POLE_EVENTS = mockWebhooks.MATTERMOST_WEBHOOK_POLE_EVENTS

    // Interception des requêtes HTTP fetch
    interceptedCalls = []
    originalFetch = globalThis.fetch
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const body = init?.body ? JSON.parse(String(init.body)) : null
      interceptedCalls.push({ url, body })
      return new Response(JSON.stringify({ status: 'ok' }), { status: 200 })
    }) as any
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
    delete process.env.MATTERMOST_WEBHOOK_POLE_IT
    delete process.env.MATTERMOST_WEBHOOK_POLE_DIGITAL
    delete process.env.MATTERMOST_WEBHOOK_POLE_BUSINESS
    delete process.env.MATTERMOST_WEBHOOK_POLE_CONSULTING
    delete process.env.MATTERMOST_WEBHOOK_POLE_EVENTS
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 1. UNIT TEST : NORMALISATION DE DES SLUGS / IDS DE PÔLE
  // ──────────────────────────────────────────────────────────────────────────
  it('TEST-1: normalizePoleId correctly converts all variations to canonical POL-*', () => {
    assert.strictEqual(normalizePoleId('it'), 'POL-it')
    assert.strictEqual(normalizePoleId('bokengi-it'), 'POL-it')
    assert.strictEqual(normalizePoleId('POL-it'), 'POL-it')
    assert.strictEqual(normalizePoleId('POL-IT'), 'POL-it')

    assert.strictEqual(normalizePoleId('digital'), 'POL-digital')
    assert.strictEqual(normalizePoleId('bokengi-digital'), 'POL-digital')
    assert.strictEqual(normalizePoleId('POL-digital'), 'POL-digital')

    assert.strictEqual(normalizePoleId('business'), 'POL-business')
    assert.strictEqual(normalizePoleId('bokengi-business'), 'POL-business')
    assert.strictEqual(normalizePoleId('POL-business'), 'POL-business')

    assert.strictEqual(normalizePoleId('consulting'), 'POL-consulting')
    assert.strictEqual(normalizePoleId('bokengi-consulting'), 'POL-consulting')
    assert.strictEqual(normalizePoleId('POL-consulting'), 'POL-consulting')

    assert.strictEqual(normalizePoleId('events'), 'POL-events')
    assert.strictEqual(normalizePoleId('bokengi-events'), 'POL-events')
    assert.strictEqual(normalizePoleId('POL-events'), 'POL-events')

    assert.strictEqual(normalizePoleId('unknown-pole'), null)
    assert.strictEqual(normalizePoleId(''), null)
    assert.strictEqual(normalizePoleId(null), null)
    assert.strictEqual(normalizePoleId(undefined), null)
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 2. ROUTAGE STRICT DES 5 PÔLES (POL-it, POL-digital, POL-business, POL-consulting, POL-events)
  // ──────────────────────────────────────────────────────────────────────────
  it('TEST-2: POL-it routes exclusively to #pole-it webhook', async () => {
    const res = await sendMattermostNotification({
      eventType: 'NEW_LEAD',
      documentId: 'LEAD-IT-101',
      title: 'Projet d infrastructure Cloud',
      clientName: 'Jean IT',
      poleName: 'POL-it',
    })

    assert.strictEqual(res.success, true)
    assert.strictEqual(res.routed, true)
    assert.strictEqual(interceptedCalls.length, 1)
    assert.strictEqual(interceptedCalls[0].url, mockWebhooks.MATTERMOST_WEBHOOK_POLE_IT)
    assert(interceptedCalls[0].body.text.includes('BOKENGI IT'))
  })

  it('TEST-3: POL-digital routes exclusively to #pole-digital webhook', async () => {
    const res = await sendMattermostNotification({
      eventType: 'NEW_LEAD',
      documentId: 'LEAD-DIGITAL-102',
      title: 'Création d une plateforme web e-commerce',
      clientName: 'Sophie Digital',
      poleName: 'POL-digital',
    })

    assert.strictEqual(res.success, true)
    assert.strictEqual(res.routed, true)
    assert.strictEqual(interceptedCalls.length, 1)
    assert.strictEqual(interceptedCalls[0].url, mockWebhooks.MATTERMOST_WEBHOOK_POLE_DIGITAL)
    assert(interceptedCalls[0].body.text.includes('BOKENGI DIGITAL'))
  })

  it('TEST-4: POL-business routes exclusively to #pole-business webhook', async () => {
    const res = await sendMattermostNotification({
      eventType: 'NEW_LEAD',
      documentId: 'LEAD-BIZ-103',
      title: 'Cadrage de modèle d affaires',
      clientName: 'Marc Business',
      poleName: 'POL-business',
    })

    assert.strictEqual(res.success, true)
    assert.strictEqual(res.routed, true)
    assert.strictEqual(interceptedCalls.length, 1)
    assert.strictEqual(interceptedCalls[0].url, mockWebhooks.MATTERMOST_WEBHOOK_POLE_BUSINESS)
    assert(interceptedCalls[0].body.text.includes('BOKENGI BUSINESS'))
  })

  it('TEST-5: POL-consulting routes exclusively to #pole-consulting webhook', async () => {
    const res = await sendMattermostNotification({
      eventType: 'NEW_LEAD',
      documentId: 'LEAD-CONS-104',
      title: 'Accompagnement transformation digitale',
      clientName: 'Claire Consulting',
      poleName: 'POL-consulting',
    })

    assert.strictEqual(res.success, true)
    assert.strictEqual(res.routed, true)
    assert.strictEqual(interceptedCalls.length, 1)
    assert.strictEqual(interceptedCalls[0].url, mockWebhooks.MATTERMOST_WEBHOOK_POLE_CONSULTING)
    assert(interceptedCalls[0].body.text.includes('BOKENGI CONSULTING'))
  })

  it('TEST-6: POL-events routes exclusively to #pole-events webhook', async () => {
    const res = await sendMattermostNotification({
      eventType: 'NEW_LEAD',
      documentId: 'LEAD-EVT-105',
      title: 'Organisation de séminaire corporate',
      clientName: 'Lucie Events',
      poleName: 'POL-events',
    })

    assert.strictEqual(res.success, true)
    assert.strictEqual(res.routed, true)
    assert.strictEqual(interceptedCalls.length, 1)
    assert.strictEqual(interceptedCalls[0].url, mockWebhooks.MATTERMOST_WEBHOOK_POLE_EVENTS)
    assert(interceptedCalls[0].body.text.includes('BOKENGI EVENTS'))
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 3. RÈGLE ABSOLUE D'ISOLATION INTER-PÔLES
  // ──────────────────────────────────────────────────────────────────────────
  it('TEST-7: POL-digital event NEVER sends calls to IT, Business, Consulting, or Events webhooks', async () => {
    await sendMattermostNotification({
      eventType: 'NEW_LEAD',
      documentId: 'LEAD-ISOLATION-999',
      title: 'Projet Digital Isolé',
      poleName: 'digital',
    })

    assert.strictEqual(interceptedCalls.length, 1, 'Exactly 1 webhook call must occur')
    const targetUrl = interceptedCalls[0].url

    assert.strictEqual(targetUrl, mockWebhooks.MATTERMOST_WEBHOOK_POLE_DIGITAL, 'Must call Digital webhook')

    assert.notStrictEqual(targetUrl, mockWebhooks.MATTERMOST_WEBHOOK_POLE_IT, 'Must NOT call IT webhook')
    assert.notStrictEqual(targetUrl, mockWebhooks.MATTERMOST_WEBHOOK_POLE_BUSINESS, 'Must NOT call Business webhook')
    assert.notStrictEqual(targetUrl, mockWebhooks.MATTERMOST_WEBHOOK_POLE_CONSULTING, 'Must NOT call Consulting webhook')
    assert.notStrictEqual(targetUrl, mockWebhooks.MATTERMOST_WEBHOOK_POLE_EVENTS, 'Must NOT call Events webhook')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 4. PÔLE INCONNU OU ABSENT (AUCUN FALLBACK TRANSVERSE)
  // ──────────────────────────────────────────────────────────────────────────
  it('TEST-8: Unknown, empty or unmapped pole makes ZERO webhook calls (no transverse fallback)', async () => {
    const unknownRes = await sendMattermostNotification({
      eventType: 'NEW_LEAD',
      documentId: 'LEAD-UNK-000',
      title: 'Pôle Inconnu Test',
      poleName: 'pole-inconnu-inexistant',
    })

    assert.strictEqual(unknownRes.success, true, 'Must handle unknown pole gracefully')
    assert.strictEqual(unknownRes.routed, false, 'Must NOT be routed')
    assert.strictEqual(interceptedCalls.length, 0, 'ZERO webhook calls must be made for unknown pole')

    const nullRes = await sendMattermostNotification({
      eventType: 'NEW_LEAD',
      documentId: 'LEAD-NULL-000',
      title: 'Pôle Null Test',
      poleName: null,
    })

    assert.strictEqual(nullRes.success, true)
    assert.strictEqual(nullRes.routed, false)
    assert.strictEqual(interceptedCalls.length, 0, 'ZERO webhook calls must be made for null pole')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 5. CHANGEMENT DE PÔLE (POL-digital -> POL-business)
  // ──────────────────────────────────────────────────────────────────────────
  it('TEST-9: Updating project from POL-digital to POL-business routes strictly to #pole-business', async () => {
    // Événement 1 : Création sous POL-digital
    await sendMattermostNotification({
      eventType: 'NEW_PROJECT',
      documentId: 'PROJ-REASSIGN-100',
      title: 'Plateforme Web & Conseil',
      poleName: 'POL-digital',
      status: 'Nouveau',
    })

    assert.strictEqual(interceptedCalls.length, 1)
    assert.strictEqual(interceptedCalls[0].url, mockWebhooks.MATTERMOST_WEBHOOK_POLE_DIGITAL)

    // Événement 2 : Réaffectation au pôle POL-business
    await sendMattermostNotification({
      eventType: 'PROJECT_UPDATED',
      documentId: 'PROJ-REASSIGN-100',
      title: 'Plateforme Web & Conseil',
      poleName: 'POL-business',
      status: 'En cours',
      summary: 'Reclassification au pôle Business',
    })

    assert.strictEqual(interceptedCalls.length, 2)
    assert.strictEqual(interceptedCalls[1].url, mockWebhooks.MATTERMOST_WEBHOOK_POLE_BUSINESS, 'Updated event must route to NEW pole webhook')
    assert(interceptedCalls[1].body.text.includes('BOKENGI BUSINESS'), 'Message must display new pole name')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 6. IDEMPOTENCE ET PRÉVENTION DES DOUBLE NOTIFICATIONS (1 ÉVÉNEMENT = 1 NOTIF)
  // ──────────────────────────────────────────────────────────────────────────
  it('TEST-10: Idempotent replay of the exact same event produces 1 webhook call, not 2', async () => {
    const payload: MattermostEventPayload = {
      eventType: 'NEW_LEAD',
      documentId: 'LEAD-DUPLICATE-CHECK-777',
      title: 'Prospect Soumission Unique',
      clientName: 'Alice Doublon',
      poleName: 'POL-it',
    }

    // Premier envoi
    const firstRes = await sendMattermostNotification(payload)
    assert.strictEqual(firstRes.success, true)
    assert.strictEqual(firstRes.routed, true)
    assert.strictEqual(interceptedCalls.length, 1, 'First call must trigger webhook')

    // Second envoi (doublon rejoué)
    const secondRes = await sendMattermostNotification(payload)
    assert.strictEqual(secondRes.success, true)
    assert.strictEqual(secondRes.duplicate, true, 'Second call must hit idempotency cache')
    assert.strictEqual(interceptedCalls.length, 1, 'Second call MUST NOT trigger duplicate webhook')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 7. FORMATAGE DES 4 ÉVÉNEMENTS MÉTIERS SUPPORTÉS
  // ──────────────────────────────────────────────────────────────────────────
  it('TEST-11: Formats NEW_LEAD, NEW_PROJECT, PROJECT_UPDATED, ACTION_REQUIRED concisely', () => {
    const newLeadMsg = buildMattermostMessage({
      eventType: 'NEW_LEAD',
      documentId: 'LEAD-001',
      title: 'Demande de devis site web',
      clientName: 'Jean Dupont',
      companyName: 'XYZ',
      email: 'jean@xyz.com',
      poleName: 'POL-digital',
      needType: 'Demande de devis',
      status: 'Nouveau',
    })

    assert(newLeadMsg.text.includes('BOKENGI DIGITAL'))
    assert(newLeadMsg.text.includes('Jean Dupont'))

    const newProjMsg = buildMattermostMessage({
      eventType: 'NEW_PROJECT',
      documentId: 'PROJ-001',
      title: 'Refonte du site web',
      clientName: 'XYZ',
      poleName: 'POL-digital',
      status: 'Nouveau',
    })

    assert(newProjMsg.text.includes('### 🚀 NOUVEAU PROJET'))
    assert(newProjMsg.text.includes('Refonte du site web'))

    const updatedMsg = buildMattermostMessage({
      eventType: 'PROJECT_UPDATED',
      documentId: 'PROJ-001',
      title: 'Refonte du site web',
      poleName: 'POL-digital',
      status: 'En cours',
    })

    assert(updatedMsg.text.includes('### 🔄 PROJET MIS À JOUR'))
    assert(updatedMsg.text.includes('En cours'))

    const actionMsg = buildMattermostMessage({
      eventType: 'ACTION_REQUIRED',
      documentId: 'PROJ-001',
      title: 'Refonte du site web',
      poleName: 'POL-digital',
      actionRequired: 'Échéance dépassée',
    })

    assert(actionMsg.text.includes('### ⚠️ ACTION REQUISE'))
    assert(actionMsg.text.includes('Échéance dépassée'))
  })
})
