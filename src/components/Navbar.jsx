import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const expertises = [
    { to: '/expertises/it', label: 'Bokengi IT', desc: 'Technologie, infrastructure & cybersécurité' },
    { to: '/expertises/digital', label: 'Bokengi Digital', desc: 'Solutions web & transformation numérique' },
    { to: '/expertises/business', label: 'Bokengi Business', desc: 'Assistance & organisation professionnelle' },
    { to: '/expertises/consulting', label: 'Bokengi Consulting', desc: 'Conseil stratégique & audits techniques' },
    { to: '/expertises/events', label: 'Bokengi Events', desc: 'Organisation & solutions événementielles' },
  ];

  return (
    <nav className="site-nav" aria-label="Navigation principale">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-logo" aria-label="Bokengi Group — Retour à l'accueil">
          <div className="logo-badge">
            <img src="/bokengi-mark.svg" alt="" className="logo-image" aria-hidden="true" />
          </div>
          <div className="logo-text-group">
            <span className="logo-text">BOKENGI GROUP</span>
            <span className="logo-subtext">Technology & Business</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-center">
          <ul className="nav-links">
            <li>
              <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
                Accueil
              </NavLink>
            </li>
            <li>
              <NavLink to="/groupe" className={({ isActive }) => (isActive ? 'active' : '')}>
                Le Groupe
              </NavLink>
            </li>
            <li 
              className="nav-item-dropdown"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <NavLink 
                to="/expertises" 
                className={({ isActive }) => (isActive || location.pathname.startsWith('/expertises') ? 'active' : '')}
                onClick={() => setIsDropdownOpen(false)}
              >
                Expertises
                <span className="dropdown-caret" aria-hidden="true">▾</span>
              </NavLink>
              <div className={`dropdown-menu ${isDropdownOpen ? 'is-open' : ''}`}>
                <div className="dropdown-header">
                  <Link to="/expertises" className="dropdown-view-all">
                    Toutes nos expertises →
                  </Link>
                </div>
                <div className="dropdown-items">
                  {expertises.map((exp) => (
                    <Link key={exp.to} to={exp.to} className="dropdown-item">
                      <strong className="dropdown-item-title">{exp.label}</strong>
                      <span className="dropdown-item-desc">{exp.desc}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </li>
            <li>
              <NavLink to="/realisations" className={({ isActive }) => (isActive ? 'active' : '')}>
                Réalisations
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
                Contact
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Right side Actions */}
        <div className="nav-right-container">
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
            title={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
          >
            <svg className="sun-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg className="moon-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>

          <Link to="/contact?type=devis" className="nav-cta btn-primary">
            Demander un devis
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            className={`nav-toggle ${isOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isOpen}
          >
            <span className="hamburger"></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-menu ${isOpen ? 'is-open' : ''}`}>
        <ul className="mobile-nav-links">
          <li>
            <NavLink to="/" end onClick={() => setIsOpen(false)}>
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink to="/groupe" onClick={() => setIsOpen(false)}>
              Le Groupe
            </NavLink>
          </li>
          <li className="mobile-expertises-group">
            <NavLink to="/expertises" onClick={() => setIsOpen(false)} className="mobile-section-title">
              Nos expertises
            </NavLink>
            <ul className="mobile-sublinks">
              {expertises.map((exp) => (
                <li key={exp.to}>
                  <Link to={exp.to} onClick={() => setIsOpen(false)}>
                    {exp.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <NavLink to="/realisations" onClick={() => setIsOpen(false)}>
              Réalisations
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" onClick={() => setIsOpen(false)}>
              Contact
            </NavLink>
          </li>
        </ul>

        <div className="mobile-menu-footer">
          <Link 
            to="/contact?type=devis" 
            className="btn-primary mobile-cta" 
            onClick={() => setIsOpen(false)}
          >
            Demander un devis
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
