'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { useTheme } from '@/providers/Theme'

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme } = useTheme()

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
  }, [pathname])

  const toggleMenu = () => setIsOpen((prev) => !prev)

  const isDark = mounted ? theme === 'dark' : true

  const navLinks = [
    { href: '/groupe', label: 'Le Groupe' },
    { href: '/expertises', label: 'Expertises' },
    { href: '/realisations', label: 'Réalisations' },
    { href: '/contact', label: 'Contact' },
  ]

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
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`header-v4-link ${isActive ? 'is-active' : ''}`}
                    style={{
                      color: isActive ? 'var(--ink-heading)' : 'var(--ink-muted)',
                      fontWeight: isActive ? 600 : 500,
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
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
            className={`md:hidden p-2 text-[var(--ink-heading)] cursor-pointer`}
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-6 py-5 shadow-lg">
          <ul className="flex flex-col gap-4 list-none p-0 m-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium text-[var(--ink-heading)] hover:text-[var(--blue-cyan)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/contact?type=devis"
                onClick={() => setIsOpen(false)}
                className="btn-v4-primary w-full text-center"
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
