import React from 'react'
import Link from 'next/link'

export interface QuickActionItem {
  id: string
  title: string
  description: string
  href: string
  badge: string
}

const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: 'leads',
    title: 'Prospects (CRM)',
    description: 'Traiter les nouvelles sollicitations',
    href: '/admin/collections/leads',
    badge: 'Commercial',
  },
  {
    id: 'posts',
    title: 'Publier un article',
    description: "Rédiger une publication d'expertise",
    href: '/admin/collections/posts/create',
    badge: 'Éditorial',
  },
  {
    id: 'case-studies',
    title: 'Nouvelle réalisation',
    description: 'Documenter une étude de cas client',
    href: '/admin/collections/case-studies/create',
    badge: 'Projets',
  },
  {
    id: 'media',
    title: 'Médiathèque',
    description: 'Téléverser des actifs et documents',
    href: '/admin/collections/media/create',
    badge: 'Fichiers',
  },
  {
    id: 'invoices',
    title: 'Factures & Devis',
    description: 'Émettre ou consulter les pièces comptables',
    href: '/admin/collections/invoices',
    badge: 'Finance',
  },
]

export interface QuickActionBarProps {
  className?: string
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({ className = '' }) => {
  return (
    <section
      className={`bokengi-quick-action-card ${className}`.trim()}
      aria-label="Actions rapides du Command Center"
    >
      <header className="bokengi-quick-action-card__header">
        <div className="bokengi-quick-action-card__title-group">
          <span className="bokengi-quick-action-card__kicker">
            ACCÈS RAPIDE · RACCOURCIS
          </span>
          <h2 className="bokengi-quick-action-card__title">Actions rapides</h2>
        </div>
        <span className="bokengi-quick-action-card__subtitle">
          Accès direct aux modules opérationnels
        </span>
      </header>

      <div className="bokengi-quick-action-grid">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className="bokengi-quick-action-item"
            aria-label={`${action.title} — ${action.description}`}
          >
            <div className="bokengi-quick-action-item__header">
              <span className="bokengi-quick-action-item__badge">{action.badge}</span>
              <span className="bokengi-quick-action-item__arrow" aria-hidden="true">
                →
              </span>
            </div>
            <h3 className="bokengi-quick-action-item__title">{action.title}</h3>
            <p className="bokengi-quick-action-item__desc">{action.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default QuickActionBar
