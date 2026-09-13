'use client'

import React, { useState } from 'react'
import { useDocumentInfo, useFormFields } from '@payloadcms/ui'

export const ProspectMessageCard: React.FC = () => {
  const { id, initialData } = useDocumentInfo()
  const [copied, setCopied] = useState(false)

  const formValues = useFormFields(([fields]) => ({
    message: fields?.message?.value as string | undefined,
  }))

  const raw = (initialData as any) || {}
  const message = formValues.message || raw.message || ''

  const handleCopy = () => {
    if (!message) return
    navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  // Ne pas afficher de bloc vide lors d'une initialisation sans id ni message
  if (!id && !message) return null

  const charCount = message ? message.length : 0
  const wordCount = message ? message.trim().split(/\s+/).filter(Boolean).length : 0

  return (
    <section className="bokengi-project-brief-card" aria-labelledby="bokengi-project-brief-title">
      <div className="bokengi-project-brief-card__header">
        <div className="bokengi-project-brief-card__title-group">
          <div className="bokengi-project-brief-card__badge-row">
            <span className="bokengi-project-brief-badge">
              🛡️ Message original certifié
            </span>
            <span className="bokengi-project-brief-meta">
              📊 {wordCount} mots · {charCount} caractères
            </span>
          </div>
          <h3 id="bokengi-project-brief-title" className="bokengi-project-brief-card__title">
            Brief Projet · Expression du besoin prospect
          </h3>
          <p className="bokengi-project-brief-card__subtitle">
            Cahier des charges initial et description transmise en ligne par le prospect
          </p>
        </div>

        {message && (
          <button
            type="button"
            onClick={handleCopy}
            className={`bokengi-project-brief-card__copy-btn ${copied ? 'bokengi-project-brief-card__copy-btn--copied' : ''}`}
            aria-label="Copier le texte du brief projet dans le presse-papier"
            title="Copier l'intégralité du message original"
          >
            <span aria-hidden="true">{copied ? '✓' : '📋'}</span>
            <span>{copied ? 'Brief copié !' : 'Copier le message'}</span>
          </button>
        )}
      </div>

      <div
        className="bokengi-project-brief-card__content"
        tabIndex={0}
        role="region"
        aria-label="Texte intégral du brief projet"
      >
        {message ? (
          <div className="bokengi-project-brief-card__text">{message}</div>
        ) : (
          <p className="bokengi-project-brief-card__empty">
            <em>Aucune description textuelle fournie par le prospect.</em>
          </p>
        )}
      </div>

      <div className="bokengi-project-brief-card__footer">
        <span className="bokengi-project-brief-card__immutable-note">
          🔒 Donnée d&apos;expression du besoin originale non modifiable · Audit trail garanti
        </span>
      </div>
    </section>
  )
}

export default ProspectMessageCard
