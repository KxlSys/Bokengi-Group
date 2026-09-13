'use client'

import React, { useState } from 'react'
import { useDocumentInfo, useFormFields } from '@payloadcms/ui'

const REQUEST_TYPE_LABELS: Record<string, string> = {
  devis: 'Demande de devis commercial',
  cadrage: 'Cadrage de projet stratégique',
  partenariat: 'Partenariat institutionnel',
  autre: 'Autre sollicitation',
}

export const ProspectInfoCard: React.FC = () => {
  const { id, initialData } = useDocumentInfo()
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const formValues = useFormFields(([fields]) => ({
    firstname: fields?.firstname?.value as string | undefined,
    lastname: fields?.lastname?.value as string | undefined,
    company: fields?.company?.value as string | undefined,
    email: fields?.email?.value as string | undefined,
    phone: fields?.phone?.value as string | undefined,
    requestType: fields?.requestType?.value as string | undefined,
    source: fields?.source?.value as string | undefined,
  }))

  const raw = (initialData as any) || {}

  const firstname = formValues.firstname || raw.firstname || ''
  const lastname = formValues.lastname || raw.lastname || ''
  const fullName = `${firstname} ${lastname}`.trim() || 'Non renseigné'
  const company = formValues.company || raw.company || 'Particulier / Non renseigné'
  const email = formValues.email || raw.email || ''
  const phone = formValues.phone || raw.phone || ''
  const requestType = formValues.requestType || raw.requestType || 'devis'
  const source = formValues.source || raw.source || 'website'

  let poleName = 'Général / Non spécifié'
  if (raw.pole && typeof raw.pole === 'object' && 'name' in raw.pole) {
    poleName = String((raw.pole as any).name)
  } else if (raw.pole) {
    const poleMap: Record<string, string> = {
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
    poleName = poleMap[String(raw.pole)] || `Pôle #${raw.pole}`
  }

  const handleCopy = (val: string, key: string) => {
    if (!val) return
    navigator.clipboard.writeText(val)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  if (!id && !email) return null

  const cleanPhone = phone ? phone.replace(/[^\d+]/g, '') : ''

  return (
    <section className="bokengi-prospect-info-card" aria-label="Coordonnées certifiées du prospect">
      <div className="bokengi-prospect-info-card__header">
        <div>
          <h3 className="bokengi-prospect-info-card__title">
            📋 Coordonnées certifiées du prospect
          </h3>
          <p className="bokengi-prospect-info-card__subtitle">
            Données d&apos;identité et de contact transmises par le demandeur
          </p>
        </div>
        <span className="bokengi-prospect-message-card__badge">
          🔒 Données originales immuables
        </span>
      </div>

      <div className="bokengi-prospect-info-grid">
        {/* Identité */}
        <div className="bokengi-prospect-info-field">
          <span className="bokengi-prospect-info-field__label">Identité du contact</span>
          <div className="bokengi-prospect-info-field__value-row">
            <span className="bokengi-prospect-info-field__main-val">{fullName}</span>
            {fullName !== 'Non renseigné' && (
              <button
                type="button"
                onClick={() => handleCopy(fullName, 'name')}
                className="bokengi-contact-action-btn bokengi-contact-action-btn--copy"
                title="Copier le nom complet"
              >
                {copiedKey === 'name' ? '✓ Nom copié' : '📋 Copier'}
              </button>
            )}
          </div>
        </div>

        {/* Organisation */}
        <div className="bokengi-prospect-info-field">
          <span className="bokengi-prospect-info-field__label">Organisation / Entreprise</span>
          <div className="bokengi-prospect-info-field__value-row">
            <span className="bokengi-prospect-info-field__main-val">{company}</span>
            {company !== 'Particulier / Non renseigné' && (
              <button
                type="button"
                onClick={() => handleCopy(company, 'company')}
                className="bokengi-contact-action-btn bokengi-contact-action-btn--copy"
                title="Copier le nom de l'organisation"
              >
                {copiedKey === 'company' ? '✓ Entreprise copiée' : '📋 Copier'}
              </button>
            )}
          </div>
        </div>

        {/* Email avec mailto & copie rapide */}
        <div className="bokengi-prospect-info-field">
          <span className="bokengi-prospect-info-field__label">Adresse e-mail professionnelle</span>
          <div className="bokengi-prospect-info-field__value-row">
            {email ? (
              <>
                <span className="bokengi-prospect-info-field__main-val bokengi-prospect-info-field__main-val--mono">
                  {email}
                </span>
                <div className="bokengi-prospect-actions-group">
                  <a
                    href={`mailto:${email}`}
                    className="bokengi-contact-action-btn bokengi-contact-action-btn--primary"
                    title={`Envoyer un email à ${email}`}
                  >
                    ✉️ Envoyer un email
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(email, 'email')}
                    className="bokengi-contact-action-btn bokengi-contact-action-btn--copy"
                    title="Copier l'adresse email"
                  >
                    {copiedKey === 'email' ? '✓ Email copié' : '📋 Copier'}
                  </button>
                </div>
              </>
            ) : (
              <span className="bokengi-prospect-info-field__empty">Non renseignée</span>
            )}
          </div>
        </div>

        {/* Téléphone avec appel direct & copie rapide */}
        <div className="bokengi-prospect-info-field">
          <span className="bokengi-prospect-info-field__label">Numéro de téléphone</span>
          <div className="bokengi-prospect-info-field__value-row">
            {phone ? (
              <>
                <span className="bokengi-prospect-info-field__main-val bokengi-prospect-info-field__main-val--mono">
                  {phone}
                </span>
                <div className="bokengi-prospect-actions-group">
                  <a
                    href={`tel:${cleanPhone}`}
                    className="bokengi-contact-action-btn bokengi-contact-action-btn--primary"
                    title={`Composer le numéro ${phone}`}
                  >
                    📞 Appeler
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(phone, 'phone')}
                    className="bokengi-contact-action-btn bokengi-contact-action-btn--copy"
                    title="Copier le numéro de téléphone"
                  >
                    {copiedKey === 'phone' ? '✓ Numéro copié' : '📋 Copier'}
                  </button>
                </div>
              </>
            ) : (
              <span className="bokengi-prospect-info-field__empty">Non renseigné</span>
            )}
          </div>
        </div>

        {/* Pôle d'expertise demandé */}
        <div className="bokengi-prospect-info-field">
          <span className="bokengi-prospect-info-field__label">
            Pôle d&apos;expertise demandé par le prospect
          </span>
          <div className="bokengi-prospect-info-field__value-row">
            <span className="bokengi-prospect-pole-badge">{poleName}</span>
            <span className="bokengi-prospect-tag-initial">Choix initial</span>
          </div>
        </div>

        {/* Origine & Type */}
        <div className="bokengi-prospect-info-field">
          <span className="bokengi-prospect-info-field__label">Type de sollicitation & Origine</span>
          <div className="bokengi-prospect-info-field__value-row">
            <span className="bokengi-prospect-type-badge">
              {REQUEST_TYPE_LABELS[requestType] || requestType}
            </span>
            <span className="bokengi-prospect-source-badge" title={`Origine technique : ${source}`}>
              🌐 {source === 'website' || source === 'website-contact-form' ? 'Site Web Bokengi' : source}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProspectInfoCard
