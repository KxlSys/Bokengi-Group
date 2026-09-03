'use client'

import React from 'react'

export interface OpenStatusProps {
  statusUrl?: string
  enabled?: boolean
  className?: string
}

/**
 * Composant de préparation pour l'intégration OpenStatus (Statut & Uptime).
 * EN STANDBY PAR DÉFAUT : Non activé publiquement sans validation explicite.
 */
export const OpenStatusBadge: React.FC<OpenStatusProps> = ({
  statusUrl = process.env.NEXT_PUBLIC_OPENSTATUS_URL || 'https://status.bokengi-group.com',
  enabled = process.env.NEXT_PUBLIC_OPENSTATUS_ENABLED === 'true',
  className = '',
}) => {
  if (!enabled) {
    return null
  }

  return (
    <a
      href={statusUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--ink-muted)] hover:text-[var(--ink-heading)] transition-colors ${className}`}
      aria-label="Statut des services Bokengi Group"
    >
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span>Systèmes opérationnels</span>
    </a>
  )
}

export default OpenStatusBadge
