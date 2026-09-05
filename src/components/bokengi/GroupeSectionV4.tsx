import React from 'react'
import { Kicker } from './Kicker'

export const GroupeSectionV4: React.FC = () => {
  return (
    <section className="section-groupe-v4">
      <div className="container-v4">
        <div className="groupe-v4-grid">
          <div>
            <Kicker>LE GROUPE</Kicker>
            <h2 className="groupe-v4-title">Une même vision. Plusieurs expertises.</h2>
            <p className="groupe-v4-text">
              Bokengi Group rassemble des compétences technologiques, numériques et professionnelles au sein d&apos;une même structure, afin d&apos;accompagner les organisations dans leurs projets.
            </p>
            <p className="groupe-v4-text">
              Fondé sur l&apos;exigence technique et la rigueur méthodologique, notre modèle intègre la cybersécurité, l&apos;ingénierie logicielle et le support opérationnel pour apporter des solutions fiables et durables.
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
