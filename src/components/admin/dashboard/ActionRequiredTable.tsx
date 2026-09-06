import React from 'react'
import Link from 'next/link'
import type { ActionRequiredLead } from '@/lib/admin/getActionRequiredLeads'

export interface ActionRequiredTableProps {
  leads?: ActionRequiredLead[] | null
  totalCount?: number
  error?: string | null
  className?: string
}

const REQUEST_TYPE_LABELS: Record<string, string> = {
  devis: 'Devis',
  cadrage: 'Cadrage',
  partenariat: 'Partenariat',
  autre: 'Autre',
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  new: { label: 'Nouveau', className: 'bokengi-status-badge--new' },
  contacted: { label: 'Contacté', className: 'bokengi-status-badge--contacted' },
  qualified: { label: 'Qualifié', className: 'bokengi-status-badge--qualified' },
  converted: { label: 'Converti', className: 'bokengi-status-badge--converted' },
  archived: { label: 'Archivé', className: 'bokengi-status-badge--archived' },
}

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return '—'
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Europe/Paris',
    }).format(date)
  } catch {
    return '—'
  }
}

export const ActionRequiredTable: React.FC<ActionRequiredTableProps> = ({
  leads,
  totalCount,
  error,
  className = '',
}) => {
  return (
    <section
      className={`bokengi-action-table-card ${className}`.trim()}
      aria-label="Demandes nécessitant une action"
    >
      <header className="bokengi-action-table-card__header">
        <div className="bokengi-action-table-card__title-group">
          <span className="bokengi-action-table-card__kicker">ACTIONS REQUISES · CRM</span>
          <h2 className="bokengi-action-table-card__title">Demandes à traiter</h2>
        </div>

        <div className="bokengi-action-table-card__actions">
          {typeof totalCount === 'number' && totalCount > 0 ? (
            <span className="bokengi-action-table-card__badge">
              {totalCount} {totalCount > 1 ? 'en attente' : 'en attente'}
            </span>
          ) : leads && leads.length > 0 ? (
            <span className="bokengi-action-table-card__badge">
              {leads.length} {leads.length > 1 ? 'en attente' : 'en attente'}
            </span>
          ) : null}

          <Link
            href="/admin/collections/leads"
            className="bokengi-action-table-card__view-all"
            aria-label="Accéder à la liste complète de tous les leads"
          >
            Tous les prospects →
          </Link>
        </div>
      </header>

      {error && !leads ? (
        <div className="bokengi-table-state bokengi-table-state--error" role="alert">
          <p className="bokengi-table-state__title">Données indisponibles</p>
          <p className="bokengi-table-state__sub">{error}</p>
        </div>
      ) : !leads || leads.length === 0 ? (
        <div className="bokengi-table-state bokengi-table-state--empty">
          <span className="bokengi-table-state__check" aria-hidden="true">✓</span>
          <p className="bokengi-table-state__title">Aucune demande à traiter</p>
          <p className="bokengi-table-state__sub">
            Toutes les demandes de prospects sont actuellement qualifiées ou clôturées.
          </p>
        </div>
      ) : (
        <div className="bokengi-action-table-wrap">
          <table className="bokengi-action-table">
            <thead>
              <tr>
                <th scope="col" className="bokengi-action-table__th bokengi-action-table__th--contact">
                  Demandeur
                </th>
                <th scope="col" className="bokengi-action-table__th bokengi-action-table__th--company">
                  Entreprise
                </th>
                <th scope="col" className="bokengi-action-table__th bokengi-action-table__th--type">
                  Type de sollicitation
                </th>
                <th scope="col" className="bokengi-action-table__th bokengi-action-table__th--status">
                  Statut
                </th>
                <th scope="col" className="bokengi-action-table__th bokengi-action-table__th--date">
                  Date
                </th>
                <th scope="col" className="bokengi-action-table__th bokengi-action-table__th--action">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const statusInfo = STATUS_CONFIG[lead.status] || {
                  label: lead.status,
                  className: 'bokengi-status-badge--default',
                }
                const requestLabel = REQUEST_TYPE_LABELS[lead.requestType] || lead.requestType
                const fullName = `${lead.firstname} ${lead.lastname}`.trim() || 'Prospect inconnu'

                return (
                  <tr key={lead.id} className="bokengi-action-table__row">
                    <td className="bokengi-action-table__td bokengi-action-table__td--contact">
                      <div className="bokengi-action-table__contact">
                        <span className="bokengi-action-table__name">{fullName}</span>
                        {lead.email ? (
                          <span className="bokengi-action-table__email">{lead.email}</span>
                        ) : null}
                      </div>
                    </td>

                    <td className="bokengi-action-table__td bokengi-action-table__td--company">
                      <span className="bokengi-action-table__company">
                        {lead.company ? (
                          lead.company
                        ) : (
                          <span className="bokengi-action-table__muted">—</span>
                        )}
                      </span>
                    </td>

                    <td className="bokengi-action-table__td bokengi-action-table__td--type">
                      <span className="bokengi-action-table__type-pill">{requestLabel}</span>
                    </td>

                    <td className="bokengi-action-table__td bokengi-action-table__td--status">
                      <span className={`bokengi-status-badge ${statusInfo.className}`}>
                        <span className="bokengi-status-badge__dot" aria-hidden="true" />
                        <span>{statusInfo.label}</span>
                      </span>
                    </td>

                    <td className="bokengi-action-table__td bokengi-action-table__td--date">
                      <time
                        className="bokengi-action-table__date"
                        dateTime={lead.createdAt}
                      >
                        {formatDate(lead.createdAt)}
                      </time>
                    </td>

                    <td className="bokengi-action-table__td bokengi-action-table__td--action">
                      <Link
                        href={`/admin/collections/leads/${lead.id}`}
                        className="bokengi-action-table__btn"
                        aria-label={`Traiter la demande de ${fullName}`}
                      >
                        Traiter →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default ActionRequiredTable
