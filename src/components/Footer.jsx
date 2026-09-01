import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-container">
          {/* Col 1: Brand & Description */}
          <div className="footer-col footer-col-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-badge">
                <img src="/bokengi-mark.png" alt="Bokengi Group" className="logo-image" />
              </div>
              <div className="logo-text-group">
                <span className="logo-text">BOKENGI GROUP</span>
                <span className="logo-subtext">Technology & Business Services</span>
              </div>
            </Link>
            <p className="footer-desc">
              Groupe de services technologiques et professionnels accompagnant les entreprises, organisations et entrepreneurs dans leurs projets d'infrastructure, de numérique et de transformation.
            </p>
            <div className="footer-contact-info">
              <span className="footer-contact-label">Contact officiel :</span>
              <a href="mailto:bokengi.group@gmail.com" className="footer-email-link">
                bokengi.group@gmail.com
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/groupe">Le Groupe</Link></li>
              <li><Link to="/expertises">Nos expertises</Link></li>
              <li><Link to="/realisations">Réalisations</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Col 3: Expertises */}
          <div className="footer-col">
            <h4 className="footer-heading">Nos Pôles</h4>
            <ul className="footer-links">
              <li><Link to="/expertises/it">Bokengi IT</Link></li>
              <li><Link to="/expertises/digital">Bokengi Digital</Link></li>
              <li><Link to="/expertises/business">Bokengi Business</Link></li>
              <li><Link to="/expertises/consulting">Bokengi Consulting</Link></li>
              <li><Link to="/expertises/events">Bokengi Events</Link></li>
            </ul>
          </div>

          {/* Col 4: Devis CTA */}
          <div className="footer-col footer-col-cta">
            <h4 className="footer-heading">Un projet ?</h4>
            <p className="footer-cta-text">
              Exprimez vos besoins et obtenez une proposition d'accompagnement sur mesure.
            </p>
            <Link to="/contact?type=devis" className="btn-primary footer-btn">
              Demander un devis
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="footer-copyright">
            © 2026 Bokengi Group — Tous droits réservés.
          </p>
          <div className="footer-legal">
            <span>Technologies & Services souverains</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
