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

const POLE_LABELS: Record<string, string> = {
  it: 'Bokengi IT',
  digital: 'Bokengi Digital',
  business: 'Bokengi Business',
  consulting: 'Bokengi Consulting',
  events: 'Bokengi Events',
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
    treatmentPole: fields?.treatmentPole?.value as string | undefined,
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
  let requestedPoleLabel = 'Non spécifié'
  if (raw.pole && typeof raw.pole === 'object' && 'name' in raw.pole) {
    requestedPoleLabel = String((raw.pole as any).name)
  } else if (raw.pole) {
    const poleMap: Record<string, string> = {
      '1': 'Bokengi IT',
      '2': 'Bokengi Digital',
      '3': 'Bokengi Business',
      '4': 'Bokengi Consulting',
      '5': 'Bokengi Events',
      ...POLE_LABELS,
    }
    requestedPoleLabel = poleMap[String(raw.pole)] || `Pôle #${raw.pole}`
  }

  // Pôle de traitement opérationnel (modifiable par l'équipe)
  const currentTreatmentPoleKey = formValues.treatmentPole || raw.treatmentPole || raw.treatment_pole
  const treatmentPoleLabel = currentTreatmentPoleKey
    ? POLE_LABELS[String(currentTreatmentPoleKey)] || String(currentTreatmentPoleKey)
    : null

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
