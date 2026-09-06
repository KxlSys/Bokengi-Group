import React from 'react'
import Link from 'next/link'
import type { ContentOverviewData } from '@/lib/admin/getContentOverview'

export interface ContentOverviewProps {
  data?: ContentOverviewData | null
  error?: string | null
  className?: string
}

export const ContentOverview: React.FC<ContentOverviewProps> = ({
  data,
  error,
  className = '',
}) => {
  return (
    <aside
      className={`bokengi-content-overview-card ${className}`.trim()}
      aria-label="État des contenus et publications"
    >
      <header className="bokengi-content-overview-card__header">
        <div className="bokengi-content-overview-card__title-group">
          <span className="bokengi-content-overview-card__kicker">
            GESTION ÉDITORIALE · CMS
          </span>
          <h2 className="bokengi-content-overview-card__title">État des contenus</h2>
        </div>

        {data && typeof data.totalContent === 'number' ? (
          <span className="bokengi-content-overview-card__total-badge">
            {data.totalContent} {data.totalContent > 1 ? 'éléments' : 'élément'}
          </span>
        ) : null}
      </header>

      {error && !data ? (
        <div className="bokengi-table-state bokengi-table-state--error" role="alert">
          <p className="bokengi-table-state__title">Données indisponibles</p>
          <p className="bokengi-table-state__sub">{error}</p>
        </div>
      ) : !data || !data.items || data.items.length === 0 ? (
        <div className="bokengi-table-state bokengi-table-state--empty">
          <p className="bokengi-table-state__title">Aucun contenu recensé</p>
          <p className="bokengi-table-state__sub">Les collections sont actuellement vides.</p>
        </div>
      ) : (
        <ul className="bokengi-content-list">
          {data.items.map((item) => (
            <li key={item.slug} className="bokengi-content-item">
              <div className="bokengi-content-item__main">
                <span className="bokengi-content-item__count">{item.count}</span>
                <div className="bokengi-content-item__info">
                  <span className="bokengi-content-item__label">{item.label}</span>
                  <span className="bokengi-content-item__sub">
                    {item.count > 0
                      ? `${item.count} ${item.count > 1 ? item.singularLabel + 's' : item.singularLabel} en ligne`
                      : 'Aucun élément enregistré'}
                  </span>
                </div>
              </div>

              <div className="bokengi-content-item__actions">
                <Link
                  href={item.adminUrl}
                  className="bokengi-content-item__btn-view"
                  aria-label={`Accéder à la collection ${item.label}`}
                >
                  Voir
                </Link>
                <Link
                  href={item.createUrl}
                  className="bokengi-content-item__btn-create"
                  aria-label={`Créer un nouvel élément dans ${item.label}`}
                >
                  + Nouveau
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

export default ContentOverview
