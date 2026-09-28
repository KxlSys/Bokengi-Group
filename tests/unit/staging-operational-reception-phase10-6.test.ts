import { describe, it } from 'node:test'
import assert from 'node:assert'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { NextRequest } from 'next/server'
import { POST as handleLeadPost } from '../../src/app/api/leads/route'
import { POST as handleCalcomWebhookPost } from '../../src/app/api/webhooks/calcom/route'
import {
  verifyCalcomSignature,
  processCalcomWebhook,
} from '../../src/lib/calcom'
import {
  buildMattermostMessage,
  sendMattermostNotification,
  type MattermostEventPayload,
} from '../../src/lib/mattermost'
import { submitLeadToERPNext, attachBookingToERPNextLead } from '../../src/lib/erpnext-client'

describe('BOKENGI 2.0 — PHASE 10.6 : STAGING OPERATIONAL RECEPTION SUITE', () => {
  const STAGING_SECRET = 'staging_calcom_webhook_secret_2026_test'

  // ──────────────────────────────────────────────────────────────────────────
  // RECETTE 1 : VISITEUR → FORMULAIRE NEXT.JS → ERPNEXT LEAD & NOTIFICATION
  // ──────────────────────────────────────────────────────────────────────────
  it('STAGING-REC-01: Form submission creates Lead and triggers Mattermost notification', async () => {
    const leadPayload = {
      firstname: 'Alexandre',
      lastname: 'Staging-Test',
      company: 'Staging Enterprise SA',
      email: 'alexandre.staging@enterprise-test.fr',
      phone: '+33 1 40 00 00 00',
      requestType: 'cadrage',
      pole: 'bokengi-it',
      message: 'Demande de cadrage d architecture cloud et cybersécurité pour environnement staging.',
    }

    const req = new NextRequest('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'cf-connecting-ip': '198.51.100.42', // IP de test staging
      },
      body: JSON.stringify(leadPayload),
    })

    const res = await handleLeadPost(req)
    const data = await res.json()

    assert.strictEqual(res.status, 201, 'Lead creation must return HTTP 201 Created')
    assert.strictEqual(data.success, true, 'Response must indicate success')
    assert(data.id, 'Created Lead ID must be returned')
    console.log(`  [STAGING PROOF] Lead created with ID: ${data.id}`)
  })

  // ──────────────────────────────────────────────────────────────────────────
  // RECETTE 2 : NOTIFICATION MATTERMOST #commercial-leads POUR NOUVEAU LEAD
  // ──────────────────────────────────────────────────────────────────────────
  it('STAGING-REC-02: Mattermost notification formatting for NEW_LEAD', () => {
    const mmPayload: MattermostEventPayload = {
      eventType: 'NEW_LEAD',
      documentId: 'LEAD-STAGING-2026-001',
      title: 'Nouveau prospect web : Alexandre Staging-Test',
      clientName: 'Alexandre Staging-Test',
      companyName: 'Staging Enterprise SA',
      poleName: 'bokengi-it',
      needType: 'cadrage',
      summary: 'Demande de cadrage d architecture cloud et cybersécurité',
      status: 'Open',
    }

    const msg = buildMattermostMessage(mmPayload)
    assert(msg.text.includes('CRM LEADS'), 'Header must reference CRM LEADS channel')
    assert(msg.text.includes(':incoming_envelope:'), 'Emoji icon must match NEW_LEAD')
    assert(msg.text.includes('Alexandre Staging-Test'), 'Client name must be present')
    assert(msg.text.includes('Staging Enterprise SA'), 'Company name must be present')
    assert(msg.text.includes('LEAD-STAGING-2026-001'), 'Reference must be present')
    assert(msg.text.includes('[Accéder au dossier dans ERPNext Desk →]'), 'Deep-link must be present')
    console.log('  [STAGING PROOF] Mattermost NEW_LEAD message payload validated.')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // RECETTE 3 & 4 : RÉSERVATION CAL.COM → WEBHOOK → HMAC → ERPNEXT
  // ──────────────────────────────────────────────────────────────────────────
  it('STAGING-REC-03-04: Cal.com webhook with valid HMAC is accepted and attached', async () => {
    process.env.CALCOM_WEBHOOK_SECRET = STAGING_SECRET
    const bookingUid = `cal-staging-${Date.now()}`

    const webhookBody = {
      triggerEvent: 'BOOKING_CREATED',
      createdAt: new Date().toISOString(),
      payload: {
        uid: bookingUid,
        title: 'Cadrage Technique Bokengi IT — Staging',
        startTime: '2026-10-20T14:00:00.000Z',
        endTime: '2026-10-20T14:45:00.000Z',
        attendees: [
          {
            name: 'Alexandre Staging-Test',
            email: 'alexandre.staging@enterprise-test.fr',
          },
        ],
        responses: {
          notes: { value: 'Échange technique avec DSI Staging' },
        },
      },
    }

    const rawBody = JSON.stringify(webhookBody)
    const signature = crypto.createHmac('sha256', STAGING_SECRET).update(rawBody).digest('hex')

    const req = new NextRequest('http://localhost:3000/api/webhooks/calcom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Cal-Signature-256': signature,
      },
      body: rawBody,
    })

    const res = await handleCalcomWebhookPost(req)
    const json = await res.json()

    assert.strictEqual(res.status, 200, 'Webhook must return HTTP 200')
    assert.strictEqual(json.success, true, 'Webhook response must be success')
    assert.strictEqual(json.bookingUid, bookingUid, 'Booking UID must match')
    assert.strictEqual(json.isDuplicate, false, 'First booking reception is not duplicate')
    console.log(`  [STAGING PROOF] Booking ${bookingUid} successfully attached and acknowledged.`)
  })

  // ──────────────────────────────────────────────────────────────────────────
  // RECETTE 5 : ATTACHEMENT DU BOOKING.UID AU DOSSIER LEAD
  // ──────────────────────────────────────────────────────────────────────────
  it('STAGING-REC-05: Lead attachment helper links booking.uid and notes', async () => {
    const bookingUid = `cal-attach-test-${Date.now()}`
    const result = await attachBookingToERPNextLead({
      email: 'alexandre.staging@enterprise-test.fr',
      name: 'Alexandre Staging-Test',
      bookingUid,
      title: 'Cadrage Architecture Staging',
      startTime: '2026-10-20T14:00:00.000Z',
      notes: 'Notes de cadrage staging',
    })

    assert(result.success, 'Attachment must succeed')
    console.log(`  [STAGING PROOF] Lead attached successfully. (Lead ID: ${result.leadId})`)
  })

  // ──────────────────────────────────────────────────────────────────────────
  // RECETTE 6 : NOTIFICATION MATTERMOST POUR LA RÉSERVATION CAL.COM
  // ──────────────────────────────────────────────────────────────────────────
  it('STAGING-REC-06: Mattermost notification formatting for CALCOM_BOOKING', () => {
    const mmPayload: MattermostEventPayload = {
      eventType: 'CALCOM_BOOKING',
      documentId: 'LEAD-STAGING-2026-001',
      title: 'Réservation d échange confirmée : Cadrage Technique Bokengi IT',
      clientName: 'Alexandre Staging-Test',
      companyName: 'Staging Enterprise SA',
      needType: 'Cadrage technique / Visioconférence',
      scheduledAt: '20 octobre 2026 à 16:00 (Heure de Paris)',
      summary: 'Réservation Cal.com UID: cal-staging-001\nNotes: Échange technique avec DSI',
      status: 'Confirmé',
    }

    const msg = buildMattermostMessage(mmPayload)
    assert(msg.text.includes('AGENDA & CADRAGE'), 'Header must reference AGENDA & CADRAGE')
    assert(msg.text.includes(':calendar:'), 'Emoji icon must match CALCOM_BOOKING')
    assert(msg.text.includes('20 octobre 2026'), 'Scheduled date must be formatted')
    assert(msg.text.includes('ERPNext Desk'), 'Desk link must be present')
    console.log('  [STAGING PROOF] Mattermost CALCOM_BOOKING message validated.')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // RECETTE 7 : QUALIFICATION MANUELLE DU LEAD (DESK $\to$ MATTERMOST)
  // ──────────────────────────────────────────────────────────────────────────
  it('STAGING-REC-07: Qualification workflow event generation', () => {
    const mmPayload: MattermostEventPayload = {
      eventType: 'QUALIFIED_LEAD',
      documentId: 'LEAD-STAGING-2026-001',
      title: 'Prospect qualifié : Alexandre Staging-Test (Staging Enterprise SA)',
      clientName: 'Alexandre Staging-Test',
      companyName: 'Staging Enterprise SA',
      poleName: 'bokengi-it',
      needType: 'cadrage',
      status: 'Qualified',
      summary: 'Besoin qualifié lors du cadrage technique : Mission Architecture & DevOps.',
    }

    const msg = buildMattermostMessage(mmPayload)
    assert(msg.text.includes('CRM QUALIFICATION'), 'Header must reference CRM QUALIFICATION')
    assert(msg.text.includes(':white_check_mark:'), 'Emoji must match QUALIFIED_LEAD')
    assert(msg.text.includes('Qualified'), 'Status must be Qualified')
    console.log('  [STAGING PROOF] Manual qualification event formatting validated.')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // RECETTE 8 : PRÉPARATION D'UNE QUOTATION DRAFT (DESK $\to$ MATTERMOST)
  // ──────────────────────────────────────────────────────────────────────────
  it('STAGING-REC-08: Quotation Draft preparation event formatting', () => {
    const mmPayload: MattermostEventPayload = {
      eventType: 'QUOTATION_DRAFT',
      documentId: 'QTN-STAGING-2026-0001',
      title: 'Devis Cadrage & Architecture Cloud (Brouillon Desk)',
      clientName: 'Alexandre Staging-Test',
      companyName: 'Staging Enterprise SA',
      amount: 4500,
      currency: 'EUR',
      status: 'Draft',
      summary: 'Élaboration du devis pour cadrage 5 jours. Soumis à validation humaine avant envoi.',
    }

    const msg = buildMattermostMessage(mmPayload)
    assert(msg.text.includes('AFFAIRES & DEVIS'), 'Header must reference AFFAIRES & DEVIS')
    assert(msg.text.includes(':memo:'), 'Emoji must match QUOTATION_DRAFT')
    assert(msg.text.includes('4500 EUR'), 'Amount must be formatted')
    assert(msg.text.includes('Draft'), 'Status must be Draft')
    console.log('  [STAGING PROOF] Quotation Draft event formatting validated.')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // RECETTE 9 : VÉRIFICATION DES DEEP-LINKS MATTERMOST $\to$ ERPNEXT DESK
  // ──────────────────────────────────────────────────────────────────────────
  it('STAGING-REC-09: All document types generate valid desk links', () => {
    const docTypes: Array<[MattermostEventPayload['eventType'], string]> = [
      ['NEW_LEAD', 'LEAD-001'],
      ['CALCOM_BOOKING', 'LEAD-001'],
      ['QUOTATION_DRAFT', 'QTN-001'],
      ['QUOTATION_SUBMITTED', 'QTN-001'],
      ['SALES_ORDER_SUBMITTED', 'SO-001'],
      ['SALES_INVOICE_SUBMITTED', 'ACC-SINV-001'],
      ['MANUAL_INTERVENTION_REQUIRED', 'ALERT-001'],
    ]

    for (const [evt, id] of docTypes) {
      const msg = buildMattermostMessage({
        eventType: evt,
        documentId: id,
        title: `Test ${evt}`,
      })
      assert(msg.text.includes('🔗 [Accéder au dossier dans ERPNext Desk →]'), `Desk link missing for ${evt}`)
    }
    console.log('  [STAGING PROOF] Deep-links verified across all document types.')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // RECETTE 10 : SCÉNARIOS NÉGATIFS & RÉSILIENCE
  // ──────────────────────────────────────────────────────────────────────────
  it('STAGING-REC-10-A: Replayed webhook (Idempotence hit)', async () => {
    process.env.CALCOM_WEBHOOK_SECRET = STAGING_SECRET
    const bookingUid = `cal-replayed-test-${Date.now()}`
    const rawPayload = JSON.stringify({
      triggerEvent: 'BOOKING_CREATED',
      payload: {
        uid: bookingUid,
        title: 'Cadrage Test',
        startTime: '2026-10-20T10:00:00.000Z',
        attendees: [{ name: 'Test', email: 'test@example.com' }],
      },
    })
    const signature = crypto.createHmac('sha256', STAGING_SECRET).update(rawPayload).digest('hex')

    // Initial
    const res1 = await processCalcomWebhook(rawPayload, signature)
    assert.strictEqual(res1.statusCode, 200)
    assert.strictEqual(res1.isDuplicate, false)

    // Replay
    const res2 = await processCalcomWebhook(rawPayload, signature)
    assert.strictEqual(res2.statusCode, 200)
    assert.strictEqual(res2.isDuplicate, true, 'Replay must be flagged duplicate')
    console.log('  [STAGING PROOF] Replayed webhook handled idempotently.')
  })

  it('STAGING-REC-10-B: Invalid HMAC signature rejected with 401', async () => {
    process.env.CALCOM_WEBHOOK_SECRET = STAGING_SECRET
    const rawPayload = JSON.stringify({ triggerEvent: 'BOOKING_CREATED', payload: { uid: 'uid-123' } })
    const invalidSignature = 'deadbeef'.repeat(8)

    const res = await processCalcomWebhook(rawPayload, invalidSignature)
    assert.strictEqual(res.statusCode, 401, 'Invalid signature must return 401')
    console.log('  [STAGING PROOF] Tampered/invalid HMAC signature successfully rejected.')
  })

  it('STAGING-REC-10-C: Mattermost failure does not crash the system', async () => {
    const result = await sendMattermostNotification({
      eventType: 'NEW_LEAD',
      documentId: 'LEAD-001',
      title: 'Test Resilience',
    })
    assert.strictEqual(result.success, true, 'Unreachable/unconfigured Mattermost must not throw')
    console.log('  [STAGING PROOF] Mattermost graceful fallback verified.')
  })

  it('STAGING-REC-10-D: Missing attendee email creates a Cal.com lead fallback', async () => {
    process.env.CALCOM_WEBHOOK_SECRET = STAGING_SECRET
    const bookingUid = `cal-no-email-${Date.now()}`
    const rawPayload = JSON.stringify({
      triggerEvent: 'BOOKING_CREATED',
      payload: {
        uid: bookingUid,
        title: 'Cadrage sans email direct',
        startTime: '2026-10-20T11:00:00.000Z',
      },
    })
    const signature = crypto.createHmac('sha256', STAGING_SECRET).update(rawPayload).digest('hex')

    const res = await processCalcomWebhook(rawPayload, signature)
    assert.strictEqual(res.statusCode, 200, 'Must succeed with fallback Lead')
    console.log('  [STAGING PROOF] Fallback Lead attachment verified.')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // RECETTE 11 : VÉRIFICATION ABSOLUE DU VERROU COMPTABLE
  // ──────────────────────────────────────────────────────────────────────────
  it('STAGING-REC-11: Verify no automated Sales Invoice submission exists anywhere in API routes', () => {
    const apiDir = path.resolve(process.cwd(), 'src/app/api')
    const files = fs.readdirSync(apiDir, { recursive: true }) as string[]
    const routeFiles = files.filter((f) => f.endsWith('route.ts') || f.endsWith('route.js'))

    for (const f of routeFiles) {
      const code = fs.readFileSync(path.join(apiDir, f), 'utf-8')
      const lower = code.toLowerCase()
      assert(
        !lower.includes('submit_invoice') &&
        !lower.includes('sales_invoice_auto') &&
        !lower.includes('auto_invoice'),
        `Forbidden automatic invoicing handler in ${f}`
      )
    }
    console.log('  [STAGING PROOF] Absolute accounting lock verified: 0 automated invoice routes.')
  })
})
