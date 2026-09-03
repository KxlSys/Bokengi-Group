'use client'

import React, { useState } from 'react'
import { Kicker } from './Kicker'

export interface CalBookingProps {
  calLink?: string
  enabled?: boolean
  className?: string
}

export const CalBooking: React.FC<CalBookingProps> = ({
  calLink = process.env.NEXT_PUBLIC_CALCOM_LINK,
  enabled = process.env.NEXT_PUBLIC_CALCOM_ENABLED === 'true',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)

  // 1. Architecture prête mais NON activée publiquement par défaut (exigence Phase 3)
  if (!enabled || !calLink) {
    return (
      <div
        className={`p-6 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] ${className}`}
      >
        <div className="flex items-center justify-between mb-3">
          <Kicker>PRISE DE RENDEZ-VOUS</Kicker>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] text-[var(--ink-muted)] border border-[var(--border-subtle)]">
            Module Cal.com en standby
          </span>
        </div>
        <h4 className="text-base font-bold text-[var(--ink-heading)] mb-2">
          Planification d\'un échange direct (Visioconférence)
        </h4>
        <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-4">
          L\'intégration native de planification en temps réel Cal.com est préparée techniquement. Elle sera activée lors de la validation des plages d\'agenda de la direction technique.
        </p>
        <div className="text-xs font-mono text-[var(--blue-cyan)] flex items-center gap-1.5">
          <span>ℹ</span>
          <span>Utilisez le formulaire ci-contre pour spécifier vos disponibilités souhaitées.</span>
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
        <Kicker>AGENDA EN LIGNE</Kicker>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--blue-cyan)]/10 text-[var(--blue-cyan)] border border-[var(--blue-cyan)]/20">
          Actif
        </span>
      </div>
      <h4 className="text-base font-bold text-[var(--ink-heading)] mb-2">
        Réserver un créneau de cadrage technique
      </h4>
      <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-4">
        Sélectionnez une date et heure pour échanger directement en visioconférence avec un responsable de pôle.
      </p>

      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="btn-v4-secondary w-full text-center text-xs py-2"
        >
          Ouvrir le calendrier interactif →
        </button>
      ) : (
        <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
          <iframe
            src={`https://cal.com/${calLink}?embed=true`}
            title="Réservation de rendez-vous Cal.com"
            className="w-full h-[450px] rounded-[var(--radius-sm)] border border-[var(--border-subtle)]"
          />
        </div>
      )}
    </div>
  )
}

export default CalBooking
