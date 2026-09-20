'use client'

import React from 'react'
import { Kicker } from './Kicker'
import { useI18n } from '@/i18n'

export const GroupeSectionV4: React.FC = () => {
  const { t } = useI18n()

  return (
    <section className="section-groupe-v4">
      <div className="container-v4">
        <div className="groupe-v4-grid">
          <div>
            <Kicker>{t.home.groupKicker}</Kicker>
            <h2 className="groupe-v4-title">{t.home.groupTitle}</h2>
            <p className="groupe-v4-text">
              {t.home.groupText1}
            </p>
            <p className="groupe-v4-text">
              {t.home.groupText2}
            </p>
          </div>

          <div className="groupe-v4-right-art">
            <div className="groupe-art-word">TECHNOLOGY</div>
            <div className="groupe-art-plus">+</div>
            <div className="groupe-art-word accent">SERVICES</div>
            <div className="groupe-art-plus">+</div>
            <div className="groupe-art-word">EXPERTISE</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GroupeSectionV4
