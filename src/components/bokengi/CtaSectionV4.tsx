import React from 'react'
import Link from 'next/link'
import { Kicker } from './Kicker'

export const CtaSectionV4: React.FC = () => {
  return (
    <section className="section-cta-v4">
      <div className="container-v4">
        <div className="cta-v4-box">
          <div className="pattern-dotted-radial-right" aria-hidden="true" />
          <Kicker style={{ justifyContent: 'center' }}>
            BOKENGI GROUP · ENGAGEMENT PROFESSIONNEL
          </Kicker>
          <h2 className="cta-v4-title">
            Construisons une infrastructure solide pour votre organisation.
          </h2>
          <p className="cta-v4-lead">
            Discutons de vos besoins technologiques, digitaux ou opérationnels afin de structurer une solution sur mesure.
          </p>
          <div className="cta-v4-actions">
            <Link href="/contact?type=devis" className="btn-v4-primary">
              Demander un devis →
            </Link>
            <Link href="/contact" className="btn-v4-secondary">
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaSectionV4
