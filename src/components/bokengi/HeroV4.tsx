import React from 'react'
import Link from 'next/link'
import { Kicker } from './Kicker'

export const HeroV4: React.FC = () => {
  return (
    <section className="hero-v4">
      <div className="pattern-dotted-radial-right" aria-hidden="true" />
      <div className="container-v4">
        <div className="hero-v4-grid">
          {/* Left Column: Typographic Focus */}
          <div className="hero-v4-left">
            <Kicker label="BOKENGI GROUP" />

            <h1 className="hero-v4-title">
              <span className="hero-title-white">Construire.</span>
              <span className="hero-title-blue">Protéger.</span>
              <span className="hero-title-white">Développer.</span>
            </h1>

            <p className="hero-v4-lead">
              Technologie, sécurité et services pour faire avancer les organisations.
            </p>

            <p className="hero-v4-sub">
              Bokengi Group conçoit, sécurise et accompagne les infrastructures, les solutions numériques et les projets professionnels.
            </p>

            <div className="hero-v4-actions">
              <Link href="/contact?type=devis" className="btn-v4-primary">
                Parler de votre projet →
              </Link>
              <Link href="/expertises" className="btn-v4-secondary">
                Découvrir nos expertises
              </Link>
            </div>
          </div>

          {/* Right Column: Master Brand Symbol & Technical Lines */}
          <div className="hero-v4-brand-art">
            <svg
              className="hero-art-lines"
              viewBox="0 0 500 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle
                cx="250"
                cy="250"
                r="210"
                stroke="var(--blue-cyan)"
                strokeWidth="1"
                strokeDasharray="4 8"
                opacity="0.25"
              />
              <circle
                cx="250"
                cy="250"
                r="140"
                stroke="var(--blue-accent)"
                strokeWidth="1"
                opacity="0.15"
              />
              <line
                x1="250"
                y1="20"
                x2="250"
                y2="480"
                stroke="var(--border-medium)"
                strokeWidth="1"
                opacity="0.3"
              />
              <line
                x1="20"
                y1="250"
                x2="480"
                y2="250"
                stroke="var(--border-medium)"
                strokeWidth="1"
                opacity="0.3"
              />

              {/* Subtle Coordinate Crosses */}
              <path d="M40 40H60M50 30V50" stroke="var(--blue-cyan)" strokeWidth="1" opacity="0.4" />
              <path d="M440 440H460M450 430V450" stroke="var(--blue-cyan)" strokeWidth="1" opacity="0.4" />

              {/* Technical Micro Typography */}
              <text x="260" y="45" fill="var(--ink-faint)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.15em">
                LAT // 04.250
              </text>
              <text x="260" y="470" fill="var(--ink-faint)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.15em">
                CORE // INFRA
              </text>
            </svg>

            {/* Official Brand Vector Mark */}
            <img
              src="/bokengi-mark.svg"
              alt="Emblème officiel Bokengi Group"
              className="hero-brand-symbol"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroV4
