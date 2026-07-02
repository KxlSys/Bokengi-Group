import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = ({ onOpenContact }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    
    const handleScroll = () => {
      let current = 'hero';
      const scrollPos = window.scrollY || document.documentElement.scrollTop;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    closeMenu();
    const element = document.getElementById(targetId);
    if (element) {
      const topOffset = element.offsetTop - 80;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav>
      <a href="#hero" onClick={(e) => handleLinkClick(e, 'hero')} className="nav-logo">
        <svg className="logo-svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
          <path d="M 37 36 A 13 13 0 1 1 63 36" />
          <path d="M 41.5 45 L 50 24 L 58.5 45" />
          <path d="M 46 42 L 38 30 V 58 C 38 72 50 85 50 85" />
          <path d="M 54 42 L 62 30 V 58 C 62 72 50 85 50 85" />
          <path d="M 38 58 Q 45 42 50 50 T 62 42" />
          <path d="M 42 68 L 50 85 L 58 68" />
          <path d="M 50 85 V 60" />
        </svg>
        <span className="logo-text">BOKENGI <span className="logo-subtext">GROUP</span></span>
      </a>
      
      <div className="nav-right-container">
        <ul className={`nav-links ${isOpen ? 'open' : ''}`} id="nav-menu" role="menubar">
          <li role="none">
            <a 
              href="#services" 
              onClick={(e) => handleLinkClick(e, 'services')} 
              className={activeSection === 'services' ? 'active' : ''}
              role="menuitem"
            >
              Services
            </a>
          </li>
          <li role="none">
            <a 
              href="#portfolio" 
              onClick={(e) => handleLinkClick(e, 'portfolio')} 
              className={activeSection === 'portfolio' ? 'active' : ''}
              role="menuitem"
            >
              Portfolio
            </a>
          </li>
          <li role="none">
            <a 
              href="#about"
              onClick={(e) => handleLinkClick(e, 'about')} 
              className={activeSection === 'about' ? 'active' : ''}
              role="menuitem"
            >
              À propos
            </a>
          </li>
          <li role="none">
            <a 
              href="#contact" 
              onClick={(e) => handleLinkClick(e, 'contact')} 
              className={activeSection === 'contact' ? 'active' : ''}
              role="menuitem"
            >
              Contact
            </a>
          </li>
          <li className="nav-cta-mobile" style={{ display: 'none' }} role="none">
            <a 
              href="#contact" 
              onClick={(e) => { e.preventDefault(); onOpenContact(); }}
              className="nav-cta" 
              role="menuitem"
            >
              Démarrer un projet
            </a>
          </li>
        </ul>

        {/* Bouton bascule mode sombre */}
        <button 
          className="theme-toggle" 
          id="theme-toggle" 
          onClick={toggleTheme}
          aria-label="Changer de thème" 
          title="Activer le mode sombre/clair"
        >
          {/* Sun Icon */}
          <svg className="sun-icon" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          {/* Moon Icon */}
          <svg className="moon-icon" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <a 
          href="#contact" 
          onClick={(e) => { e.preventDefault(); onOpenContact(); }} 
          className="nav-cta nav-cta-desktop"
        >
          Démarrer un projet
        </a>

        {/* Menu Hamburger Mobile */}
        <button 
          className={`nav-toggle ${isOpen ? 'open' : ''}`}
          id="nav-toggle" 
          onClick={toggleMenu}
          aria-label="Ouvrir le menu" 
          aria-expanded={isOpen}
          aria-controls="nav-menu"
        >
          <span className="hamburger"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
