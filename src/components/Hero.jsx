import React from 'react';
import Terminal from './Terminal';

const Hero = ({ onOpenContact }) => {
  const handleScrollToServices = (e) => {
    e.preventDefault();
    const element = document.getElementById('services');
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-left">
        <p className="hero-eyebrow">Freelance · Ingénieur informatique</p>
        <h1>Votre <em>transformation</em> numérique mérite l'excellence.</h1>
        <p className="hero-sub">Chez Kal-Cooperation, la distance n'est jamais un frein à la qualité technique. J'accompagne les PME et entrepreneurs dans la sécurisation et le développement de leur écosystème digital.</p>
        <div className="hero-actions">
          <button onClick={onOpenContact} className="btn-primary">Lancer le projet</button>
          <a href="#services" onClick={handleScrollToServices} className="btn-ghost">Mes services</a>
        </div>
      </div>
      <div className="hero-right">
        <div className="hero-grid-bg"></div>
        <Terminal />
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-val">99.9%</span>
            <span className="stat-lbl">Disponibilité</span>
          </div>
          <div className="stat">
            <span className="stat-val">3</span>
            <span className="stat-lbl">Expertises</span>
          </div>
          <div className="stat">
            <span className="stat-val">∞</span>
            <span className="stat-lbl">Sans frontières</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
