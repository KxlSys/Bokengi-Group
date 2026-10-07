import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  fetchServicesFromERPNext,
  fetchServiceBySlugFromERPNext,
  fetchCaseStudyBySlugFromERPNext,
  fetchPostBySlugFromERPNext,
  attachBookingToERPNextLead,
} from '../../src/lib/erpnext-client'

describe('ERPNext REST API Filter Sanitization & Injection Prevention Suite', () => {
  const mockEnv = {
    ERPNEXT_API_URL: 'https://gestion.bokengi-group.com',
    ERPNEXT_API_KEY: 'test-key',
    ERPNEXT_API_SECRET: 'test-secret',
  }

  it('fetchServicesFromERPNext safely stringifies and encodes filter parameters containing special characters', async () => {
    let capturedUrl = ''
    const originalFetch = globalThis.fetch
    process.env.ERPNEXT_API_KEY = 'test-key'
    process.env.ERPNEXT_API_SECRET = 'test-secret'

    globalThis.fetch = (async (url: string | URL) => {
      capturedUrl = url.toString()
      return new Response(JSON.stringify({ data: [] }), { status: 200 })
    }) as any

    try {
      const maliciousPole = 'POL-test"}]]; --'
      await fetchServicesFromERPNext(maliciousPole)

      assert.ok(capturedUrl.includes('/api/resource/Bokengi'))
      assert.ok(capturedUrl.includes('filters='))

      const urlObj = new URL(capturedUrl)
      const filtersParam = urlObj.searchParams.get('filters')
      assert.ok(filtersParam, 'filters param should exist')

      const parsedFilters = JSON.parse(filtersParam)
      assert.ok(Array.isArray(parsedFilters))
      assert.equal(parsedFilters.length, 2)
      assert.deepEqual(parsedFilters[0], ['status', '=', 'published'])
      assert.deepEqual(parsedFilters[1], ['pole', '=', maliciousPole])
    } finally {
      globalThis.fetch = originalFetch
      delete process.env.ERPNEXT_API_KEY
      delete process.env.ERPNEXT_API_SECRET
    }
  })

  it('fetchServiceBySlugFromERPNext safely encodes slug containing quotes and brackets', async () => {
    let capturedUrl = ''
    const originalFetch = globalThis.fetch
    process.env.ERPNEXT_API_KEY = 'test-key'
    process.env.ERPNEXT_API_SECRET = 'test-secret'

    globalThis.fetch = (async (url: string | URL) => {
      capturedUrl = url.toString()
      return new Response(JSON.stringify({ data: [] }), { status: 200 })
    }) as any

    try {
      const maliciousSlug = 'my-service" OR 1=1 --'
      await fetchServiceBySlugFromERPNext(maliciousSlug)

      const urlObj = new URL(capturedUrl)
      const filtersParam = urlObj.searchParams.get('filters')
      assert.ok(filtersParam)

      const parsedFilters = JSON.parse(filtersParam)
      assert.deepEqual(parsedFilters, [
        ['slug', '=', maliciousSlug],
        ['status', '=', 'published'],
      ])
    } finally {
      globalThis.fetch = originalFetch
      delete process.env.ERPNEXT_API_KEY
      delete process.env.ERPNEXT_API_SECRET
    }
  })

  it('fetchCaseStudyBySlugFromERPNext safely encodes slug containing quotes', async () => {
    let capturedUrl = ''
    const originalFetch = globalThis.fetch
    process.env.ERPNEXT_API_KEY = 'test-key'
    process.env.ERPNEXT_API_SECRET = 'test-secret'

    globalThis.fetch = (async (url: string | URL) => {
      capturedUrl = url.toString()
      return new Response(JSON.stringify({ data: [] }), { status: 200 })
    }) as any

    try {
      const maliciousSlug = 'case-study" OR "a"="a'
      await fetchCaseStudyBySlugFromERPNext(maliciousSlug)

      const urlObj = new URL(capturedUrl)
      const filtersParam = urlObj.searchParams.get('filters')
      assert.ok(filtersParam)

      const parsedFilters = JSON.parse(filtersParam)
      assert.deepEqual(parsedFilters, [
        ['slug', '=', maliciousSlug],
        ['status', '=', 'published'],
      ])
    } finally {
      globalThis.fetch = originalFetch
      delete process.env.ERPNEXT_API_KEY
      delete process.env.ERPNEXT_API_SECRET
    }
  })

  it('fetchPostBySlugFromERPNext safely encodes slug containing quotes', async () => {
    let capturedUrl = ''
    const originalFetch = globalThis.fetch
    process.env.ERPNEXT_API_KEY = 'test-key'
    process.env.ERPNEXT_API_SECRET = 'test-secret'

    globalThis.fetch = (async (url: string | URL) => {
      capturedUrl = url.toString()
      return new Response(JSON.stringify({ data: [] }), { status: 200 })
    }) as any

    try {
      const maliciousSlug = 'post-slug"}]]; DROP TABLE--'
      await fetchPostBySlugFromERPNext(maliciousSlug)

      const urlObj = new URL(capturedUrl)
      const filtersParam = urlObj.searchParams.get('filters')
      assert.ok(filtersParam)

      const parsedFilters = JSON.parse(filtersParam)
      assert.deepEqual(parsedFilters, [
        ['slug', '=', maliciousSlug],
        ['status', '=', 'published'],
      ])
    } finally {
      globalThis.fetch = originalFetch
      delete process.env.ERPNEXT_API_KEY
      delete process.env.ERPNEXT_API_SECRET
    }
  })

  it('attachBookingToERPNextLead safely encodes email in Lead search filters', async () => {
    const capturedUrls: string[] = []
    const originalFetch = globalThis.fetch

    globalThis.fetch = (async (url: string | URL) => {
      capturedUrls.push(url.toString())
      return new Response(JSON.stringify({ data: [] }), { status: 200 })
    }) as any

    try {
      const maliciousEmail = 'user"+test@domain.com" OR "1"="1'

      await attachBookingToERPNextLead(
        {
          email: maliciousEmail,
          name: 'Test User',
          bookingUid: 'bk-1234',
          title: 'Meeting',
          startTime: '2026-03-30T10:00:00Z',
        },
        mockEnv
      )

      assert.ok(capturedUrls.length > 0)
      const searchUrl = capturedUrls[0]
      const urlObj = new URL(searchUrl)
      const filtersParam = urlObj.searchParams.get('filters')
      assert.ok(filtersParam)

      const parsedFilters = JSON.parse(filtersParam)
      assert.deepEqual(parsedFilters, [['email_id', '=', maliciousEmail.toLowerCase()]])
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})
