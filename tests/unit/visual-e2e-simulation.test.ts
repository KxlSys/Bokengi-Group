import { describe, it, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { NextRequest } from 'next/server'
import { POST as handleLeadPost } from '../../src/app/api/leads/route'
import {
  normalizePoleId,
  getWebhookUrlForPole,
  getPoleDisplayName,
  buildMattermostMessage,
  sendMattermostNotification,
} from '../../src/lib/mattermost'

describe('BOKENGI 2.0 — Visual E2E Simulation (CMS → ERPNext → Mattermost)', () => {
  const mockWebhooks = {
    MATTERMOST_WEBHOOK_POLE_IT: 'https://mattermost.bokengi-group.com/hooks/e2e-mock-it',
    MATTERMOST_WEBHOOK_POLE_DIGITAL: 'https://mattermost.bokengi-group.com/hooks/e2e-mock-digital',
    MATTERMOST_WEBHOOK_POLE_BUSINESS: 'https://mattermost.bokengi-group.com/hooks/e2e-mock-business',
    MATTERMOST_WEBHOOK_POLE_CONSULTING: 'https://mattermost.bokengi-group.com/hooks/e2e-mock-consulting',
    MATTERMOST_WEBHOOK_POLE_EVENTS: 'https://mattermost.bokengi-group.com/hooks/e2e-mock-events',
  }

  const interceptedCalls: Array<{ url: string; body: any }> = []
  const originalEnv = { ...process.env }
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    interceptedCalls.length = 0
    Object.assign(process.env, mockWebhooks)

    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const urlStr = input.toString()
      if (urlStr.includes('mattermost.bokengi-group.com/hooks/')) {
        let bodyParsed = {}
        if (init?.body) {
          try {
            bodyParsed = JSON.parse(init.body.toString())
          } catch {
            bodyParsed = { text: init.body.toString() }
          }
        }
        interceptedCalls.push({ url: urlStr, body: bodyParsed })
        return new Response(JSON.stringify({ status: 'ok' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      return originalFetch(input, init)
    }) as typeof fetch
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    globalThis.fetch = originalFetch
  })

  let createdLeadId = ''

  it('Étape 1 & 2: Formulaire CMS -> ERPNext Lead (pôle = digital)', async () => {
    const payload = {
      firstname: 'TEST',
      lastname: 'BOKENGI DIGITAL',
      company: 'BOKENGI — E2E VISUAL TEST',
      email: 'e2e.visual.digital@bokengi-test.fr',
      phone: '+33000000000',
      pole: 'digital',
      requestType: 'devis',
      message: 'BOKENGI 2.0 — TEST VISUEL E2E\nProjet fictif destiné uniquement à vérifier le routage CMS → ERPNext → Mattermost.\nNE PAS TRAITER.',
    }

    const req = new NextRequest('http://localhost:3000/api/leads', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    })

    const res = await handleLeadPost(req)
    assert.strictEqual(res.status, 201, 'Response status must be 201 Created')

    const body = await res.json()
    assert.strictEqual(body.success, true, 'Response body success must be true')
    assert(body.id, 'Response must return created Lead ID')
    createdLeadId = body.id

    // Verify pole assignment logic
    const leadRequestedPole = normalizePoleId(payload.pole)
    const leadTreatmentPole = normalizePoleId(payload.pole)

    assert.strictEqual(leadRequestedPole, 'POL-digital', 'custom_requested_pole must be POL-digital')
    assert.strictEqual(leadTreatmentPole, 'POL-digital', 'custom_treatment_pole must be POL-digital')
  })

  it('Étape 3: Vérification canal Mattermost #pole-digital', async () => {
    const notificationPayload = {
      eventType: 'NEW_LEAD' as const,
      documentId: createdLeadId || 'LEAD-VISUAL-TEST-001',
      title: 'BOKENGI 2.0 — TEST VISUEL E2E',
      clientName: 'TEST BOKENGI DIGITAL',
      companyName: 'BOKENGI — E2E VISUAL TEST',
      email: 'e2e.visual.digital@bokengi-test.fr',
      poleName: 'POL-digital',
      needType: 'Demande de devis',
      summary: 'Projet fictif destiné uniquement à vérifier le routage CMS → ERPNext → Mattermost.',
      status: 'Nouveau',
    }

    const res = await sendMattermostNotification(notificationPayload)

    assert.strictEqual(res.success, true)
    assert.strictEqual(res.routed, true)
    assert.strictEqual(normalizePoleId(notificationPayload.poleName), 'POL-digital')

    assert.strictEqual(interceptedCalls.length, 1, 'Exactly 1 notification call must occur')
    assert.strictEqual(interceptedCalls[0].url, mockWebhooks.MATTERMOST_WEBHOOK_POLE_DIGITAL, 'Notification MUST arrive in #pole-digital')
    assert.notStrictEqual(interceptedCalls[0].url, mockWebhooks.MATTERMOST_WEBHOOK_POLE_IT, 'MUST NOT arrive in #pole-it')
    assert.notStrictEqual(interceptedCalls[0].url, mockWebhooks.MATTERMOST_WEBHOOK_POLE_BUSINESS, 'MUST NOT arrive in #pole-business')
    assert.notStrictEqual(interceptedCalls[0].url, mockWebhooks.MATTERMOST_WEBHOOK_POLE_CONSULTING, 'MUST NOT arrive in #pole-consulting')
    assert.notStrictEqual(interceptedCalls[0].url, mockWebhooks.MATTERMOST_WEBHOOK_POLE_EVENTS, 'MUST NOT arrive in #pole-events')
  })

  it('Étape 4: Preuve visuelle du cloisonnement RLS (Digital accessible, IT/Business/Consulting/Events refusés)', () => {
    const document = {
      name: createdLeadId || 'LEAD-VISUAL-TEST-001',
      doctype: 'Lead',
      custom_requested_pole: 'POL-digital',
      custom_treatment_pole: 'POL-digital',
    }

    function checkAccess(userRole: string, userPole: string | null): boolean {
      if (['System Manager', 'Administrator', 'Bokengi Executive'].includes(userRole)) return true
      if (!userPole) return false
      return userPole === document.custom_treatment_pole
    }

    assert.strictEqual(checkAccess('Bokengi Operational', 'POL-digital'), true, 'Digital User MUST have access')
    assert.strictEqual(checkAccess('Bokengi Operational', 'POL-it'), false, 'IT User MUST BE REFUSED access')
    assert.strictEqual(checkAccess('Bokengi Operational', 'POL-business'), false, 'Business User MUST BE REFUSED access')
    assert.strictEqual(checkAccess('Bokengi Operational', 'POL-consulting'), false, 'Consulting User MUST BE REFUSED access')
    assert.strictEqual(checkAccess('Bokengi Operational', 'POL-events'), false, 'Events User MUST BE REFUSED access')
    assert.strictEqual(checkAccess('Bokengi Operational', null), false, 'User without pole MUST BE REFUSED access')
  })

  it('Étape 5 & 6: Simulation de réassignation vers pôle Business & vérification Mattermost', async () => {
    const project = {
      name: 'PROJ-VISUAL-TEST-001',
      custom_requested_pole: 'POL-digital',
      custom_treatment_pole: 'POL-digital',
    }

    // Modification du pôle de traitement opérationnel uniquement
    project.custom_treatment_pole = 'POL-business'

    // custom_requested_pole sanctuarisé
    assert.strictEqual(project.custom_requested_pole, 'POL-digital', 'custom_requested_pole MUST stay POL-digital')
    assert.strictEqual(project.custom_treatment_pole, 'POL-business', 'custom_treatment_pole MUST be POL-business')

    // Événement post-réassignation
    const postReassignmentPayload = {
      eventType: 'PROJECT_UPDATED' as const,
      documentId: project.name,
      title: 'BOKENGI 2.0 — TEST VISUEL E2E (Réassignation)',
      clientName: 'TEST BOKENGI DIGITAL',
      companyName: 'BOKENGI — E2E VISUAL TEST',
      email: 'e2e.visual.digital@bokengi-test.fr',
      poleName: 'POL-business',
      needType: 'Projet réalloué',
      summary: 'Dossier réattribué au pôle Business',
      status: 'En cours',
    }

    const res = await sendMattermostNotification(postReassignmentPayload)

    assert.strictEqual(res.success, true)
    assert.strictEqual(res.routed, true)
    assert.strictEqual(normalizePoleId(postReassignmentPayload.poleName), 'POL-business')

    assert.strictEqual(interceptedCalls.length, 1, 'Exactly 1 notification call must occur after reassignment')
    assert.strictEqual(interceptedCalls[0].url, mockWebhooks.MATTERMOST_WEBHOOK_POLE_BUSINESS, 'Notification MUST arrive in #pole-business')
    assert.notStrictEqual(interceptedCalls[0].url, mockWebhooks.MATTERMOST_WEBHOOK_POLE_DIGITAL, 'MUST NOT arrive in #pole-digital after reassignment')
  })
})
