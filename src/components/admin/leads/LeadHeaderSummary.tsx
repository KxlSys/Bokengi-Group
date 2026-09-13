'use client'

import React from 'react'
import { useDocumentInfo, useFormFields } from '@payloadcms/ui'
import { LeadStatusCell } from './LeadStatusCell'
import { LeadPriorityCell } from './LeadPriorityCell'

const REQUEST_TYPE_LABELS: Record<string, string> = {
  devis: 'Demande de devis',
  cadrage: 'Cadrage de projet',
  partenariat: 'Partenariat institutionnel',
  autre: 'Autre sollicitation',
}

const POLE_NAME_BY_ID_OR_SLUG: Record<string, string> = {
  '1': 'Bokengi IT',
  '2': 'Bokengi Digital',
  '3': 'Bokengi Business',
  '4': 'Bokengi Consulting',
  '5': 'Bokengi Events',
  it: 'Bokengi IT',
  digital: 'Bokengi Digital',
  business: 'Bokengi Business',
  consulting: 'Bokengi Consulting',
  events: 'Bokengi Events',
}

function resolvePoleLabel(rawVal: unknown): string | null {
  if (!rawVal) return null
  if (typeof rawVal === 'object' && rawVal !== null) {
    if ('name' in rawVal && typeof (rawVal as any).name === 'string') {
      return (rawVal as any).name
    }
    if ('title' in rawVal && typeof (rawVal as any).title === 'string') {
      return (rawVal as any).title
    }
    if ('slug' in rawVal && typeof (rawVal as any).slug === 'string') {
      const slug = (rawVal as any).slug
      return POLE_NAME_BY_ID_OR_SLUG[slug] || slug
    }
    if ('id' in rawVal) {
      const idStr = String((rawVal as any).id)
      return POLE_NAME_BY_ID_OR_SLUG[idStr] || null
    }
  }
  const key = String(rawVal).trim()
  if (!key) return null
  return POLE_NAME_BY_ID_OR_SLUG[key] || null
}

function formatDate(isoDate?: string | null): string {
  if (!isoDate) return 'En cours de réception'
  try {
    const d = new Date(isoDate)
    if (isNaN(d.getTime())) return String(isoDate)
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Paris',
    }).format(d)
  } catch {
    return String(isoDate)
  }
}

export const LeadHeaderSummary: React.FC = () => {
  const { id, initialData } = useDocumentInfo()

  const formValues = useFormFields(([fields]) => ({
    firstname: fields?.firstname?.value as string | undefined,
    lastname: fields?.lastname?.value as string | undefined,
    company: fields?.company?.value as string | undefined,
    requestType: fields?.requestType?.value as string | undefined,
    status: fields?.status?.value as string | undefined,
    priority: fields?.priority?.value as string | undefined,
    treatmentPole: fields?.treatmentPole?.value as unknown,
  }))

  const raw = (initialData as any) || {}

  const firstname = formValues.firstname || raw.firstname || ''
  const lastname = formValues.lastname || raw.lastname || ''
  const fullName = `${firstname} ${lastname}`.trim() || 'Prospect inconnu'
  const company = formValues.company || raw.company || 'Particulier / Non renseigné'
  const requestType = formValues.requestType || raw.requestType || 'devis'
  const requestTypeLabel = REQUEST_TYPE_LABELS[requestType] || requestType

  const status = formValues.status || raw.status || 'new'
  const priority = formValues.priority || raw.priority || 'medium'
  const createdAt = raw.createdAt || (raw as any)?.created_at

  // Pôle demandé par le prospect (initial, immuable)
  const requestedPoleLabel = resolvePoleLabel(raw.pole) || 'Non spécifié'

  // Pôle de traitement opérationnel (relationnel, modifiable par l'équipe)
  const currentTreatmentPoleVal = formValues.treatmentPole ?? raw.treatmentPole ?? (raw as any)?.treatment_pole
  const treatmentPoleLabel = resolvePoleLabel(currentTreatmentPoleVal)

  // Ne pas afficher un en-tête vide lors d'une création à blanc si aucun id
  if (!id && !firstname) return null

  return (
    <div className="bokengi-lead-summary-card" role="region" aria-label="Synthèse CRM du Lead">
      <div className="bokengi-lead-summary-card__header">
        <div className="bokengi-lead-summary-card__title-group">
          <span className="bokengi-lead-summary-card__kicker">
            DOSSIER PROJET {id ? `#${id}` : ''} · CONSULTATION CRM BOKENGI
          </span>
          <h2 className="bokengi-lead-summary-card__prospect">
            {fullName} {company && company !== 'Particulier / Non renseigné' ? `— ${company}` : ''}
          </h2>
        </div>

        <div className="bokengi-lead-summary-card__badges">
          <LeadStatusCell cellData={status} />
          <LeadPriorityCell cellData={priority} />
        </div>
      </div>

      {/* Grille des 8 indicateurs clés CRM */}
      <div className="bokengi-lead-summary-grid bokengi-lead-summary-grid--8kpi">
        {/* 1. Nom du prospect */}
        <div className="bokengi-lead-summary-item">
          <span className="bokengi-lead-summary-item__label">1. Nom du prospect</span>
          <span className="bokengi-lead-summary-item__value">{fullName}</span>
        </div>

        {/* 2. Organisation / Entreprise */}
        <div className="bokengi-lead-summary-item">
          <span className="bokengi-lead-summary-item__label">2. Organisation</span>
          <span className="bokengi-lead-summary-item__value">{company}</span>
        </div>

        {/* 3. Type de projet */}
        <div className="bokengi-lead-summary-item">
          <span className="bokengi-lead-summary-item__label">3. Type de projet</span>
          <span className="bokengi-lead-summary-item__value">{requestTypeLabel}</span>
        </div>

        {/* 4. Pôle demandé (prospect) */}
        <div className="bokengi-lead-summary-item">
          <span className="bokengi-lead-summary-item__label">4. Pôle demandé (prospect)</span>
          <span className="bokengi-lead-summary-item__value">
            <span className="bokengi-summary-pole-tag bokengi-summary-pole-tag--initial">
              {requestedPoleLabel}
            </span>
          </span>
        </div>

        {/* 5. Pôle de traitement */}
        <div className="bokengi-lead-summary-item">
          <span className="bokengi-lead-summary-item__label">5. Pôle de traitement</span>
          <span className="bokengi-lead-summary-item__value">
            {treatmentPoleLabel ? (
              <span className="bokengi-summary-pole-tag bokengi-summary-pole-tag--treatment">
                ⚙️ {treatmentPoleLabel}
              </span>
            ) : (
              <span className="bokengi-summary-pole-tag bokengi-summary-pole-tag--unassigned">
                À affecter
              </span>
            )}
          </span>
        </div>

        {/* 6. Statut actuel */}
        <div className="bokengi-lead-summary-item">
          <span className="bokengi-lead-summary-item__label">6. Statut actuel</span>
          <div className="bokengi-lead-summary-item__value" style={{ marginTop: '0.15rem' }}>
            <LeadStatusCell cellData={status} />
          </div>
        </div>

        {/* 7. Priorité */}
        <div className="bokengi-lead-summary-item">
          <span className="bokengi-lead-summary-item__label">7. Priorité actuelle</span>
          <div className="bokengi-lead-summary-item__value" style={{ marginTop: '0.15rem' }}>
            <LeadPriorityCell cellData={priority} />
          </div>
        </div>

        {/* 8. Date et heure de réception */}
        <div className="bokengi-lead-summary-item">
          <span className="bokengi-lead-summary-item__label">8. Date de réception</span>
          <span className="bokengi-lead-summary-item__value bokengi-lead-summary-item__value--date">
            📅 {formatDate(createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default LeadHeaderSummary
