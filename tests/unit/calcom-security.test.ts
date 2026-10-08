import { describe, it, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { verifyCalcomSignature } from '../../src/lib/calcom'

describe('Cal.com Webhook Security & Edge Context Verification', () => {
  const originalEnvSecret = process.env.CALCOM_WEBHOOK_SECRET
  const cfSymbol = Symbol.for('__cloudflare-context__')

  beforeEach(() => {
    delete process.env.CALCOM_WEBHOOK_SECRET
    delete (globalThis as any)[cfSymbol]
  })

  afterEach(() => {
    if (originalEnvSecret) {
      process.env.CALCOM_WEBHOOK_SECRET = originalEnvSecret
    } else {
      delete process.env.CALCOM_WEBHOOK_SECRET
    }
    delete (globalThis as any)[cfSymbol]
  })

  it('allows request when no secret is configured anywhere (Dev mode fallback)', () => {
    const result = verifyCalcomSignature('{"test": true}', null)
    assert.strictEqual(result.isValid, true)
    assert.match(result.reason || '', /No webhook secret configured/)
  })

  it('verifies signature correctly using process.env secret', () => {
    const secret = 'super-secret-key-123'
    process.env.CALCOM_WEBHOOK_SECRET = secret

    const body = JSON.stringify({ triggerEvent: 'BOOKING_CREATED', payload: { uid: 'booking-123' } })
    const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('hex')

    const validResult = verifyCalcomSignature(body, expectedSig)
    assert.strictEqual(validResult.isValid, true)
    assert.strictEqual(validResult.reason, undefined)

    const invalidResult = verifyCalcomSignature(body, 'invalid-signature-hex')
    assert.strictEqual(invalidResult.isValid, false)
    assert.match(invalidResult.reason || '', /Signature length mismatch|Signature hash mismatch/)
  })

  it('verifies signature correctly using Cloudflare Workers global context secret', () => {
    const secret = 'cf-edge-secret-key-999'
    ;(globalThis as any)[cfSymbol] = {
      env: {
        CALCOM_WEBHOOK_SECRET: secret,
      },
    }

    const body = JSON.stringify({ triggerEvent: 'BOOKING_CREATED', payload: { uid: 'booking-456' } })
    const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('hex')

    const result = verifyCalcomSignature(body, expectedSig)
    assert.strictEqual(result.isValid, true)
    assert.strictEqual(result.reason, undefined)
  })

  it('rejects payload when signature header is missing but secret is configured', () => {
    process.env.CALCOM_WEBHOOK_SECRET = 'secret-present'
    const result = verifyCalcomSignature('{"data": 1}', null)
    assert.strictEqual(result.isValid, false)
    assert.strictEqual(result.reason, 'Missing X-Cal-Signature-256 header')
  })
})
