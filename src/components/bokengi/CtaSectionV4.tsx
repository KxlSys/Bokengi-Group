'use client'

import React from 'react'
import Link from 'next/link'
import { Kicker } from './Kicker'
import { useI18n } from '@/i18n/context'

export const CtaSectionV4: React.FC = () => {
  const { t, getHref } = useI18n()

  return (
    <section className="section-cta-v4">
      <div className="container-v4">
        <div className="cta-v4-box">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <Kicker style={{ justifyContent: 'center' }}>
            {t.home.ctaKicker}
          </Kicker>
          <h2 className="cta-v4-title">
            {t.home.ctaTitle}
          </h2>
          <p className="cta-v4-lead">
            {t.home.ctaLead}
          </p>
          <div className="cta-v4-actions">
            <Link href={getHref('/contact?type=devis')} className="btn-v4-primary">
              {t.home.ctaBtnPrimary} →
            </Link>
            <Link href={getHref('/contact')} className="btn-v4-secondary">
              {t.home.ctaBtnSecondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaSectionV4
