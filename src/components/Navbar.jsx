import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
    setIsDropdownOpen(false);
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
    { 
      to: '/expertises/it', 
      tag: 'IT & Infra',
      name: 'Bokengi IT', 
      desc: 'Cybersécurité, administration systèmes, réseaux & infogérance',
      color: '#0055D4'
    },
    { 
      to: '/expertises/digital', 
      tag: 'Web & App',
      name: 'Bokengi Digital', 
      desc: 'Développement web, plateformes digitales & expérience UX/UI',
      color: '#0EA5E9'
    },
    { 
      to: '/expertises/business', 
      tag: 'Support Pro',
      name: 'Bokengi Business', 
      desc: 'Assistance administrative, gestion & organisation opérationnelle',
      color: '#10B981'
    },
    { 
      to: '/expertises/consulting', 
      tag: 'Conseil & Audit',
      name: 'Bokengi Consulting', 
      desc: 'Conseil stratégique IT, schéma directeur & audits de conformité',
      color: '#8B5CF6'
    },
    { 
      to: '/expertises/events', 
      tag: 'Événements',
      name: 'Bokengi Events', 
      desc: 'Organisation d\'événements d\'entreprise & régie audiovisuelle',
      color: '#F59E0B'
    },
  ];

  return (
    <header className={`luxury-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="header-backdrop-filter"></div>
      <div className="container-v2 header-inner">
        
        {/* ── 01 BRAND LOCKUP ── */}
        <Link to="/" className="brand-lockup" aria-label="Bokengi Group — Retour à l'accueil">
          <div className="brand-emblem-wrap">
            <img 
              src="/bokengi-mark.png" 
              alt="Bokengi Emblem" 
              className="brand-emblem-img"
            />
          </div>
          <div className="brand-titles">
            <div className="brand-wordmark">
              <span>BO</span>
              <span className="brand-k-accent">K</span>
              <span>ENGI</span>
            </div>
            <div className="brand-subgroup">
              <span className="subgroup-rule"></span>
              <span className="subgroup-text">GROUP</span>
              <span className="subgroup-rule"></span>
            </div>
          </div>
        </Link>

        {/* ── 02 DESKTOP NAVIGATION ── */}
        <nav className="desktop-navigation" aria-label="Navigation principale">
          <ul className="nav-menu-list">
            <li>
              <NavLink to="/" end className={({ isActive }) => `nav-link-item ${isActive ? 'is-active' : ''}`}>
                Accueil
              </NavLink>
            </li>

            <li>
              <NavLink to="/groupe" className={({ isActive }) => `nav-link-item ${isActive ? 'is-active' : ''}`}>
                Le Groupe
              </NavLink>
            </li>

            {/* Dropdown Expertises */}
            <li 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <NavLink 
                to="/expertises" 
                className={({ isActive }) => `nav-link-item dropdown-trigger ${isActive || location.pathname.startsWith('/expertises') ? 'is-active' : ''}`}
                onClick={() => setIsDropdownOpen(false)}
              >
                Expertises
                <svg className={`dropdown-chevron ${isDropdownOpen ? 'is-flipped' : ''}`} viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
                  <path d="M2.5 4.5L6 8L9.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </NavLink>

              <div className={`luxury-dropdown-menu ${isDropdownOpen ? 'is-visible' : ''}`}>
                <div className="dropdown-panel-header">
                  <div>
                    <span className="dropdown-panel-kicker">Gouvernance Opérationnelle</span>
                    <strong className="dropdown-panel-title">Nos 5 Pôles d'Excellence</strong>
                  </div>
                  <Link to="/expertises" className="dropdown-panel-all-btn">
                    Voir la vue d'ensemble →
                  </Link>
                </div>

                <div className="dropdown-poles-grid">
                  {expertises.map((exp) => (
                    <Link key={exp.to} to={exp.to} className="dropdown-pole-card">
                      <div className="pole-card-top">
                        <span className="pole-card-tag" style={{ color: exp.color, background: `${exp.color}15`, borderColor: `${exp.color}30` }}>
                          {exp.tag}
                        </span>
                        <span className="pole-card-arrow">→</span>
                      </div>
                      <strong className="pole-card-name">{exp.name}</strong>
                      <p className="pole-card-desc">{exp.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            <li>
              <NavLink to="/realisations" className={({ isActive }) => `nav-link-item ${isActive ? 'is-active' : ''}`}>
                Réalisations
              </NavLink>
            </li>

            <li>
              <NavLink to="/contact" className={({ isActive }) => `nav-link-item ${isActive ? 'is-active' : ''}`}>
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* ── 03 ACTIONS RIGHT ── */}
        <div className="header-actions">
          <button
            onClick={toggleTheme}
            className="theme-switch-btn"
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
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <Link to="/contact?type=devis" className="header-cta-button">
            <span>Demander un devis</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          {/* Hamburger Mobile Toggle */}
          <button
            className={`mobile-burger-btn ${isOpen ? 'is-active' : ''}`}
            onClick={toggleMenu}
            aria-label={isOpen ? 'Fermer la navigation' : 'Ouvrir la navigation'}
            aria-expanded={isOpen}
          >
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </button>
        </div>
      </div>

      {/* ── 04 MOBILE NAVIGATION DRAWER ── */}
      <div className={`mobile-drawer-overlay ${isOpen ? 'is-open' : ''}`}>
        <div className="mobile-drawer-content">
          <div className="mobile-drawer-links">
            <NavLink to="/" end onClick={() => setIsOpen(false)} className="mobile-drawer-link">
              Accueil
            </NavLink>
            <NavLink to="/groupe" onClick={() => setIsOpen(false)} className="mobile-drawer-link">
              Le Groupe
            </NavLink>
            
            <div className="mobile-drawer-section">
              <NavLink to="/expertises" onClick={() => setIsOpen(false)} className="mobile-drawer-link section-label">
                Nos 5 Pôles d'Expertise
              </NavLink>
              <div className="mobile-poles-subgrid">
                {expertises.map((exp) => (
                  <Link key={exp.to} to={exp.to} onClick={() => setIsOpen(false)} className="mobile-pole-sublink">
                    <span className="mobile-sublink-name">{exp.name}</span>
                    <span className="mobile-sublink-tag">{exp.tag}</span>
                  </Link>
                ))}
              </div>
            </div>

            <NavLink to="/realisations" onClick={() => setIsOpen(false)} className="mobile-drawer-link">
              Réalisations
            </NavLink>
            <NavLink to="/contact" onClick={() => setIsOpen(false)} className="mobile-drawer-link">
              Contact
            </NavLink>
          </div>

          <div className="mobile-drawer-footer">
            <Link to="/contact?type=devis" onClick={() => setIsOpen(false)} className="header-cta-button" style={{ width: '100%', justifyContent: 'center' }}>
              Demander un devis
            </Link>
            <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
              bokengi.group@gmail.com
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
