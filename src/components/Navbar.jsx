import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = ({ onOpenContact }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const handleScroll = () => {
      let current = 'hero';
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + section.offsetHeight) {
          current = section.getAttribute('id');
        }
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    closeMenu();
    const element = document.getElementById(targetId);
    if (element) window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
  };

  return (
    <nav>
      <a href="#hero" onClick={(e) => handleLinkClick(e, 'hero')} className="nav-logo" aria-label="Bokengi Group — Accueil">
        <div className="logo-badge">
          <img className="logo-image" src="/bokengi-mark.svg" alt="" aria-hidden="true" />
        </div>
        <span className="logo-text">BOKENGI <span className="logo-subtext">GROUP</span></span>
      </a>

      <div className="nav-right-container">
        <ul className={`nav-links ${isOpen ? 'open' : ''}`} id="nav-menu" role="menubar">
          <li role="none"><a href="#services" onClick={(e) => handleLinkClick(e, 'services')} className={activeSection === 'services' ? 'active' : ''}>Expertises</a></li>
          <li role="none"><a href="#portfolio" onClick={(e) => handleLinkClick(e, 'portfolio')} className={activeSection === 'portfolio' ? 'active' : ''}>Réalisations</a></li>
          <li role="none"><a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className={activeSection === 'about' ? 'active' : ''}>Le Groupe</a></li>
          <li role="none"><a href="#contact" onClick={(e) => handleLinkClick(e, 'contact')} className={activeSection === 'contact' ? 'active' : ''}>Contact</a></li>
          <li className="nav-cta-mobile" style={{ display: 'none' }} role="none">
            <a href="#contact" onClick={(e) => { e.preventDefault(); onOpenContact(); closeMenu(); }} className="nav-cta">Demander un devis</a>
          </li>
        </ul>

        <button className="theme-toggle" id="theme-toggle" onClick={toggleTheme} aria-label="Changer de thème" title="Activer le mode sombre/clair">
          <svg className="sun-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg className="moon-icon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>

        <a href="#contact" onClick={(e) => { e.preventDefault(); onOpenContact(); }} className="nav-cta nav-cta-desktop">Demander un devis</a>

        <button className={`nav-toggle ${isOpen ? 'open' : ''}`} id="nav-toggle" onClick={toggleMenu} aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={isOpen} aria-controls="nav-menu">
          <span className="hamburger"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
