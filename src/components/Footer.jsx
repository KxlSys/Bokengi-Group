import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-v2" aria-label="Pied de page institutionnel">
      <div className="footer-v2-top">
        <div className="container-v2">
          <div className="footer-v2-grid">
            {/* Col 1: Brand & Identity */}
            <div className="footer-brand-col">
              <Link to="/" className="nav-logo-v2" style={{ textDecoration: 'none', marginBottom: '1.25rem' }}>
                <div className="nav-logo-mark" style={{ background: '#00227A' }}>
                  <img src="/bokengi-mark.png" alt="Bokengi Group" />
                </div>
                <div className="nav-logo-texts">
                  <span className="footer-brand-name">BOKENGI GROUP</span>
                  <span className="nav-logo-tag" style={{ color: 'var(--blue-glow)' }}>Technologie & Services</span>
                </div>
              </Link>
              <p className="footer-brand-baseline">
                Bokengi Group réunit des expertises technologiques, numériques et professionnelles pour concevoir, sécuriser et déployer des solutions durables pour les organisations.
              </p>
              <div style={{ marginTop: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--blue-glow)', display: 'block', marginBottom: '0.35rem' }}>Contact officiel</span>
                <a href="mailto:bokengi.group@gmail.com" style={{ color: '#FFFFFF', fontWeight: 600, textDecoration: 'none', fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>
                  bokengi.group@gmail.com
                </a>
              </div>
            </div>

            {/* Col 2: Le Groupe */}
            <div>
              <h4 className="footer-col-title">Le Groupe</h4>
              <ul className="footer-v2-links">
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/groupe">Présentation & Vision</Link></li>
                <li><Link to="/realisations">Nos Réalisations</Link></li>
                <li><Link to="/contact">Prendre Contact</Link></li>
              </ul>
            </div>

            {/* Col 3: Nos 5 Pôles */}
            <div>
              <h4 className="footer-col-title">Nos 5 Pôles</h4>
              <ul className="footer-v2-links">
                <li><Link to="/expertises/it">Bokengi IT</Link></li>
                <li><Link to="/expertises/digital">Bokengi Digital</Link></li>
                <li><Link to="/expertises/business">Bokengi Business</Link></li>
                <li><Link to="/expertises/consulting">Bokengi Consulting</Link></li>
                <li><Link to="/expertises/events">Bokengi Events</Link></li>
              </ul>
            </div>

            {/* Col 4: Action & Devis */}
            <div>
              <h4 className="footer-col-title">Engager un projet</h4>
              <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Besoins d'infrastructure, de développement ou d'audit ? Nos pôles interviennent rapidement.
              </p>
              <Link to="/contact?type=devis" className="btn-v2-primary" style={{ width: '100%', textAlign: 'center', background: '#FFFFFF', color: 'var(--navy-primary)' }}>
                Demander un devis
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-v2-bottom">
        <div className="container-v2">
          <div className="footer-bottom-flex">
            <span>© 2026 Bokengi Group. Tous droits réservés.</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              Technologies · Digital · Services Professionnels
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
