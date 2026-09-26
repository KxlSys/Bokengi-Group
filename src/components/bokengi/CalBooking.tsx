'use client'

import React, { useState } from 'react'
import { Kicker } from './Kicker'
import { useI18n } from '@/i18n'

export interface CalBookingProps {
  calLink?: string
  enabled?: boolean
  className?: string
}

export const CalBooking: React.FC<CalBookingProps> = ({
  calLink = process.env.NEXT_PUBLIC_CALCOM_LINK || 'bokengi-group',
  enabled = process.env.NEXT_PUBLIC_CALCOM_ENABLED !== 'false',
  className = '',
}) => {
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  // Nettoyage et normalisation du lien / slug Cal.com
  const rawLink = typeof calLink === 'string' ? calLink.trim() : ''
  const cleanSlug = rawLink.replace(/^https?:\/\/cal\.com\//i, '').replace(/^\/+|\/+$/g, '')

  // 1. Mode Standby : Architecture prête mais désactivée par défaut
  if (!enabled || !cleanSlug) {
    return (
      <div
        className={`p-5 sm:p-6 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] ${className}`}
        role="region"
        aria-label={t.contact.calTitle}
      >
        <div className="flex items-center justify-between mb-3">
          <Kicker>{t.contact.calKicker}</Kicker>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] text-[var(--ink-muted)] border border-[var(--border-subtle)]">
            {t.contact.calStandbyBadge}
          </span>
        </div>
        <h4 className="text-base font-bold text-[var(--ink-heading)] mb-2">
          {t.contact.calTitle}
        </h4>
        <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-4">
          {t.contact.calDesc}
        </p>
        <div className="text-xs font-mono text-[var(--blue-cyan)] flex items-center gap-1.5">
          <span aria-hidden="true">ℹ</span>
          <span>{t.contact.calNote}</span>
        </div>
      </div>
    )
  }

  // 2. Mode Actif : Affichage du déclencheur et de l'iframe intégrée Cal.com
  const embedUrl = `https://cal.com/${cleanSlug}?embed=true`

  return (
    <div
      className={`p-5 sm:p-6 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-medium)] transition-all ${className}`}
      role="region"
      aria-label={t.contact.calActiveTitle}
    >
      <div className="flex items-center justify-between mb-3">
        <Kicker>{t.contact.calKicker}</Kicker>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--blue-cyan)]/10 text-[var(--blue-cyan)] border border-[var(--blue-cyan)]/20 font-semibold">
          {t.contact.calActiveBadge}
        </span>
      </div>
      <h4 className="text-base font-bold text-[var(--ink-heading)] mb-2">
        {t.contact.calActiveTitle}
      </h4>
      <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-4">
        {t.contact.calActiveDesc}
      </p>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="cal-embed-container"
        className="btn-v4-secondary w-full text-center text-xs py-2.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--blue-cyan)] min-h-[44px]"
      >
        {isOpen ? t.contact.calCloseBtn : t.contact.calOpenBtn}
      </button>

      {isOpen && (
        <div
          id="cal-embed-container"
          className="mt-4 border-t border-[var(--border-subtle)] pt-4 animate-in fade-in duration-300 w-full overflow-hidden"
        >
          <iframe
            src={embedUrl}
            title={t.contact.calIframeTitle}
            loading="lazy"
            allow="camera; microphone; autoplay; fullscreen"
            className="w-full max-w-full h-[460px] xs:h-[500px] sm:h-[540px] rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
          />
        </div>
      )}
    </div>
  )
}

export default CalBooking
