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
        <p className="hero-eyebrow">Bokengi · Startup Technologique & Services d'Entreprise</p>
        <h1>Propulsez votre structure vers la <em>performance</em>.</h1>
        <p className="hero-sub">De l'ingénierie informatique de pointe (Services IT) à la gestion administrative et l'accompagnement stratégique (Bokengi-Group), nous concevons des solutions sur mesure.</p>
        <div className="hero-actions">
          <button onClick={onOpenContact} className="btn-primary">Nous contacter</button>
          <a href="#services" onClick={handleScrollToServices} className="btn-ghost">Nos services</a>
        </div>
      </div>
      <div className="hero-right">
        <div className="hero-grid-bg"></div>
        <Terminal />
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-val">2</span>
            <span className="stat-lbl">Pôles d'activité</span>
          </div>
          <div className="stat">
            <span className="stat-val">99.9%</span>
            <span className="stat-lbl">Disponibilité</span>
          </div>
          <div className="stat">
            <span className="stat-val">100%</span>
            <span className="stat-lbl">Sur-mesure</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
