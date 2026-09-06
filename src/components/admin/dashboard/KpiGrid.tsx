import React from 'react'
import type { LeadKpisData } from '@/lib/admin/getLeadKpis'

export interface KpiGridProps {
  data?: LeadKpisData | null
  error?: string | null
  className?: string
}

interface KpiItemConfig {
  id: string
  label: string
  getValue: (data: LeadKpisData) => number
  subtext: string
  variantClass: string
}

const KPI_CARDS: KpiItemConfig[] = [
  {
    id: 'total',
    label: 'Demandes reçues',
    getValue: (d) => d.total,
    subtext: 'Total des prospects',
    variantClass: 'bokengi-kpi-card--total',
  },
  {
    id: 'new',
    label: 'Nouvelles demandes',
    getValue: (d) => d.newCount,
    subtext: 'À traiter',
    variantClass: 'bokengi-kpi-card--new',
  },
  {
    id: 'contacted',
    label: 'En qualification',
    getValue: (d) => d.contactedCount,
    subtext: 'Premier contact',
    variantClass: 'bokengi-kpi-card--contacted',
  },
  {
    id: 'qualified',
    label: 'Demandes qualifiées',
    getValue: (d) => d.qualifiedCount,
    subtext: 'Besoins validés',
    variantClass: 'bokengi-kpi-card--qualified',
  },
  {
    id: 'converted',
    label: 'Demandes converties',
    getValue: (d) => d.convertedCount,
    subtext: 'Succès commercial',
    variantClass: 'bokengi-kpi-card--converted',
  },
  {
    id: 'archived',
    label: 'Demandes archivées',
    getValue: (d) => d.archivedCount,
    subtext: 'Clôturées',
    variantClass: 'bokengi-kpi-card--archived',
  },
]

export const KpiGrid: React.FC<KpiGridProps> = ({
  data,
  error,
  className = '',
}) => {
  if (error && !data) {
    return (
      <div
        className={`bokengi-kpi-error ${className}`.trim()}
        role="alert"
        aria-live="polite"
      >
        <span>Données indisponibles — {error}</span>
      </div>
    )
  }

  return (
    <section
      className={`bokengi-kpi-grid ${className}`.trim()}
      aria-label="Indicateurs de performance des prospects"
    >
      {KPI_CARDS.map((card) => {
        const hasData = data !== null && data !== undefined
        const value = hasData ? card.getValue(data) : null

        return (
          <article
            key={card.id}
            className={`bokengi-kpi-card ${card.variantClass}`.trim()}
          >
            <div className="bokengi-kpi-card__header">
              <span className="bokengi-kpi-card__label">{card.label}</span>
              <span className="bokengi-kpi-card__badge" aria-hidden="true" />
            </div>

            {hasData && value !== null ? (
              <div className="bokengi-kpi-card__value">
                {value.toLocaleString('fr-FR')}
              </div>
            ) : (
              <div className="bokengi-kpi-card__unavailable">
                Données indisponibles
              </div>
            )}

            <div className="bokengi-kpi-card__subtext">
              {card.subtext}
            </div>
          </article>
        )
      })}
    </section>
  )
}

export default KpiGrid