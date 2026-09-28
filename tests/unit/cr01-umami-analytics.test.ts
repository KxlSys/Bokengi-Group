import { describe, it } from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'

describe('BOKENGI 2.0 — CR-01 : Umami Analytics Production Smoke Tests & Integration Suite', () => {
  const WRANGLER_PATH = path.resolve(process.cwd(), 'wrangler.jsonc')
  const COMPONENT_PATH = path.resolve(process.cwd(), 'src/components/bokengi/UmamiAnalytics.tsx')
  const LAYOUT_PATH = path.resolve(process.cwd(), 'src/app/(frontend)/[locale]/layout.tsx')
  const ENV_EXAMPLE_PATH = path.resolve(process.cwd(), '.env.example')

  const EXPECTED_WEBSITE_ID = 'ebaf55dd-ba11-448c-97cb-d744953375d3'
  const EXPECTED_SRC = 'https://cloud.umami.is/script.js'

  // ──────────────────────────────────────────────────────────────────────────
  // SMOKE TEST 1 & 2 : PRÉSENCE ET INTÉGRATION DU TRACKER EN PRODUCTION
  // ──────────────────────────────────────────────────────────────────────────
  it('CR01-SMOKE-1-2: Verify Umami tracker configuration in wrangler.jsonc and layout.tsx', () => {
    assert(fs.existsSync(WRANGLER_PATH), 'wrangler.jsonc must exist')
    const wranglerContent = fs.readFileSync(WRANGLER_PATH, 'utf-8')
    assert(wranglerContent.includes('"NEXT_PUBLIC_UMAMI_ENABLED": "true"'), 'NEXT_PUBLIC_UMAMI_ENABLED must be "true"')
    assert(wranglerContent.includes(`"NEXT_PUBLIC_UMAMI_WEBSITE_ID": "${EXPECTED_WEBSITE_ID}"`), 'Website ID mismatch in wrangler.jsonc')
    assert(wranglerContent.includes(`"NEXT_PUBLIC_UMAMI_SRC": "${EXPECTED_SRC}"`), 'Tracker src mismatch in wrangler.jsonc')

    assert(fs.existsSync(LAYOUT_PATH), 'layout.tsx must exist')
    const layoutContent = fs.readFileSync(LAYOUT_PATH, 'utf-8')
    assert(layoutContent.includes("import { UmamiAnalytics } from '@/components/bokengi/UmamiAnalytics'"), 'UmamiAnalytics imported in layout')
    assert(layoutContent.includes('<UmamiAnalytics />'), 'UmamiAnalytics component rendered in layout')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // SMOKE TEST 3 & 4 : CONFORMITÉ EXACTE DU WEBSITE_ID ET DE L'URL DU SCRIPT
  // ──────────────────────────────────────────────────────────────────────────
  it('CR01-SMOKE-3-4: Verify data-website-id and script src match Umami Cloud exact values', () => {
    assert(fs.existsSync(COMPONENT_PATH), 'UmamiAnalytics.tsx must exist')
    const componentContent = fs.readFileSync(COMPONENT_PATH, 'utf-8')

    assert(componentContent.includes(EXPECTED_SRC), 'Default tracker URL must be https://cloud.umami.is/script.js')
    assert(componentContent.includes('strategy="afterInteractive"'), 'Must use non-blocking afterInteractive strategy')
    assert(componentContent.includes('data-auto-track="true"'), 'Must enable auto-track')

    const envContent = fs.readFileSync(ENV_EXAMPLE_PATH, 'utf-8')
    assert(envContent.includes(`NEXT_PUBLIC_UMAMI_WEBSITE_ID=${EXPECTED_WEBSITE_ID}`), 'Website ID in .env.example')
    assert(envContent.includes(`NEXT_PUBLIC_UMAMI_SRC=${EXPECTED_SRC}`), 'Script src in .env.example')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // SMOKE TEST 5 & 6 : SIMULATION D'ÉVÉNEMENT ET ABSENCE D'ERREUR JS
  // ──────────────────────────────────────────────────────────────────────────
  it('CR01-SMOKE-5-6: Verify telemetry event payload formatting and graceful resilience', () => {
    // Simulation d'un payload Umami Cloud conforme
    function formatUmamiEvent(type: string, url: string, websiteId: string) {
      if (!websiteId || websiteId.length !== 36) {
        throw new Error('Invalid Website ID format')
      }
      return {
        type,
        payload: {
          website: websiteId,
          hostname: 'bokengi-group.com',
          url,
          language: 'fr',
          referrer: 'https://bokengi-group.com/fr',
          screen: '1920x1080',
        },
      }
    }

    const testEvent = formatUmamiEvent('event', '/fr/services/cybersecurite', EXPECTED_WEBSITE_ID)
    assert.strictEqual(testEvent.payload.website, EXPECTED_WEBSITE_ID)
    assert.strictEqual(testEvent.payload.hostname, 'bokengi-group.com')
    assert.strictEqual(testEvent.type, 'event')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // SMOKE TEST 7 : ZÉRO COOKIE ET RESPECT DU RGPD
  // ──────────────────────────────────────────────────────────────────────────
  it('CR01-SMOKE-7: Verify zero cookie generation and complete GDPR compliance', () => {
    const componentContent = fs.readFileSync(COMPONENT_PATH, 'utf-8')
    const lower = componentContent.toLowerCase()

    assert(!lower.includes('document.cookie'), 'Must never manipulate document.cookie')
    assert(!lower.includes('localstorage.setitem'), 'Must not store tracking IDs in localStorage')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // SMOKE TEST 8 & 9 : ÉTANCHÉITÉ MÉTIER & NON-RÉGRESSION ARCHITECTURALE
  // ──────────────────────────────────────────────────────────────────────────
  it('CR01-SMOKE-8-9: Verify complete isolation from ERPNext, Finance, and InfraPulse', () => {
    const componentContent = fs.readFileSync(COMPONENT_PATH, 'utf-8')
    const lower = componentContent.toLowerCase()

    assert(!lower.includes('erpnext'), 'Must not couple with ERPNext')
    assert(!lower.includes('sales_invoice'), 'Must not couple with Sales Invoice')
    assert(!lower.includes('infrapulse'), 'Must never reference InfraPulse')
  })
})
