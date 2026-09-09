'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { useTheme } from '@/providers/Theme'

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme } = useTheme()

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
    { href: '/expertises/it', name: '01 — BOKENGI IT', sub: 'Technologie, infrastructure & cybersécurité' },
    { href: '/expertises/digital', name: '02 — BOKENGI DIGITAL', sub: 'Web, produits numériques & transformation' },
    { href: '/expertises/business', name: '03 — BOKENGI BUSINESS', sub: 'Assistance administrative & organisation' },
    { href: '/expertises/consulting', name: '04 — BOKENGI CONSULTING', sub: 'Conseil stratégique & audits IT' },
    { href: '/expertises/events', name: '05 — BOKENGI EVENTS', sub: 'Événements professionnels & régie' },
  ]

  const isGroupeActive = pathname === '/groupe'
  const isExpertisesActive = pathname === '/expertises' || pathname?.startsWith('/expertises/')
  const isRealisationsActive = pathname === '/realisations' || pathname?.startsWith('/realisations/')
  const isActualitesActive = pathname === '/actualites' || pathname?.startsWith('/actualites/')
  const isContactActive = pathname === '/contact'

  return (
    <header className={`header-v4 ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="container-v4 header-v4-inner">
        {/* Official Brand Logo */}
        <Link href="/" className="header-v4-logo" aria-label="Bokengi Group · Retour à l'accueil">
          <img
            src={isDark ? '/bokengi-logo-horizontal-dark.png' : '/bokengi-logo-horizontal.png'}
            alt="Bokengi Group · Technology & Services"
            className="header-v4-logo-img"
            style={{ height: '38px', width: 'auto', display: 'block' }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-v4-nav hidden md:flex" aria-label="Navigation principale">
          <ul className="header-v4-links">
            <li>
              <Link
                href="/groupe"
                className={`header-v4-link ${isGroupeActive ? 'is-active' : ''}`}
              >
                Le Groupe
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
                href="/expertises"
                className={`header-v4-link ${isExpertisesActive ? 'is-active' : ''}`}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                aria-controls="expertises-dropdown-menu"
                onKeyDown={handleTriggerKeyDown}
              >
                Expertises
              </Link>
              <div
                id="expertises-dropdown-menu"
                role="menu"
                aria-label="Pôles d'expertise"
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
                href="/realisations"
                className={`header-v4-link ${isRealisationsActive ? 'is-active' : ''}`}
              >
                Réalisations
              </Link>
            </li>

            <li>
              <Link
                href="/actualites"
                className={`header-v4-link ${isActualitesActive ? 'is-active' : ''}`}
              >
                Actualités
              </Link>
            </li>

            <li>
              <Link
                href="/contact"
                className={`header-v4-link ${isContactActive ? 'is-active' : ''}`}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Header Actions */}
        <div className="header-v4-actions">
          <ThemeToggle />

          <Link href="/contact?type=devis" className="btn-v4-primary hidden sm:inline-flex" style={{ height: '40px', padding: '0 1.25rem', fontSize: '0.85rem' }}>
            Demander un devis →
          </Link>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden p-2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-[var(--ink-heading)] cursor-pointer"
            onClick={toggleMenu}
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
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
          className="md:hidden bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-6 py-5 shadow-lg max-h-[calc(100dvh-80px)] overflow-y-auto"
          style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom, 0px))' }}
        >
          <ul className="flex flex-col gap-3 list-none p-0 m-0">
            <li>
              <Link
                href="/groupe"
                onClick={() => setIsOpen(false)}
                className={`block text-base font-medium transition-colors ${
                  isGroupeActive ? 'text-[var(--blue-cyan)] font-semibold' : 'text-[var(--ink-heading)] hover:text-[var(--blue-cyan)]'
                }`}
              >
                Le Groupe
              </Link>
            </li>

            <li>
              <Link
                href="/expertises"
                onClick={() => setIsOpen(false)}
                className={`block text-base font-medium transition-colors ${
                  isExpertisesActive ? 'text-[var(--blue-cyan)] font-semibold' : 'text-[var(--ink-heading)] hover:text-[var(--blue-cyan)]'
                }`}
              >
                Expertises
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
                href="/realisations"
                onClick={() => setIsOpen(false)}
                className={`block text-base font-medium transition-colors ${
                  isRealisationsActive ? 'text-[var(--blue-cyan)] font-semibold' : 'text-[var(--ink-heading)] hover:text-[var(--blue-cyan)]'
                }`}
              >
                Réalisations
              </Link>
            </li>

            <li>
              <Link
                href="/actualites"
                onClick={() => setIsOpen(false)}
                className={`block text-base font-medium transition-colors ${
                  isActualitesActive ? 'text-[var(--blue-cyan)] font-semibold' : 'text-[var(--ink-heading)] hover:text-[var(--blue-cyan)]'
                }`}
              >
                Actualités
              </Link>
            </li>

            <li>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className={`block text-base font-medium transition-colors ${
                  isContactActive ? 'text-[var(--blue-cyan)] font-semibold' : 'text-[var(--ink-heading)] hover:text-[var(--blue-cyan)]'
                }`}
              >
                Contact
              </Link>
            </li>

            <li className="pt-3 border-t border-[var(--border-subtle)]">
              <Link
                href="/contact?type=devis"
                onClick={() => setIsOpen(false)}
                className="btn-v4-primary w-full text-center justify-center"
              >
                Demander un devis →
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

export default Navbar
