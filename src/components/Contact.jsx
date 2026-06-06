import React from 'react';

const Contact = ({ onOpenContact }) => {
  return (
    <section id="contact">
      <div className="section-header">
        <span className="section-label" data-num="03">Contact</span>
        <h2>Prêt à lancer<br/>votre projet ?</h2>
      </div>
      <div className="contact-body">
        <div className="contact-left fade-up">
          <p className="contact-tagline">"Une intervention immédiate, une expertise sur mesure."</p>
          <div className="contact-cta-block">
            <button 
              onClick={onOpenContact} 
              className="contact-cta-main btn-primary" 
              style={{ border: 'none', cursor: 'pointer', display: 'block', width: '100%' }}
            >
              Envoyer un message
            </button>
            <p className="contact-note">Réponse sous 24h · Devis gratuit</p>
          </div>
        </div>
        <div className="contact-right fade-up" style={{ transitionDelay: '0.1s' }}>
          <h4>Informations</h4>
          <div className="contact-item">
            <span className="contact-item-label">Disponibilité</span>
            <span className="contact-item-value">Missions immédiates · Remote & On-site</span>
          </div>
          <div className="contact-item">
            <span className="contact-item-label">Zone d'intervention</span>
            <span className="contact-item-value">France · International (Remote)</span>
          </div>
          <div className="contact-item">
            <span className="contact-item-label">Type de mission</span>
            <span className="contact-item-value">PME · Startups · Entrepreneurs</span>
          </div>
          <div className="contact-item">
            <span className="contact-item-label">Email</span>
            <span className="contact-item-value">
              <a href="mailto:contact@kal-cooperation.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                contact@kal-cooperation.com
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
