import React from 'react';

const Services = () => {
  const skills = [
    "Développement Web", "Applications Mobiles", "Maintenance Informatique", "Cybersécurité", 
    "Audit Système", "Configuration VPN", "Cloud AWS · Azure · GCP", "Docker & Kubernetes", 
    "Automatisation Métier", "No-Code / Low-Code", "Administration Réseau", "Support Technique", 
    "Virtualisation", "Intégrations API"
  ];

  return (
    <>
      <section id="services">
        <div className="section-header">
          <span className="section-label" data-num="01">Services</span>
          <h2>Ce que je construis<br/>pour vous.</h2>
        </div>
        <div className="services-grid">

          <div className="service-card fade-up">
            <div className="service-icon">
              <div className="service-icon-symbol">
                <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              </div>
              Full-Stack
            </div>
            <h3>Développement Full-Stack</h3>
            <p className="service-desc">Maîtrise des langages modernes et des outils No-code pour une mise sur le marché rapide et fiable.</p>
            <ul className="service-items">
              <li>Applications Web & Mobiles</li>
              <li>Automatisation de processus métier</li>
              <li>Intégrations API & connecteurs</li>
            </ul>
          </div>

          <div className="service-card fade-up" style={{ transitionDelay: '0.12s' }}>
            <div className="service-icon">
              <div className="service-icon-symbol">
                <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              Cybersécurité
            </div>
            <h3>Cybersécurité & Réseaux</h3>
            <p className="service-desc">Votre infrastructure est le cœur de votre métier. Je la protège avec rigueur et expertise.</p>
            <ul className="service-items">
              <li>Audit et durcissement système</li>
              <li>Configuration VPN sécurisée</li>
              <li>Gestion des accès distants</li>
            </ul>
          </div>

          <div className="service-card fade-up" style={{ transitionDelay: '0.24s' }}>
            <div className="service-icon">
              <div className="service-icon-symbol">
                <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              Systèmes
            </div>
            <h3>Administration Systèmes</h3>
            <p className="service-desc">Garantir une disponibilité maximale pour vos services, avec une infrastructure moderne et scalable.</p>
            <ul className="service-items">
              <li>Cloud Management (AWS · Azure · GCP)</li>
              <li>Virtualisation & conteneurisation</li>
              <li>Docker, Kubernetes, CI/CD</li>
            </ul>
          </div>

        </div>
      </section>

      {/* COMPETENCES TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-label">
          <span>Toutes mes compétences</span>
        </div>
        <div className="ticker-track-outer">
          <div className="ticker-track" id="ticker">
            {[...skills, ...skills].map((skill, index) => (
              <div className="ticker-item" key={index}>
                <span className="ticker-dot"></span>
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
