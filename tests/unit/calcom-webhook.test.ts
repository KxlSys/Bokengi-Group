import { describe, it } from 'node:test'
import assert from 'node:assert'
import crypto from 'node:crypto'
import {
  verifyCalcomSignature,
  processCalcomWebhook,
} from '../../src/lib/calcom'

describe('Cal.com Webhook Integration & Security Suite', () => {
  const TEST_SECRET = 'test_webhook_secret_bokengi_2026'

  // ──────────────────────────────────────────────────────────────────────────
  // 1. VÉRIFICATION DE LA SIGNATURE CRYPTOGRAPHIQUE HMAC SHA-256
  // ──────────────────────────────────────────────────────────────────────────
  it('CAL-1: Accepts valid HMAC SHA-256 signature', () => {
    const rawBody = JSON.stringify({ triggerEvent: 'BOOKING_CREATED', payload: { uid: 'cal-uid-1001' } })
    const validSignature = crypto.createHmac('sha256', TEST_SECRET).update(rawBody).digest('hex')

    const check = verifyCalcomSignature(rawBody, validSignature, TEST_SECRET)
    assert.strictEqual(check.isValid, true, 'Valid signature must be accepted')
  })

  it('CAL-2: Rejects invalid HMAC signature or tampered body', () => {
    const rawBody = JSON.stringify({ triggerEvent: 'BOOKING_CREATED', payload: { uid: 'cal-uid-1001' } })
    const invalidSignature = 'a'.repeat(64)

    const check = verifyCalcomSignature(rawBody, invalidSignature, TEST_SECRET)
    assert.strictEqual(check.isValid, false, 'Invalid signature must be rejected')
  })

  it('CAL-3: Rejects missing signature when secret is configured', () => {
    const rawBody = JSON.stringify({ triggerEvent: 'BOOKING_CREATED', payload: { uid: 'cal-uid-1001' } })

    const check = verifyCalcomSignature(rawBody, null, TEST_SECRET)
    assert.strictEqual(check.isValid, false, 'Missing signature must be rejected when secret is set')
  })

  it('CAL-3b: Respects Cloudflare env bindings for signature verification', () => {
    const rawBody = JSON.stringify({ triggerEvent: 'BOOKING_CREATED', payload: { uid: 'cal-uid-1001' } })
    const cfSecret = 'cf_worker_env_secret_key_12345'
    const validSignature = crypto.createHmac('sha256', cfSecret).update(rawBody).digest('hex')

    // Test passing env object
    const checkWithEnv = verifyCalcomSignature(rawBody, validSignature, undefined, {
      CALCOM_WEBHOOK_SECRET: cfSecret,
    })
    assert.strictEqual(checkWithEnv.isValid, true, 'Valid signature with Cloudflare env must be accepted')

    // Test tampered signature with Cloudflare env
    const checkWithEnvTampered = verifyCalcomSignature(rawBody, 'deadbeef', undefined, {
      CALCOM_WEBHOOK_SECRET: cfSecret,
    })
    assert.strictEqual(checkWithEnvTampered.isValid, false, 'Tampered signature with Cloudflare env must be rejected')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 2. CONTRÔLE D'IDEMPOTENCE ET ANTI-DOUBLON (booking.uid)
  // ──────────────────────────────────────────────────────────────────────────
  it('CAL-4: Processes valid booking payload and handles duplicate idempotently', async () => {
    const uniqueBookingUid = `bk-uid-test-${Date.now()}`
    const payload = {
      triggerEvent: 'BOOKING_CREATED',
      payload: {
        uid: uniqueBookingUid,
        title: 'Cadrage Technique Bokengi IT',
        startTime: '2026-10-15T14:00:00.000Z',
        attendees: [
          {
            name: 'Jean Testeur',
            email: 'jean.testeur@acme.com',
          },
        ],
        responses: {
          notes: { value: 'Besoin audit cybersécurité' },
        },
      },
    }

    const rawBody = JSON.stringify(payload)
    const validSignature = crypto.createHmac('sha256', TEST_SECRET).update(rawBody).digest('hex')

    // Premier appel (succès initial)
    const res1 = await processCalcomWebhook(rawBody, validSignature)
    assert.strictEqual(res1.statusCode, 200)
    assert.strictEqual(res1.success, true)
    assert.strictEqual(res1.bookingUid, uniqueBookingUid)
    assert.strictEqual(res1.isDuplicate, false)

    // Deuxième appel avec le même booking.uid (doit être reconnu comme doublon idempotent)
    const res2 = await processCalcomWebhook(rawBody, validSignature)
    assert.strictEqual(res2.statusCode, 200)
    assert.strictEqual(res2.success, true)
    assert.strictEqual(res2.isDuplicate, true, 'Second call must be flagged as duplicate')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 3. GESTION DES ERREURS ET ENTRÉES INVALIDES
  // ──────────────────────────────────────────────────────────────────────────
  it('CAL-5: Rejects malformed JSON payload with HTTP 400', async () => {
    const malformedBody = '{ triggerEvent: invalid json...'
    const res = await processCalcomWebhook(malformedBody, null)
    assert.strictEqual(res.statusCode, 400)
    assert.strictEqual(res.success, false)
  })

  it('CAL-6: Rejects payload missing booking UID with HTTP 400', async () => {
    const emptyPayload = JSON.stringify({ triggerEvent: 'BOOKING_CREATED', payload: {} })
    const res = await processCalcomWebhook(emptyPayload, null)
    assert.strictEqual(res.statusCode, 400)
    assert.strictEqual(res.success, false)
  })

  it('CAL-7: Fails closed when secret is missing in production environment', () => {
    const originalEnv = process.env.NODE_ENV
    const originalSecret = process.env.CALCOM_WEBHOOK_SECRET
    try {
      ;(process.env as Record<string, string | undefined>).NODE_ENV = 'production'
      delete process.env.CALCOM_WEBHOOK_SECRET

      const rawBody = JSON.stringify({ triggerEvent: 'BOOKING_CREATED', payload: { uid: 'cal-uid-1001' } })
      const check = verifyCalcomSignature(rawBody, 'some_sig', '')
      assert.strictEqual(check.isValid, false, 'Missing secret in production must fail closed')
      assert.match(check.reason || '', /not configured in production/i)
    } finally {
      ;(process.env as Record<string, string | undefined>).NODE_ENV = originalEnv
      if (originalSecret !== undefined) {
        process.env.CALCOM_WEBHOOK_SECRET = originalSecret
      } else {
        delete process.env.CALCOM_WEBHOOK_SECRET
      }
    }
  })
})
