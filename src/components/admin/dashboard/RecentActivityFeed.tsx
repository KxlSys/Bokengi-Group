import React from 'react'
import Link from 'next/link'
import type { RecentActivityItem } from '@/lib/admin/getRecentActivity'

export interface RecentActivityFeedProps {
  activities?: RecentActivityItem[] | null
  error?: string | null
  className?: string
}

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string; dotClass: string }> = {
  new: {
    label: 'Nouveau',
    badgeClass: 'bokengi-status-badge--new',
    dotClass: 'bokengi-activity-item__dot--new',
  },
  contacted: {
    label: 'Contacté',
    badgeClass: 'bokengi-status-badge--contacted',
    dotClass: 'bokengi-activity-item__dot--contacted',
  },
  qualified: {
    label: 'Qualifié',
    badgeClass: 'bokengi-status-badge--qualified',
    dotClass: 'bokengi-activity-item__dot--qualified',
  },
  converted: {
    label: 'Converti',
    badgeClass: 'bokengi-status-badge--converted',
    dotClass: 'bokengi-activity-item__dot--converted',
  },
  archived: {
    label: 'Archivé',
    badgeClass: 'bokengi-status-badge--archived',
    dotClass: 'bokengi-activity-item__dot--archived',
  },
}

function formatActivityDate(isoString: string): string {
  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return '—'
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Paris',
    }).format(date)
  } catch {
    return '—'
  }
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  activities,
  error,
  className = '',
}) => {
  return (
    <aside
      className={`bokengi-activity-card ${className}`.trim()}
      aria-label="Flux des demandes récentes"
    >
      <header className="bokengi-activity-card__header">
        <div className="bokengi-activity-card__title-group">
          <span className="bokengi-activity-card__kicker">FLUX CRM · RÉCENT</span>
          <h2 className="bokengi-activity-card__title">Demandes récentes</h2>
        </div>

        <Link
          href="/admin/collections/leads"
          className="bokengi-activity-card__header-link"
          aria-label="Accéder au journal de toutes les demandes"
        >
          Tous les leads →
        </Link>
      </header>

      {error && !activities ? (
        <div className="bokengi-table-state bokengi-table-state--error" role="alert">
          <p className="bokengi-table-state__title">Données indisponibles</p>
          <p className="bokengi-table-state__sub">{error}</p>
        </div>
      ) : !activities || activities.length === 0 ? (
        <div className="bokengi-table-state bokengi-table-state--empty">
          <span className="bokengi-table-state__check" aria-hidden="true">✓</span>
          <p className="bokengi-table-state__title">Aucune demande récente</p>
          <p className="bokengi-table-state__sub">
            Aucune sollicitation de prospect enregistrée pour l’instant.
          </p>
        </div>
      ) : (
        <div className="bokengi-activity-list-wrap">
          <ol className="bokengi-activity-list">
            {activities.map((item) => {
              const statusInfo = STATUS_CONFIG[item.status] || {
                label: item.statusLabel,
                badgeClass: 'bokengi-status-badge--default',
                dotClass: '',
              }
              const fullName = `${item.firstname} ${item.lastname}`.trim() || 'Prospect inconnu'

              return (
                <li key={item.id} className="bokengi-activity-item">
                  <div
                    className={`bokengi-activity-item__dot ${statusInfo.dotClass}`}
                    aria-hidden="true"
                  />

                  <div className="bokengi-activity-item__body">
                    <div className="bokengi-activity-item__top">
                      <span className="bokengi-activity-item__name">{fullName}</span>
                      <time
                        className="bokengi-activity-item__date"
                        dateTime={item.createdAt}
                      >
                        {formatActivityDate(item.createdAt)}
                      </time>
                    </div>

                    <div className="bokengi-activity-item__meta">
                      <span className="bokengi-activity-item__type">
                        {item.requestTypeLabel}
                      </span>

                      {item.company ? (
                        <>
                          <span className="bokengi-activity-item__sep">·</span>
                          <span className="bokengi-activity-item__company">
                            {item.company}
                          </span>
                        </>
                      ) : null}
                    </div>

                    <div className="bokengi-activity-item__footer">
                      <span className={`bokengi-status-badge ${statusInfo.badgeClass}`}>
                        <span className="bokengi-status-badge__dot" aria-hidden="true" />
                        <span>{statusInfo.label}</span>
                      </span>

                      <Link
                        href={item.leadUrl}
                        className="bokengi-activity-item__link"
                        aria-label={`Consulter la demande de ${fullName}`}
                      >
                        Consulter →
                      </Link>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </aside>
  )
}

export default RecentActivityFeed
