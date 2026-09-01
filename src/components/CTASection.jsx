import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = ({
  title = "Un projet en tête ?",
  text = "Parlons de votre besoin et construisons une solution adaptée à vos objectifs.",
  primaryLabel = "Demander un devis",
  primaryTo = "/contact?type=devis",
  secondaryLabel = "Nous contacter",
  secondaryTo = "/contact",
  pole
}) => {
  const finalPrimaryTo = pole ? `/contact?type=devis&pole=${pole}` : primaryTo;
  const finalSecondaryTo = pole ? `/contact?pole=${pole}` : secondaryTo;

  return (
    <section className="section-cta-v4">
      <div className="container-v4">
        <div className="cta-v4-box">
          <span className="kicker-v4" style={{ justifyContent: 'center' }}>
            BOKENGI GROUP · ENGAGEMENT PROFESSIONNEL
          </span>
          <h2 className="cta-v4-title">{title}</h2>
          <p className="cta-v4-lead">{text}</p>
          <div className="cta-v4-actions">
            <Link to={finalPrimaryTo} className="btn-v4-primary">{primaryLabel}</Link>
            <Link to={finalSecondaryTo} className="btn-v4-secondary">{secondaryLabel}</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
