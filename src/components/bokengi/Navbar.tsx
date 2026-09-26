'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { LanguageToggle } from './LanguageToggle'
import { useTheme } from '@/providers/Theme'
import { useI18n } from '@/i18n'

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme } = useTheme()
  const { locale, t } = useI18n()

  const getHref = (path: string) => `/${locale}${path === '/' ? '' : path}`

  const dropdownWrapRef = React.useRef<HTMLLIElement>(null)
  const triggerLinkRef = React.useRef<HTMLAnchorElement>(null)
  const itemLinksRef = React.useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setIsDropdownOpen(false)
  }, [pathname])

  const toggleMenu = () => setIsOpen((prev) => !prev)

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      setIsDropdownOpen(true)
      setTimeout(() => {
        itemLinksRef.current[0]?.focus()
      }, 0)
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false)
    }
  }

  const handleItemKeyDown = (index: number, e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setIsDropdownOpen(false)
      triggerLinkRef.current?.focus()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = (index + 1) % 5
      itemLinksRef.current[next]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (index === 0) {
        setIsDropdownOpen(false)
        triggerLinkRef.current?.focus()
      } else {
        itemLinksRef.current[index - 1]?.focus()
      }
    }
  }

  const handleDropdownBlur = (e: React.FocusEvent<HTMLLIElement>) => {
    if (!dropdownWrapRef.current?.contains(e.relatedTarget as Node)) {
      setIsDropdownOpen(false)
    }
  }

  const isDark = mounted ? theme === 'dark' : false

  const expertises = [
    { href: getHref('/expertises/it'), name: t.expertises.it.name, sub: t.expertises.it.sub },
    { href: getHref('/expertises/digital'), name: t.expertises.digital.name, sub: t.expertises.digital.sub },
    { href: getHref('/expertises/business'), name: t.expertises.business.name, sub: t.expertises.business.sub },
    { href: getHref('/expertises/consulting'), name: t.expertises.consulting.name, sub: t.expertises.consulting.sub },
    { href: getHref('/expertises/events'), name: t.expertises.events.name, sub: t.expertises.events.sub },
  ]

  const isGroupeActive = pathname === getHref('/groupe') || pathname === '/groupe'
  const isExpertisesActive = pathname === getHref('/expertises') || pathname?.startsWith(getHref('/expertises/')) || pathname === '/expertises' || pathname?.startsWith('/expertises/')
  const isRealisationsActive = pathname === getHref('/realisations') || pathname?.startsWith(getHref('/realisations/')) || pathname === '/realisations' || pathname?.startsWith('/realisations/')
  const isActualitesActive = pathname === getHref('/actualites') || pathname?.startsWith(getHref('/actualites/')) || pathname === '/actualites' || pathname?.startsWith('/actualites/')
  const isContactActive = pathname === getHref('/contact') || pathname === '/contact'

  return (
    <header className={`header-v4 ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="container-v4 header-v4-inner">
        {/* Official Brand Logo */}
        <Link href={getHref('/')} className="header-v4-logo min-w-0 shrink" aria-label={`Bokengi Group · ${t.common.backToHome}`}>
          <img
            src={isDark ? '/bokengi-logo-horizontal-dark.png' : '/bokengi-logo-horizontal.png'}
            alt="Bokengi Group · Technology & Services"
            className="header-v4-logo-img h-[32px] xs:h-[35px] sm:h-[38px] w-auto max-w-[135px] xs:max-w-[170px] sm:max-w-none object-contain block"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-v4-nav hidden md:flex" aria-label={t.nav.mainNavigation}>
          <ul className="header-v4-links">
            <li>
              <Link
                href={getHref('/groupe')}
                className={`header-v4-link ${isGroupeActive ? 'is-active' : ''}`}
              >
                {t.nav.group}
              </Link>
            </li>

            <li
              ref={dropdownWrapRef}
              className={`header-v4-dropdown-wrap ${isDropdownOpen ? 'is-open' : ''}`}
              onBlur={handleDropdownBlur}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <Link
                ref={triggerLinkRef}
                href={getHref('/expertises')}
                className={`header-v4-link ${isExpertisesActive ? 'is-active' : ''}`}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                aria-controls="expertises-dropdown-menu"
                onKeyDown={handleTriggerKeyDown}
              >
                {t.nav.expertises}
              </Link>
              <div
                id="expertises-dropdown-menu"
                role="menu"
                aria-label={t.footer.expertisesTitle}
                className="header-v4-dropdown-menu"
              >
                {expertises.map((exp, idx) => (
                  <Link
                    key={exp.href}
                    ref={(el) => {
                      itemLinksRef.current[idx] = el
                    }}
                    href={exp.href}
                    role="menuitem"
                    className="header-v4-dropdown-item"
                    onKeyDown={(e) => handleItemKeyDown(idx, e)}
                  >
                    <span className="dropdown-item-pole">{exp.name}</span>
                    <span className="dropdown-item-sub">{exp.sub}</span>
                  </Link>
                ))}
              </div>
            </li>

            <li>
              <Link
                href={getHref('/realisations')}
                className={`header-v4-link ${isRealisationsActive ? 'is-active' : ''}`}
              >
                {t.nav.projects}
              </Link>
            </li>

            <li>
              <Link
                href={getHref('/actualites')}
                className={`header-v4-link ${isActualitesActive ? 'is-active' : ''}`}
              >
                {t.nav.news}
              </Link>
            </li>

            <li>
              <Link
                href={getHref('/contact')}
                className={`header-v4-link ${isContactActive ? 'is-active' : ''}`}
              >
                {t.nav.contact}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Header Actions */}
        <div className="header-v4-actions flex items-center gap-1.5 xs:gap-2 sm:gap-3 shrink-0">
          <LanguageToggle />
          <ThemeToggle />

          <Link href={getHref('/contact?type=devis')} className="btn-v4-primary hidden lg:inline-flex" style={{ height: '40px', padding: '0 1.25rem', fontSize: '0.85rem' }}>
            {t.common.requestQuote} →
          </Link>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden p-2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-[var(--ink-heading)] cursor-pointer"
            onClick={toggleMenu}
            aria-label={isOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={isOpen}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {isOpen ? (
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div
          className="md:hidden bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-6 py-5 shadow-lg max-h-[calc(100dvh-72px)] sm:max-h-[calc(100dvh-80px)] overflow-y-auto"
          style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom, 0px))' }}
        >
          <ul className="flex flex-col gap-3 list-none p-0 m-0">
            <li>
              <Link
                href={getHref('/groupe')}
                onClick={() => setIsOpen(false)}
                className={`block text-base font-medium transition-colors ${
                  isGroupeActive ? 'text-[var(--blue-cyan)] font-semibold' : 'text-[var(--ink-heading)] hover:text-[var(--blue-cyan)]'
                }`}
              >
                {t.nav.group}
              </Link>
            </li>

            <li>
              <Link
                href={getHref('/expertises')}
                onClick={() => setIsOpen(false)}
                className={`block text-base font-medium transition-colors ${
                  isExpertisesActive ? 'text-[var(--blue-cyan)] font-semibold' : 'text-[var(--ink-heading)] hover:text-[var(--blue-cyan)]'
                }`}
              >
                {t.nav.expertises}
              </Link>
              <div className="mobile-poles-subgrid">
                {expertises.map((exp) => {
                  const isSubActive = pathname === exp.href
                  return (
                    <Link
                      key={exp.href}
                      href={exp.href}
                      onClick={() => setIsOpen(false)}
                      className={`mobile-pole-sublink ${isSubActive ? 'is-active' : ''}`}
                    >
                      <span className="mobile-sublink-name">{exp.name}</span>
                    </Link>
                  )
                })}
              </div>
            </li>

            <li>
              <Link
                href={getHref('/realisations')}
                onClick={() => setIsOpen(false)}
                className={`block text-base font-medium transition-colors ${
                  isRealisationsActive ? 'text-[var(--blue-cyan)] font-semibold' : 'text-[var(--ink-heading)] hover:text-[var(--blue-cyan)]'
                }`}
              >
                {t.nav.projects}
              </Link>
            </li>

            <li>
              <Link
                href={getHref('/actualites')}
                onClick={() => setIsOpen(false)}
                className={`block text-base font-medium transition-colors ${
                  isActualitesActive ? 'text-[var(--blue-cyan)] font-semibold' : 'text-[var(--ink-heading)] hover:text-[var(--blue-cyan)]'
                }`}
              >
                {t.nav.news}
              </Link>
            </li>

            <li>
              <Link
                href={getHref('/contact')}
                onClick={() => setIsOpen(false)}
                className={`block text-base font-medium transition-colors ${
                  isContactActive ? 'text-[var(--blue-cyan)] font-semibold' : 'text-[var(--ink-heading)] hover:text-[var(--blue-cyan)]'
                }`}
              >
                {t.nav.contact}
              </Link>
            </li>

            <li className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--ink-muted)]">{t.nav.language}</span>
              <LanguageToggle showLabel={false} />
            </li>

            <li className="pt-2">
              <Link
                href={getHref('/contact?type=devis')}
                onClick={() => setIsOpen(false)}
                className="btn-v4-primary w-full text-center justify-center"
              >
                {t.common.requestQuote} →
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

export default Navbar
