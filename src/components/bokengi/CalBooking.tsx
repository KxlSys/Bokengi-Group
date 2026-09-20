'use client'

import React, { useState } from 'react'
import { Kicker } from './Kicker'

export interface CalBookingProps {
  calLink?: string
  enabled?: boolean
  className?: string
}

import { useI18n } from '@/i18n'

export const CalBooking: React.FC<CalBookingProps> = ({
  calLink = process.env.NEXT_PUBLIC_CALCOM_LINK,
  enabled = process.env.NEXT_PUBLIC_CALCOM_ENABLED === 'true',
  className = '',
}) => {
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  // 1. Architecture prête mais NON activée publiquement par défaut (exigence Phase 3)
  if (!enabled || !calLink) {
    return (
      <div
        className={`p-6 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] ${className}`}
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
          <span>ℹ</span>
          <span>{t.contact.calNote}</span>
        </div>
      </div>
    )
  }

  // 2. Si activé par l'administrateur via variable d'environnement
  return (
    <div
      className={`p-6 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-medium)] ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <Kicker>{t.contact.calKicker}</Kicker>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--blue-cyan)]/10 text-[var(--blue-cyan)] border border-[var(--blue-cyan)]/20">
          {t.contact.calActiveBadge}
        </span>
      </div>
      <h4 className="text-base font-bold text-[var(--ink-heading)] mb-2">
        {t.contact.calActiveTitle}
      </h4>
      <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-4">
        {t.contact.calActiveDesc}
      </p>

      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="btn-v4-secondary w-full text-center text-xs py-2"
        >
          {t.contact.calOpenBtn}
        </button>
      ) : (
        <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
          <iframe
            src={`https://cal.com/${calLink}?embed=true`}
            title={t.contact.calIframeTitle}
            className="w-full h-[450px] rounded-[var(--radius-sm)] border border-[var(--border-subtle)]"
          />
        </div>
      )}
    </div>
  )
}

export default CalBooking
