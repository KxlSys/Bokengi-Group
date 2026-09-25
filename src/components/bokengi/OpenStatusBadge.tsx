'use client'

import React from 'react'
import { useI18n } from '@/i18n'

export interface OpenStatusProps {
  statusUrl?: string
  enabled?: boolean
  className?: string
}

/**
 * BOKENGI GROUP 2.0 — MODULE D'OBSERVABILITÉ & STATUT PUBLIC (OPENSTATUS)
 *
 * Principes de conception et résilience :
 * - Mode Standby par défaut (NEXT_PUBLIC_OPENSTATUS_ENABLED=false) : 0 rendu DOM, 0 impact sur le bundle/temps de chargement.
 * - Mode Actif : Affichage d'un badge institutionnel accessible relié à la page de statut public.
 * - Résilience : Fallback immédiat si l'URL est manquante ou malformée.
 * - Accessibilité : Support de la navigation au clavier (focus ring contrasté), aria-label et infobulle explicite.
 */
export const OpenStatusBadge: React.FC<OpenStatusProps> = ({
  statusUrl = process.env.NEXT_PUBLIC_OPENSTATUS_URL || 'https://status.bokengi-group.com',
  enabled = process.env.NEXT_PUBLIC_OPENSTATUS_ENABLED === 'true',
  className = '',
}) => {
  const { t } = useI18n()

  if (!enabled) {
    return null
  }

  // Normalisation sécurisée de l'URL de statut
  const rawUrl = typeof statusUrl === 'string' ? statusUrl.trim() : ''
  const validUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
    ? rawUrl
    : 'https://status.bokengi-group.com'

  return (
    <a
      href={validUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--ink-muted)] hover:text-[var(--ink-heading)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--blue-cyan)] ${className}`}
      aria-label={t.common.statusBadgeAria}
    >
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
      <span>{t.common.operationalSystems}</span>
    </a>
  )
}

export default OpenStatusBadge
