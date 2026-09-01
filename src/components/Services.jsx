import React, { useState } from 'react';

const Services = () => {
  const [activeTab, setActiveTab] = useState('it');

  const skills = [
    "Développement Web", "Cybersécurité", "Campus France", "Aide Administrative", 
    "Gestion d'Agendas", "Événementiel", "Cloud AWS & Azure", "Audit Réseaux", 
    "Maintenance Informatique", "Planification", "Assistance Technique", "Facturation Électronique"
  ];

  return (
    <>
      <section id="services">
        <div className="section-header">
          <span className="section-label" data-num="01">Nos Services</span>
          <h2>Ce que nous construisons<br/>pour vous.</h2>
        </div>

        {/* Dynamic Tab Switcher */}
        <div className="services-tabs-container">
          <div className="services-tabs">
            <button 
              className={`tab-btn ${activeTab === 'it' ? 'active' : ''}`}
              onClick={() => setActiveTab('it')}
            >
              Bokengi Services IT
            </button>
            <button 
              className={`tab-btn ${activeTab === 'group' ? 'active' : ''}`}
              onClick={() => setActiveTab('group')}
            >
              Bokengi-Group
            </button>
          </div>
        </div>

        {/* Tab content 1: Bokengi Services IT */}
        <div className={`services-pane ${activeTab === 'it' ? 'active' : ''}`}>
          <div className="services-grid">
            <div className="service-card fade-up visible">
              <div className="service-icon">
                <div className="service-icon-symbol">
                  <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                </div>
                IT · Dev
              </div>
              <h3>Développement Web</h3>
              <p className="service-desc">Conception de sites internet et d'applications sur mesure, performants et adaptés à vos besoins métiers.</p>
              <ul className="service-items">
                <li>Sites Web & Plateformes</li>
                <li>Applications Web & Mobiles</li>
                <li>Architecture logicielle</li>
              </ul>
            </div>

            <div className="service-card fade-up visible" style={{ transitionDelay: '0.12s' }}>
              <div className="service-icon">
                <div className="service-icon-symbol">
                  <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                IT · Sécurité
              </div>
              <h3>Cybersécurité</h3>
              <p className="service-desc">Protection de vos actifs numériques et audits réguliers pour garantir la confidentialité et l'intégrité de vos flux.</p>
              <ul className="service-items">
                <li>Protection & Chiffrement</li>
                <li>Audit de sécurité</li>
                <li>Sécurité des Réseaux</li>
              </ul>
            </div>

            <div className="service-card fade-up visible" style={{ transitionDelay: '0.24s' }}>
              <div className="service-icon">
                <div className="service-icon-symbol">
                  <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                IT · Systèmes
              </div>
              <h3>Administration Système</h3>
              <p className="service-desc">Mise en place, supervision et automatisation de vos architectures serveurs et infrastructures cloud.</p>
              <ul className="service-items">
                <li>Gestion de serveurs</li>
                <li>Infrastructures Cloud</li>
                <li>Maintenance & CI/CD</li>
              </ul>
            </div>

            <div className="service-card fade-up visible" style={{ transitionDelay: '0.36s' }}>
              <div className="service-icon">
                <div className="service-icon-symbol">
                  <svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                </div>
                IT · Support
              </div>
              <h3>Maintenance Informatique</h3>
              <p className="service-desc">Support technique réactif pour la gestion de vos parcs d'équipements et la résolution d'incidents.</p>
              <ul className="service-items">
                <li>Support & Assistance</li>
                <li>Dépannage & Diagnostic</li>
                <li>Supervision matérielle</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tab content 2: Bokengi-Group */}
        <div className={`services-pane ${activeTab === 'group' ? 'active' : ''}`}>
          <div className="services-grid">
            <div className="service-card fade-up visible">
              <div className="service-icon">
                <div className="service-icon-symbol">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3.5A2.5 2.5 0 0 1 6.5 1H20M20 3.5V17M12 3v10l3-3 3 3V3"/></svg>
                </div>
                Group · Études
              </div>
              <h3>Consultation Campus France</h3>
              <p className="service-desc">Accompagnement complet des étudiants pour réussir leur orientation et leurs démarches administratives d'études en France.</p>
              <ul className="service-items">
                <li>Accompagnement académique</li>
                <li>Aide aux dossiers administratifs</li>
                <li>Préparation aux entretiens</li>
              </ul>
            </div>

            <div className="service-card fade-up visible" style={{ transitionDelay: '0.12s' }}>
              <div className="service-icon">
                <div className="service-icon-symbol">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                Group · Gestion
              </div>
              <h3>Aide Administrative & Gestion</h3>
              <p className="service-desc">Soutien logistique et secrétariat externe pour le suivi des factures, contrats et formalités électroniques.</p>
              <ul className="service-items">
                <li>Suivi de facturation</li>
                <li>Gestion documentaire</li>
                <li>Signatures électroniques</li>
              </ul>
            </div>

            <div className="service-card fade-up visible" style={{ transitionDelay: '0.24s' }}>
              <div className="service-icon">
                <div className="service-icon-symbol">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                Group · Agendas
              </div>
              <h3>Prise de Rendez-vous</h3>
              <p className="service-desc">Optimisation d'agenda et planification rigoureuse de vos réunions et contacts d'affaires.</p>
              <ul className="service-items">
                <li>Gestion d'agendas complexes</li>
                <li>Planification & Relances</li>
                <li>Optimisation du temps</li>
              </ul>
            </div>

            <div className="service-card fade-up visible" style={{ transitionDelay: '0.36s' }}>
              <div className="service-icon">
                <div className="service-icon-symbol">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                Group · Événements
              </div>
              <h3>Événementiel</h3>
              <p className="service-desc">Planification et coordination de vos réunions, conférences, séminaires ou événements d'entreprise.</p>
              <ul className="service-items">
                <li>Organisation d'événements</li>
                <li>Logistique de conférences</li>
                <li>Coordination logistique</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* COMPETENCES TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-label">
          <span>Nos expertises</span>
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
