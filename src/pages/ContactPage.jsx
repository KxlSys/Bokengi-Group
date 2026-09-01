import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import { sendContactMessage } from '../lib/contact';

const ContactPage = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'devis' ? 'Demande de devis' : 'Demande de devis';
  const initialPoleParam = searchParams.get('pole');

  const poleMap = {
    it: 'Bokengi IT',
    digital: 'Bokengi Digital',
    business: 'Bokengi Business',
    consulting: 'Bokengi Consulting',
    events: 'Bokengi Events',
  };

  const initialPole = initialPoleParam && poleMap[initialPoleParam] 
    ? poleMap[initialPoleParam] 
    : 'Bokengi IT';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    pole: initialPole,
    type: initialType,
    message: '',
    website: '', // honeypot
  });

  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

  // Update form if URL parameters change
  useEffect(() => {
    const qPole = searchParams.get('pole');
    const qType = searchParams.get('type');

    if (qPole && poleMap[qPole]) {
      setForm((prev) => ({ ...prev, pole: poleMap[qPole] }));
    }
    if (qType === 'devis') {
      setForm((prev) => ({ ...prev, type: 'Demande de devis' }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await sendContactMessage(form);
      setStatus('success');
      setForm({
        name: '',
        email: '',
        phone: '',
        pole: 'Bokengi IT',
        type: 'Demande de devis',
        message: '',
        website: '',
      });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
    }
  };

  return (
    <div className="page-contact-main">
      <SEO 
        title="Contact & Demande de devis" 
        description="Contactez Bokengi Group ou formulez votre demande de devis pour vos projets technologiques, digitaux ou opérationnels." 
      />

      <PageHeader
        eyebrow="Prise de Contact & Devis"
        title="Parlons de votre projet."
        subtitle="Décrivez votre besoin et notre équipe reviendra vers vous avec une proposition concrète et chiffrée."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <section className="contact-main-section">
        <div className="container">
          <div className="contact-layout-grid">
            {/* Left Column: Direct Info & Guidelines */}
            <div className="contact-info-panel">
              <span className="section-kicker">Échange direct</span>
              <h2>Un accompagnement sur mesure pour vos ambitions</h2>
              <p className="contact-panel-lead">
                Que vous ayez un cahier des charges précis ou une simple idée à structurer, nos équipes vous orientent vers le pôle adapté.
              </p>

              <div className="contact-direct-card">
                <h3>Coordonnées officielles</h3>
                <div className="direct-item">
                  <span className="direct-label">Email de réception :</span>
                  <a href="mailto:bokengi.group@gmail.com" className="direct-value">
                    bokengi.group@gmail.com
                  </a>
                </div>
                <div className="direct-item">
                  <span className="direct-label">Délai moyen de réponse :</span>
                  <span className="direct-value">Sous 24 à 48 heures ouvrées</span>
                </div>
                <div className="direct-item">
                  <span className="direct-label">Zones d'intervention :</span>
                  <span className="direct-value">Afrique · Europe · À distance</span>
                </div>
              </div>

              <div className="contact-reassurance-box">
                <h4>Confidentialité garantie</h4>
                <p>
                  Les informations et données partagées dans le cadre de vos demandes de devis et projets restent strictement confidentielles.
                </p>
              </div>
            </div>

            {/* Right Column: Complete Form */}
            <div className="contact-form-panel">
              {status === 'success' ? (
                <div className="contact-success-card" role="status">
                  <div className="success-icon">✓</div>
                  <h3>Message transmis avec succès !</h3>
                  <p>
                    Merci pour votre sollicitation. Notre équipe Bokengi Group a bien reçu votre demande et vous contactera dans les plus brefs délais.
                  </p>
                  <button 
                    onClick={() => setStatus('idle')} 
                    className="btn-primary"
                    style={{ marginTop: '1.5rem' }}
                  >
                    Envoyer une autre demande
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bokengi-contact-form" noValidate>
                  {status === 'error' && (
                    <div className="form-alert form-alert-error" role="alert">
                      {errorMessage}
                    </div>
                  )}

                  {/* Type de demande */}
                  <div className="form-group">
                    <label htmlFor="form-type" className="form-label">
                      Type de demande <span className="req">*</span>
                    </label>
                    <select
                      id="form-type"
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="Demande de devis">Demande de devis</option>
                      <option value="Projet">Nouveau projet</option>
                      <option value="Question">Question / Information</option>
                      <option value="Partenariat">Partenariat</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  {/* Pôle concerné */}
                  <div className="form-group">
                    <label htmlFor="form-pole" className="form-label">
                      Pôle concerné <span className="req">*</span>
                    </label>
                    <select
                      id="form-pole"
                      name="pole"
                      value={form.pole}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="Bokengi IT">Bokengi IT (Technologie, infra, sécurité)</option>
                      <option value="Bokengi Digital">Bokengi Digital (Web, e-commerce, UX)</option>
                      <option value="Bokengi Business">Bokengi Business (Assistance, gestion)</option>
                      <option value="Bokengi Consulting">Bokengi Consulting (Conseil, audit)</option>
                      <option value="Bokengi Events">Bokengi Events (Événementiel pro)</option>
                      <option value="Autre / Plusieurs pôles">Autre / Plusieurs pôles</option>
                    </select>
                  </div>

                  {/* Nom / Entreprise */}
                  <div className="form-group">
                    <label htmlFor="form-name" className="form-label">
                      Nom / Entreprise <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="form-name"
                      name="name"
                      placeholder="Ex: Jean Dupont ou Société ABC"
                      value={form.name}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="form-email" className="form-label">
                        Adresse email <span className="req">*</span>
                      </label>
                      <input
                        type="email"
                        id="form-email"
                        name="email"
                        placeholder="nom@entreprise.com"
                        value={form.email}
                        onChange={handleChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="form-phone" className="form-label">
                        Téléphone <span className="optional">(optionnel)</span>
                      </label>
                      <input
                        type="tel"
                        id="form-phone"
                        name="phone"
                        placeholder="+33... ou +242..."
                        value={form.phone}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="form-group">
                    <label htmlFor="form-message" className="form-label">
                      Description de votre besoin <span className="req">*</span>
                    </label>
                    <textarea
                      id="form-message"
                      name="message"
                      rows="6"
                      placeholder="Précisez votre contexte, vos objectifs, les livrables attendus et vos échéances..."
                      value={form.message}
                      onChange={handleChange}
                      className="form-textarea"
                      required
                    ></textarea>
                  </div>

                  {/* Honeypot invisible */}
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    tabIndex="-1"
                    autoComplete="off"
                    className="form-honeypot"
                    aria-hidden="true"
                  />

                  <div className="form-submit-row">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-primary form-submit-btn"
                    >
                      {status === 'loading' ? 'Envoi en cours...' : 'Envoyer ma demande →'}
                    </button>
                    <span className="form-security-note">
                      🔒 Transmission sécurisée vers bokengi.group@gmail.com
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
