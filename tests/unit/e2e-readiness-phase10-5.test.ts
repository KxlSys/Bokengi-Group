import { describe, it } from 'node:test'
import assert from 'node:assert'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import {
  verifyCalcomSignature,
  processCalcomWebhook,
} from '../../src/lib/calcom'
import {
  buildMattermostMessage,
  sendMattermostNotification,
  type MattermostEventPayload,
} from '../../src/lib/mattermost'

describe('BOKENGI 2.0 — Phase 10.5 E2E Readiness & Security Test Suite', () => {
  const TEST_SECRET = 'bokengi_staging_e2e_secret_key_2026'

  // ──────────────────────────────────────────────────────────────────────────
  // 1. CONTRÔLE D'ABSENCE D'ENDPOINT D'ÉMISSION AUTOMATIQUE DE FACTURE
  // ──────────────────────────────────────────────────────────────────────────
  it('E2E-SEC-1: Verify no public API route allows automated Sales Invoice submission', () => {
    const apiDir = path.resolve(process.cwd(), 'src/app/api')
    assert(fs.existsSync(apiDir), 'src/app/api must exist')

    function scanRoutes(dir: string): string[] {
      let results: string[] = []
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          results = results.concat(scanRoutes(fullPath))
        } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
          results.push(fullPath)
        }
      }
      return results
    }

    const routeFiles = scanRoutes(apiDir)
    
    // Vérifier le contenu de chaque route
    for (const routeFile of routeFiles) {
      const content = fs.readFileSync(routeFile, 'utf-8')
      const lower = content.toLowerCase()
      // Interdiction de soumettre automatiquement des Sales Invoices ou de bypasser Desk
      assert(
        !lower.includes('sales invoice') || !lower.includes('docstatus: 1') || lower.includes('// forbidden'),
        `Forbidden automatic Sales Invoice submission detected in route: ${routeFile}`
      )
      assert(
        !lower.includes('submit_invoice') && !lower.includes('auto_invoice'),
        `Automated invoicing handler detected in route: ${routeFile}`
      )
    }
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 2. CONTRÔLE DE SÉCURITÉ RGPD & MINIMISATION MATTERMOST
  // ──────────────────────────────────────────────────────────────────────────
  it('E2E-SEC-2: Strict Data Minimization - Never leak IBAN/BIC, tokens, passwords or sensitive data to Mattermost', () => {
    const payloadWithSensitiveData: MattermostEventPayload = {
      eventType: 'SALES_INVOICE_SUBMITTED',
      documentId: 'ACC-SINV-2026-00001',
      title: 'Facture soumise manuellement',
      clientName: 'Client Alpha',
      amount: 1500,
      currency: 'EUR',
      extraDetails: {
        iban: 'FR7630006000011234567890189',
        bic: 'BNPAFRPPXXX',
        password: 'SuperSecretPassword123!',
        api_token: 'tok_live_998877665544332211',
        rib: '30006 00001 12345678901 89',
        auth_bearer: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        legitimateField: 'Paiement comptant',
      },
      summary: 'Virement vers IBAN FR7630006000011234567890189 pour règlement facture.',
    }

    const msg = buildMattermostMessage(payloadWithSensitiveData)
    
    // Vérifier que les clés interdites ont été supprimées
    assert(!msg.text.includes('FR7630006000011234567890189'), 'IBAN must not appear in raw format')
    assert(!msg.text.includes('BNPAFRPPXXX'), 'BIC must not appear')
    assert(!msg.text.includes('SuperSecretPassword123!'), 'Password must never leak')
    assert(!msg.text.includes('tok_live_998877665544332211'), 'API token must never leak')
    assert(!msg.text.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'), 'Bearer token must never leak')
    assert(msg.text.includes('Paiement comptant'), 'Legitimate metadata must be preserved')
    assert(msg.text.includes('ACC-SINV-2026-00001'), 'ERPNext reference must be included')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 3. CONTRÔLE DES DEEP-LINKS MATTERMOST → ERPNEXT DESK
  // ──────────────────────────────────────────────────────────────────────────
  it('E2E-LINK-1: Verify deep-link generation to ERPNext Desk', () => {
    const payload: MattermostEventPayload = {
      eventType: 'QUOTATION_DRAFT',
      documentId: 'QTN-2026-00042',
      title: 'Devis Cadrage IT',
      deskUrl: 'https://erp.bokengi-group.com/app/quotation/QTN-2026-00042',
    }

    const msg = buildMattermostMessage(payload)
    assert(
      msg.text.includes('[Accéder au dossier dans ERPNext Desk →](https://erp.bokengi-group.com/app/quotation/QTN-2026-00042)'),
      'Direct deep link to ERPNext Desk must be present'
    )
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 4. CONTRÔLE D'IDEMPOTENCE ET RÉSILIENCE CAL.COM
  // ──────────────────────────────────────────────────────────────────────────
  it('E2E-CAL-1: Verify webhook HMAC validation and idempotent replay handling', async () => {
    process.env.CALCOM_WEBHOOK_SECRET = TEST_SECRET

    const bookingUid = `e2e-cal-uid-${Date.now()}`
    const rawPayload = JSON.stringify({
      triggerEvent: 'BOOKING_CREATED',
      payload: {
        uid: bookingUid,
        title: 'Session de cadrage architecture',
        startTime: '2026-11-01T10:00:00.000Z',
        attendees: [{ name: 'Directeur Technique', email: 'cto@enterprise.fr' }],
        responses: { notes: { value: 'Refonte Cloud & Observabilité' } },
      },
    })

    const signature = crypto.createHmac('sha256', TEST_SECRET).update(rawPayload).digest('hex')

    // 1. Signature invalide rejetée
    const invalidRes = await processCalcomWebhook(rawPayload, 'invalid_signature_hex')
    assert.strictEqual(invalidRes.statusCode, 401, 'Invalid signature must return 401')

    // 2. Signature valide traitée avec succès
    const firstRes = await processCalcomWebhook(rawPayload, signature)
    assert.strictEqual(firstRes.statusCode, 200, 'First valid webhook must return 200')
    assert.strictEqual(firstRes.isDuplicate, false, 'First call is not duplicate')

    // 3. Rejeu du webhook (Idempotence)
    const replayRes = await processCalcomWebhook(rawPayload, signature)
    assert.strictEqual(replayRes.statusCode, 200, 'Replayed webhook must return 200 OK')
    assert.strictEqual(replayRes.isDuplicate, true, 'Replayed webhook must be identified as duplicate')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 5. GESTION DES SCÉNARIOS D'ERREUR (MATTERMOST & ERPNEXT INDISPONIBLE)
  // ──────────────────────────────────────────────────────────────────────────
  it('E2E-ERR-1: Resilience when Mattermost is unreachable or unconfigured', async () => {
    // Si aucun webhook URL n'est configuré, l'appel doit réussir sans lancer d'exception
    const result = await sendMattermostNotification({
      eventType: 'NEW_LEAD',
      documentId: 'LEAD-TEST-001',
      title: 'Test Prospect',
    })
    assert.strictEqual(result.success, true, 'Unconfigured webhook must fail silently without breaking core flow')
  })

  it('E2E-ERR-2: Incomplete ERPNext event formatting is gracefully handled', () => {
    // Événement avec données minimales / champs manquants
    const minimalPayload: MattermostEventPayload = {
      eventType: 'MANUAL_INTERVENTION_REQUIRED',
      title: 'Alerte technique non spécifiée',
    }

    const msg = buildMattermostMessage(minimalPayload)
    assert(msg.text.includes('Intervention Manuelle Requise'), 'Header must render correctly')
    assert(msg.text.includes('Alerte technique non spécifiée'), 'Title must render correctly')
    assert(msg.text.includes('ERPNext Desk'), 'Desk link fallback must be present')
  })
})
