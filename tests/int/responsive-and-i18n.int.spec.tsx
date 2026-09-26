import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { LanguageToggle } from '@/components/bokengi/LanguageToggle'
import { CalBooking } from '@/components/bokengi/CalBooking'
import { I18nProvider } from '@/i18n'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  usePathname: () => '/fr/contact',
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => new URLSearchParams(),
}))

describe('Responsive & Multilingual (FR/EN) Navigation and Cal.com Modules', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cleanup()
  })

  describe('1. LanguageToggle Component', () => {
    it('renders both FR and EN toggle buttons with accessible aria labels and touch targets', () => {
      render(
        <I18nProvider initialLocale="fr">
          <LanguageToggle />
        </I18nProvider>
      )

      const frBtn = screen.getByRole('button', { name: /Français/i })
      const enBtn = screen.getByRole('button', { name: /English/i })

      expect(frBtn).toBeDefined()
      expect(enBtn).toBeDefined()

      // FR is active in initial FR locale
      expect(frBtn.getAttribute('aria-pressed')).toBe('true')
      expect(enBtn.getAttribute('aria-pressed')).toBe('false')

      // Check min touch target classes
      expect(frBtn.className).toContain('min-w-[32px]')
      expect(frBtn.className).toContain('min-h-[32px]')
    })

    it('navigates to the corresponding EN path when clicking EN', () => {
      render(
        <I18nProvider initialLocale="fr">
          <LanguageToggle />
        </I18nProvider>
      )

      const enBtn = screen.getByRole('button', { name: /English/i })
      fireEvent.click(enBtn)

      expect(mockPush).toHaveBeenCalledWith('/en/contact')
    })
  })

  describe('2. CalBooking Component (Active & Standby Modes)', () => {
    it('renders in Active mode with interactive trigger button and bokengi-group embed URL', () => {
      render(
        <I18nProvider initialLocale="fr">
          <CalBooking calLink="https://cal.com/bokengi-group" enabled={true} />
        </I18nProvider>
      )

      // Active badge and title
      expect(screen.getByText('Actif')).toBeDefined()
      expect(screen.getByText('PRISE DE RENDEZ-VOUS')).toBeDefined()
      expect(screen.getByText('Réserver un créneau de cadrage technique')).toBeDefined()

      // Interactive button
      const openBtn = screen.getByRole('button', { name: /Ouvrir le calendrier interactif/i })
      expect(openBtn).toBeDefined()
      expect(openBtn.className).toContain('min-h-[44px]')

      // Click to open iframe
      fireEvent.click(openBtn)

      const iframe = screen.getByTitle('Réservation de rendez-vous Cal.com')
      expect(iframe).toBeDefined()
      expect(iframe.getAttribute('src')).toBe('https://cal.com/bokengi-group?embed=true')
    })

    it('renders correctly in English in Active mode', () => {
      render(
        <I18nProvider initialLocale="en">
          <CalBooking calLink="bokengi-group" enabled={true} />
        </I18nProvider>
      )

      expect(screen.getByText('Active')).toBeDefined()
      expect(screen.getByText('SCHEDULE AN APPOINTMENT')).toBeDefined()
      expect(screen.getByText('Book a Technical Scoping Session')).toBeDefined()

      const openBtn = screen.getByRole('button', { name: /Open Interactive Calendar/i })
      expect(openBtn).toBeDefined()

      fireEvent.click(openBtn)

      const iframe = screen.getByTitle('Cal.com Meeting Booking')
      expect(iframe).toBeDefined()
      expect(iframe.getAttribute('src')).toBe('https://cal.com/bokengi-group?embed=true')
    })

    it('renders Standby mode when explicitly disabled', () => {
      render(
        <I18nProvider initialLocale="fr">
          <CalBooking calLink="bokengi-group" enabled={false} />
        </I18nProvider>
      )

      expect(screen.getByText('Module Cal.com en standby')).toBeDefined()
      expect(screen.getByText(/Planification d’un échange direct/i)).toBeDefined()
      expect(screen.queryByRole('button', { name: /Ouvrir le calendrier interactif/i })).toBeNull()
    })
  })
})
