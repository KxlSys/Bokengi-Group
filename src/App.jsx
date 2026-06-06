import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import ContactModal from './components/ContactModal';
import Footer from './components/Footer';

// Page d'accueil regroupant les sections de la landing page
const Home = ({ onOpenContact }) => {
  useEffect(() => {
    // 1. IntersectionObserver pour les animations d'apparition fade-up
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          fadeObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => fadeObserver.observe(el));

    return () => {
      fadeElements.forEach(el => {
        try {
          fadeObserver.unobserve(el);
        } catch (err) {
          // ignore
        }
      });
    };
  }, []);

  return (
    <>
      <Hero onOpenContact={onOpenContact} />
      <Services />
      <About />
      <Contact onOpenContact={onOpenContact} />
    </>
  );
};

function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleOpenContact = () => setIsContactOpen(true);
  const handleCloseContact = () => setIsContactOpen(false);

  return (
    <Router>
      <div className="app-container">
        <Navbar onOpenContact={handleOpenContact} />
        
        <main>
          <Routes>
            <Route path="/" element={<Home onOpenContact={handleOpenContact} />} />
            {/* Possibilité d'ajouter des routes supplémentaires ici */}
          </Routes>
        </main>
        
        <Footer />
        
        <ContactModal isOpen={isContactOpen} onClose={handleCloseContact} />
      </div>
    </Router>
  );
}

export default App;
