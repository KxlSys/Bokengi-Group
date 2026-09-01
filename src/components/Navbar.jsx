import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const expertises = [
    { to: '/expertises/it', name: '01 — BOKENGI IT', sub: 'Technologie, infrastructure & cybersécurité' },
    { to: '/expertises/digital', name: '02 — BOKENGI DIGITAL', sub: 'Web, produits numériques & transformation' },
    { to: '/expertises/business', name: '03 — BOKENGI BUSINESS', sub: 'Assistance administrative & organisation' },
    { to: '/expertises/consulting', name: '04 — BOKENGI CONSULTING', sub: 'Conseil stratégique & audits IT' },
    { to: '/expertises/events', name: '05 — BOKENGI EVENTS', sub: 'Événements professionnels & régie' },
  ];

  return (
    <header className={`header-v4 ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="container-v4 header-v4-inner">
        {/* Official Brand Logo */}
        <Link to="/" className="header-v4-logo" aria-label="Bokengi Group · Retour à l'accueil">
          <img 
            src={isDark ? `${import.meta.env.BASE_URL}bokengi-logo-horizontal-dark.png` : `${import.meta.env.BASE_URL}bokengi-logo-horizontal.png`} 
            alt="Bokengi Group · Technology & Services" 
            className="header-v4-logo-img"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-v4-nav" aria-label="Navigation principale">
          <ul className="header-v4-links">
            <li>
              <NavLink 
                to="/groupe" 
                className={({ isActive }) => `header-v4-link ${isActive ? 'is-active' : ''}`}
              >
                Le Groupe
              </NavLink>
            </li>

            <li className="header-v4-dropdown-wrap">
              <NavLink 
                to="/expertises" 
                className={({ isActive }) => `header-v4-link ${isActive || location.pathname.startsWith('/expertises') ? 'is-active' : ''}`}
              >
                Expertises
              </NavLink>
              <div className="header-v4-dropdown-menu">
                {expertises.map((exp) => (
                  <Link key={exp.to} to={exp.to} className="header-v4-dropdown-item">
                    <span className="dropdown-item-pole">{exp.name}</span>
                    <span className="dropdown-item-sub">{exp.sub}</span>
                  </Link>
                ))}
              </div>
            </li>

            <li>
              <NavLink 
                to="/realisations" 
                className={({ isActive }) => `header-v4-link ${isActive ? 'is-active' : ''}`}
              >
                Réalisations
              </NavLink>
            </li>

            <li>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => `header-v4-link ${isActive ? 'is-active' : ''}`}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Header Actions */}
        <div className="header-v4-actions">
          <button
            onClick={toggleTheme}
            className="theme-toggle-v4"
            aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
            title={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
          >
            {isDark ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <Link to="/contact?type=devis" className="header-v4-cta">
            Demander un devis →
          </Link>

          {/* Mobile Hamburger */}
          <button
            className={`header-v4-burger ${isOpen ? 'is-active' : ''}`}
            onClick={toggleMenu}
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isOpen}
          >
            <span className="burger-bar"></span>
            <span className="burger-bar"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-drawer-overlay is-open">
          <div className="mobile-drawer-links">
            <NavLink to="/groupe" onClick={() => setIsOpen(false)} className="mobile-drawer-link">
              Le Groupe
            </NavLink>
            <NavLink to="/expertises" onClick={() => setIsOpen(false)} className="mobile-drawer-link">
              Expertises
            </NavLink>
            <div className="mobile-poles-subgrid">
              {expertises.map((exp) => (
                <Link key={exp.to} to={exp.to} onClick={() => setIsOpen(false)} className="mobile-pole-sublink">
                  <span className="mobile-sublink-name">{exp.name}</span>
                </Link>
              ))}
            </div>
            <NavLink to="/realisations" onClick={() => setIsOpen(false)} className="mobile-drawer-link">
              Réalisations
            </NavLink>
            <NavLink to="/contact" onClick={() => setIsOpen(false)} className="mobile-drawer-link">
              Contact
            </NavLink>
            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/contact?type=devis" onClick={() => setIsOpen(false)} className="btn-v4-primary" style={{ width: '100%' }}>
                Demander un devis →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
