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
    <section className="cta-v2-section">
      <div className="container-v2">
        <div className="cta-v2-box">
          <span className="kicker-v2" style={{ color: 'var(--blue-glow)', justifyContent: 'center' }}>
            Bokengi Group · Engagement Professionnel
          </span>
          <h2 className="cta-v2-title">{title}</h2>
          <p className="cta-v2-lead">{text}</p>
          <div className="cta-v2-actions">
            <Link to={finalPrimaryTo} className="btn-v2-primary">{primaryLabel}</Link>
            <Link to={finalSecondaryTo} className="btn-v2-ghost">{secondaryLabel}</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
