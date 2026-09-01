import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer className="footer-v4" aria-label="Pied de page">
      <div className="container-v4">
        <div className="footer-v4-grid">
          
          {/* Col 1: Identity & Official Logo */}
          <div>
            <Link to="/" aria-label="Bokengi Group — Retour à l'accueil">
              <img 
                src={isDark ? '/bokengi-logo-horizontal-dark.png' : '/bokengi-logo-horizontal.png'} 
                alt="Bokengi Group — Technology & Services" 
                className="footer-v4-logo-img"
              />
            </Link>
            <p className="footer-v4-desc">
              Bokengi Group rassemble des expertises technologiques, numériques et professionnelles pour accompagner les organisations dans leurs projets.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="footer-v4-col-title">Navigation</h4>
            <ul className="footer-v4-links">
              <li><Link to="/groupe" className="footer-v4-link">Le Groupe</Link></li>
              <li><Link to="/expertises" className="footer-v4-link">Expertises</Link></li>
              <li><Link to="/realisations" className="footer-v4-link">Réalisations</Link></li>
              <li><Link to="/contact" className="footer-v4-link">Contact</Link></li>
            </ul>
          </div>

          {/* Col 3: Expertises */}
          <div>
            <h4 className="footer-v4-col-title">Pôles d'Expertise</h4>
            <ul className="footer-v4-links">
              <li><Link to="/expertises/it" className="footer-v4-link">Bokengi IT</Link></li>
              <li><Link to="/expertises/digital" className="footer-v4-link">Bokengi Digital</Link></li>
              <li><Link to="/expertises/business" className="footer-v4-link">Bokengi Business</Link></li>
              <li><Link to="/expertises/consulting" className="footer-v4-link">Bokengi Consulting</Link></li>
              <li><Link to="/expertises/events" className="footer-v4-link">Bokengi Events</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact Officiel */}
          <div>
            <h4 className="footer-v4-col-title">Contact</h4>
            <a href="mailto:bokengi.group@gmail.com" className="footer-v4-email">
              bokengi.group@gmail.com
            </a>
            <p className="footer-v4-desc" style={{ fontSize: '0.85rem' }}>
              Réponse sous 24 à 48h ouvrées pour toute demande de devis ou cadrage de projet.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-v4-bottom">
          <span>© {new Date().getFullYear()} Bokengi Group. Tous droits réservés.</span>
          <span>Technology & Services</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
