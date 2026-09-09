'use client'

import React from 'react'
import { useAuth } from '@payloadcms/ui'
import { LiveClock } from './LiveClock'

export interface WelcomeBannerProps {
  userName?: string | null
  userEmail?: string | null
  user?: {
    name?: string | null
    email?: string | null
    [key: string]: unknown
  } | null
  className?: string
  showClock?: boolean
  [key: string]: unknown
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  userName,
  userEmail,
  user: userFromProps,
  className = '',
  showClock = true,
}) => {
  let authUser: { name?: string | null; email?: string | null } | null = null
  try {
    const auth = useAuth()
    authUser = (auth?.user as any) ?? null
  } catch {
    authUser = null
  }

  const effectiveName =
    userName ??
    (typeof userFromProps?.name === 'string' ? userFromProps.name : null) ??
    (typeof authUser?.name === 'string' ? authUser.name : null) ??
    ''

  const rawName = effectiveName.trim()
  const firstName = rawName ? rawName.split(' ')[0] : ''
  const greeting = firstName ? `Bonjour, ${firstName}` : 'Bonjour'

  return (
    <section
      className={`bokengi-welcome-banner ${className}`.trim()}
      aria-label="En-tête d'accueil du Command Center"
    >
      <div className="bokengi-pattern-v1" aria-hidden="true" />
      <div className="bokengi-welcome-banner__content">
        <div className="bokengi-welcome-banner__main">
          <span className="bokengi-welcome-banner__kicker">
            BOKENGI GROUP · ADMINISTRATION
          </span>
          <h1 className="bokengi-welcome-banner__title">
            {greeting}
          </h1>
          <p className="bokengi-welcome-banner__subtitle">
            Bienvenue dans votre espace de pilotage.
          </p>
        </div>

        {showClock && (
          <div className="bokengi-welcome-banner__aside">
            <LiveClock />
          </div>
        )}
      </div>
    </section>
  )
}

export default WelcomeBanner