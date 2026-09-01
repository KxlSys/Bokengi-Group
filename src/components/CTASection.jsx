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
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content">
          <span className="cta-eyebrow">Bokengi Group · Prise de contact</span>
          <h2 className="cta-title">{title}</h2>
          <p className="cta-text">{text}</p>
          <div className="cta-actions">
            <Link to={finalPrimaryTo} className="btn-primary">{primaryLabel}</Link>
            <Link to={finalSecondaryTo} className="btn-ghost">{secondaryLabel}</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
