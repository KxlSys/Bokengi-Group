import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Group from './pages/Group';
import Expertises from './pages/Expertises';
import BokengiIT from './pages/expertises/BokengiIT';
import BokengiDigital from './pages/expertises/BokengiDigital';
import BokengiBusiness from './pages/expertises/BokengiBusiness';
import BokengiConsulting from './pages/expertises/BokengiConsulting';
import BokengiEvents from './pages/expertises/BokengiEvents';
import Projects from './pages/Projects';
import ContactPage from './pages/ContactPage';

function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

  return (
    <Router basename={basename}>
      <ScrollToTop />
      <div className="app-container">
        <Navbar />

        <main id="main-content" tabIndex="-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/groupe" element={<Group />} />
            <Route path="/expertises" element={<Expertises />} />
            <Route path="/expertises/it" element={<BokengiIT />} />
            <Route path="/expertises/digital" element={<BokengiDigital />} />
            <Route path="/expertises/business" element={<BokengiBusiness />} />
            <Route path="/expertises/consulting" element={<BokengiConsulting />} />
            <Route path="/expertises/events" element={<BokengiEvents />} />
            <Route path="/realisations" element={<Projects />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
