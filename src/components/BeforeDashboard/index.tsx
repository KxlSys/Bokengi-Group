import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass} style={{ marginBottom: '2rem' }}>
      <Banner className={`${baseClass}__banner`} type="info">
        <h4>Bokengi Group 2.0 — Administration Payload</h4>
      </Banner>
      <p style={{ marginTop: '1rem', color: '#64748B' }}>
        Socle technique initialisé avec succès. Collections métier (Pôles, Services, Réalisations, Leads) prêtes pour la Phase 2.
      </p>
    </div>
  )
}

export default BeforeDashboard
