'use client'

import React from 'react'

export const SidebarTreatmentHeader: React.FC = () => {
  return (
    <div className="bokengi-treatment-sidebar-header">
      <div className="bokengi-treatment-sidebar-header__badge">
        <span>⚙️</span> Traitement Interne
      </div>
      <h3 className="bokengi-treatment-sidebar-header__title">
        Suivi Commercial Bokengi
      </h3>
      <p className="bokengi-treatment-sidebar-header__subtitle">
        Affectation opérationnelle & actions de l'équipe
      </p>
    </div>
  )
}

export default SidebarTreatmentHeader
