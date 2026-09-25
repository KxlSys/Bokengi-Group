import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import React from 'react'
import { render } from '@testing-library/react'
import { UmamiAnalytics } from '@/components/bokengi/UmamiAnalytics'

describe('UmamiAnalytics Component — Phase 7.4', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    delete process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
    delete process.env.NEXT_PUBLIC_UMAMI_SRC
    delete process.env.NEXT_PUBLIC_UMAMI_HOST_URL
    delete process.env.NEXT_PUBLIC_UMAMI_ENABLED
  })

  afterEach(() => {
    process.env = originalEnv
    document.head.innerHTML = ''
    document.body.innerHTML = ''
  })

  describe('1. Mode Standby (Désactivé par défaut)', () => {
    it('ne doit injecter aucun élément dans le DOM si NEXT_PUBLIC_UMAMI_ENABLED=false', () => {
      process.env.NEXT_PUBLIC_UMAMI_ENABLED = 'false'
      process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = 'bokengi-test-id'

      const { container } = render(<UmamiAnalytics />)
      expect(container.firstChild).toBeNull()
      expect(document.querySelector('script[data-website-id]')).toBeNull()
    })

    it('ne doit injecter aucun élément si enabled=false est passé en prop', () => {
      const { container } = render(
        <UmamiAnalytics enabled={false} websiteId="bokengi-test-id" />
      )
      expect(container.firstChild).toBeNull()
      expect(document.querySelector('script[data-website-id]')).toBeNull()
    })

    it('ne doit injecter aucun élément si NEXT_PUBLIC_UMAMI_ENABLED n\'est pas défini', () => {
      process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = 'bokengi-test-id'

      const { container } = render(<UmamiAnalytics />)
      expect(container.firstChild).toBeNull()
      expect(document.querySelector('script[data-website-id]')).toBeNull()
    })

    it('ne doit injecter aucun élément si websiteId est vide même avec enabled=true', () => {
      process.env.NEXT_PUBLIC_UMAMI_ENABLED = 'true'
      process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = '   '

      const { container } = render(<UmamiAnalytics />)
      expect(container.firstChild).toBeNull()
      expect(document.querySelector('script[data-website-id]')).toBeNull()
    })
  })

  describe('2. Mode Actif (NEXT_PUBLIC_UMAMI_ENABLED=true)', () => {
    it('doit injecter le script avec les attributs nécessaires en mode actif', () => {
      process.env.NEXT_PUBLIC_UMAMI_ENABLED = 'true'
      process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = 'bokengi-site-prod-id'

      const { container } = render(<UmamiAnalytics />)
      // next/script in jsdom renders into head or DOM
      const script = document.querySelector('script[data-website-id="bokengi-site-prod-id"]')
      expect(script).not.toBeNull()
      expect(script?.getAttribute('src')).toBe('https://analytics.umami.is/script.js')
      expect(script?.getAttribute('data-auto-track')).toBe('true')
    })

    it('doit respecter un src personnalisé et un data-host-url', () => {
      process.env.NEXT_PUBLIC_UMAMI_ENABLED = 'true'
      process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = 'custom-site-id'
      process.env.NEXT_PUBLIC_UMAMI_SRC = 'https://custom-umami.example.com/custom.js'
      process.env.NEXT_PUBLIC_UMAMI_HOST_URL = 'https://custom-collector.example.com'

      render(<UmamiAnalytics />)
      const script = document.querySelector('script[data-website-id="custom-site-id"]')
      expect(script).not.toBeNull()
      expect(script?.getAttribute('src')).toBe('https://custom-umami.example.com/custom.js')
      expect(script?.getAttribute('data-host-url')).toBe('https://custom-collector.example.com')
      expect(script?.getAttribute('data-auto-track')).toBe('true')
    })

    it('doit fonctionner avec les props directes', () => {
      render(
        <UmamiAnalytics
          enabled={true}
          websiteId="prop-site-id"
          src="https://umami.bokengi-group.com/script.js"
          hostUrl="https://umami.bokengi-group.com"
        />
      )
      const script = document.querySelector('script[data-website-id="prop-site-id"]')
      expect(script).not.toBeNull()
      expect(script?.getAttribute('src')).toBe('https://umami.bokengi-group.com/script.js')
      expect(script?.getAttribute('data-host-url')).toBe('https://umami.bokengi-group.com')
    })
  })

  describe('3. Sécurité & Privacy', () => {
    it('ne doit exposer aucun secret ni clé CRM ERPNext dans les attributs', () => {
      process.env.NEXT_PUBLIC_UMAMI_ENABLED = 'true'
      process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = 'bokengi-privacy-site-id'
      process.env.NEXT_PUBLIC_UMAMI_SRC = 'https://analytics.umami.is/script.js?t=privacy'
      process.env.ERPNEXT_API_KEY = 'secret-key-123'
      process.env.ERPNEXT_API_SECRET = 'secret-crm-456'

      render(<UmamiAnalytics />)
      const script = document.querySelector('script[data-website-id="bokengi-privacy-site-id"]')
      expect(script).not.toBeNull()
      expect(script?.getAttribute('data-website-id')).toBe('bokengi-privacy-site-id')
      expect(script?.outerHTML).not.toContain('secret-key-123')
      expect(script?.outerHTML).not.toContain('secret-crm-456')
    })

    it('doit ignorer toute valeur arbitraire non strictement "true" pour ENABLED', () => {
      process.env.NEXT_PUBLIC_UMAMI_ENABLED = 'yes'
      process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = 'bokengi-site-prod-id'

      const { container } = render(<UmamiAnalytics />)
      expect(container.firstChild).toBeNull()
      expect(document.querySelector('script[data-website-id]')).toBeNull()
    })
  })
})
