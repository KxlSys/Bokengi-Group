import React from 'react';
import Terminal from './Terminal';

const Hero = ({ onOpenContact }) => {
  const handleScrollToServices = (e) => {
    e.preventDefault();
    const element = document.getElementById('services');
    if (element) window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-left">
        <p className="hero-eyebrow">Bokengi Group · Technologie · Services</p>
        <h1>Construire. <em>Protéger.</em> Développer.</h1>
        <p className="hero-sub">
          Bokengi Group accompagne les entreprises, organisations et entrepreneurs dans leurs projets technologiques, numériques et professionnels — de l'infrastructure IT à la cybersécurité, du développement web au support opérationnel.
        </p>
        <div className="hero-actions">
          <button onClick={onOpenContact} className="btn-primary">Demander un devis</button>
          <a href="#services" onClick={handleScrollToServices} className="btn-ghost">Nos expertises</a>
        </div>
      </div>
      <div className="hero-right">
        <div className="hero-grid-bg"></div>
        <div className="hero-brand-card">
          <img src="/bokengi-mark.svg" alt="Bokengi Group" className="hero-brand-mark" />
          <div>
            <span className="hero-brand-kicker">BOKENGI GROUP</span>
            <strong>Technology & Business Services</strong>
            <span>Europe · Afrique · Remote</span>
          </div>
        </div>
        <Terminal />
        <div className="hero-stats">
          <div className="stat"><span className="stat-val">5</span><span className="stat-lbl">Pôles d'expertise</span></div>
          <div className="stat"><span className="stat-val">360°</span><span className="stat-lbl">Accompagnement</span></div>
          <div className="stat"><span className="stat-val">100%</span><span className="stat-lbl">Sur mesure</span></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
