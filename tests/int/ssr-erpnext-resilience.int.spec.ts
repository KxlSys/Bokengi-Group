import { describe, it, beforeEach, afterEach } from 'vitest'
import assert from 'node:assert'
import { getPoles, getServices, getCaseStudies, getPosts } from '../../src/lib/data'
import { POLES_SEED_DATA, SERVICES_SEED_DATA, CASE_STUDIES_SEED_DATA, POSTS_SEED_DATA } from '../../src/data/bokengi-seed-data'

describe('SSR ERPNext Resilience & Seed Fallback Test Suite', () => {
  const originalFetch = globalThis.fetch
  const originalEnv = { ...process.env }

  beforeEach(() => {
    delete process.env.ERPNEXT_API_KEY
    delete process.env.ERPNEXT_API_SECRET
    delete process.env.ERPNEXT_API_URL
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
    process.env = { ...originalEnv }
  })

  it('SSR-1: Unconfigured ERPNext falls back instantly to local Seed data', async () => {
    const poles = await getPoles('fr')
    assert.strictEqual(poles.length, POLES_SEED_DATA.length)
    assert.strictEqual(poles[0].slug, POLES_SEED_DATA[0].slug)

    const services = await getServices('it', 'fr')
    assert.ok(services.length > 0)

    const cases = await getCaseStudies(false, 'fr')
    assert.strictEqual(cases.length, CASE_STUDIES_SEED_DATA.length)

    const posts = await getPosts(undefined, 'fr')
    assert.strictEqual(posts.length, POSTS_SEED_DATA.length)
  })

  it('SSR-2: ERPNext returning HTTP 403 Forbidden falls back to Seed data without crashing', async () => {
    process.env.ERPNEXT_API_KEY = 'mock_key'
    process.env.ERPNEXT_API_SECRET = 'mock_secret'

    globalThis.fetch = async () => {
      return new Response(JSON.stringify({ exc_type: 'PermissionError' }), {
        status: 403,
        statusText: 'Forbidden',
      })
    }

    const poles = await getPoles('fr')
    assert.strictEqual(poles.length, POLES_SEED_DATA.length)
    assert.strictEqual(poles[0].name, POLES_SEED_DATA[0].name)
  })

  it('SSR-3: ERPNext returning HTTP 401 Unauthorized falls back to Seed data', async () => {
    process.env.ERPNEXT_API_KEY = 'invalid_key'
    process.env.ERPNEXT_API_SECRET = 'invalid_secret'

    globalThis.fetch = async () => {
      return new Response(JSON.stringify({ exc_type: 'AuthenticationError' }), {
        status: 401,
        statusText: 'Unauthorized',
      })
    }

    const poles = await getPoles('fr')
    assert.strictEqual(poles.length, POLES_SEED_DATA.length)
  })

  it('SSR-4: ERPNext network timeout or abort falls back gracefully to Seed data', async () => {
    process.env.ERPNEXT_API_KEY = 'mock_key'
    process.env.ERPNEXT_API_SECRET = 'mock_secret'

    globalThis.fetch = async (_url: any, options: any) => {
      return new Promise((_, reject) => {
        if (options?.signal) {
          options.signal.addEventListener('abort', () => {
            const err = new Error('The operation was aborted')
            err.name = 'AbortError'
            reject(err)
          })
        }
      })
    }

    const polesPromise = getPoles('fr')
    const poles = await polesPromise
    assert.strictEqual(poles.length, POLES_SEED_DATA.length)
  })

  it('SSR-5: ERPNext available and configured returns live ERPNext data', async () => {
    process.env.ERPNEXT_API_KEY = 'valid_key'
    process.env.ERPNEXT_API_SECRET = 'valid_secret'

    const mockPole = {
      name: 'POL-01',
      pole_name_fr: 'Pôle IT Mocked',
      pole_name_en: 'IT Pole Mocked',
      slug: 'it',
      order_num: 1,
      icon: 'server',
      short_description_fr: 'Description courte',
      description_fr: 'Description longue',
      status: 'published',
      domains_fr: 'Infra, Cloud',
      seo_title_fr: 'Pôle IT',
      seo_description_fr: 'SEO Desc',
    }

    globalThis.fetch = async () => {
      return new Response(JSON.stringify({ data: [mockPole] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const poles = await getPoles('fr')
    assert.strictEqual(poles.length, 1)
    assert.strictEqual(poles[0].name, 'Pôle IT Mocked')
    assert.strictEqual(poles[0].slug, 'it')
  })
})
