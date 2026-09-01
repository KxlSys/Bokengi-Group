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

      <section className="section-contact-v4">
        <div className="container-v4">
          <div className="contact-v4-grid">
            {/* Left Column: Direct Info & Guidelines */}
            <div className="contact-v4-info-col">
              <span className="kicker-v4">Échange direct</span>
              <h2 className="contact-v4-title">Un accompagnement sur mesure pour vos ambitions</h2>
              <p className="contact-v4-lead">
                Que vous ayez un cahier des charges précis ou une simple idée à structurer, nos équipes vous orientent vers le pôle adapté.
              </p>

              <div className="contact-v4-card">
                <h3 className="contact-card-title">Coordonnées officielles</h3>
                <div className="contact-card-list">
                  <div className="contact-coord-item">
                    <span className="contact-coord-label">Email de réception :</span>
                    <a href="mailto:bokengi.group@gmail.com" className="contact-coord-email">
                      bokengi.group@gmail.com
                    </a>
                  </div>
                  <div className="contact-coord-item">
                    <span className="contact-coord-label">Délai moyen de réponse :</span>
                    <span className="contact-coord-val">Sous 24 à 48 heures ouvrées</span>
                  </div>
                  <div className="contact-coord-item">
                    <span className="contact-coord-label">Zones d'intervention :</span>
                    <span className="contact-coord-val">Afrique · Europe · À distance</span>
                  </div>
                </div>
              </div>

              <div className="contact-v4-guarantee">
                <h4 className="contact-guarantee-title">Confidentialité garantie</h4>
                <p className="contact-guarantee-desc">
                  Les informations et données partagées dans le cadre de vos demandes de devis et projets restent strictement confidentielles.
                </p>
              </div>
            </div>

            {/* Right Column: Complete Form */}
            <div className="contact-v4-form-card">
              {status === 'success' ? (
                <div className="form-success-box" role="status">
                  <div className="form-success-icon">✓</div>
                  <h3 className="form-success-title">Message transmis avec succès !</h3>
                  <p className="form-success-lead">
                    Merci pour votre sollicitation. Notre équipe Bokengi Group a bien reçu votre demande et vous contactera dans les plus brefs délais.
                  </p>
                  <button 
                    onClick={() => setStatus('idle')} 
                    className="btn-v4-primary"
                    style={{ marginTop: '2rem' }}
                  >
                    Envoyer une autre demande
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bokengi-contact-form" noValidate>
                  <div className="contact-form-header">
                    <h3 className="contact-form-title">Formulaire de cadrage & devis</h3>
                    <p className="contact-form-subtitle">Renseignez vos coordonnées et le périmètre de votre projet.</p>
                  </div>

                  {status === 'error' && (
                    <div className="form-alert form-alert-error" role="alert" style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-xs)', marginBottom: '1.5rem' }}>
                      {errorMessage}
                    </div>
                  )}

                  {/* Nature de la demande (Segmented Tabs) */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Nature de votre démarche</span>
                      <span className="req">*</span>
                    </label>
                    <div className="form-segmented-tabs">
                      {[
                        { id: 'Demande de devis', label: '📋 Devis chiffré' },
                        { id: 'Cadrage de projet', label: '🎯 Cadrage projet' },
                        { id: 'Conseil & Audit', label: '🛡️ Conseil / Audit' },
                        { id: 'Autre demande', label: '💬 Autre échange' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          className={`form-segmented-btn ${form.type === t.id ? 'is-active' : ''}`}
                          onClick={() => setForm((prev) => ({ ...prev, type: t.id }))}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pôle d'expertise concerné (Architectural Cards) */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Pôle d'expertise sollicité</span>
                      <span className="req">*</span>
                    </label>
                    <div className="form-poles-grid">
                      {[
                        { name: 'Bokengi IT', num: '01', desc: 'Cybersécurité, Cloud & Infra' },
                        { name: 'Bokengi Digital', num: '02', desc: 'Développement Web, Apps & UX' },
                        { name: 'Bokengi Business', num: '03', desc: 'Support opérationnel & Gestion' },
                        { name: 'Bokengi Consulting', num: '04', desc: 'Conseil stratégique & Audit' },
                        { name: 'Bokengi Events', num: '05', desc: 'Événements & Séminaires pro' },
                      ].map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          className={`form-pole-card ${form.pole === p.name ? 'is-active' : ''}`}
                          onClick={() => setForm((prev) => ({ ...prev, pole: p.name }))}
                        >
                          <div className="pole-card-header">
                            <span className="pole-card-num">{p.num}</span>
                            <span className="pole-card-check">✓</span>
                          </div>
                          <span className="pole-card-name">{p.name}</span>
                          <span className="pole-card-desc">{p.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nom / Entreprise */}
                  <div className="form-group">
                    <label htmlFor="form-name" className="form-label">
                      <span>Nom complet ou Entreprise</span>
                      <span className="req">*</span>
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
                        <span>Adresse email</span>
                        <span className="req">*</span>
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
                        <span>Téléphone</span>
                        <span className="optional">(optionnel)</span>
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
                      <span>Description de votre besoin</span>
                      <span className="req">*</span>
                    </label>
                    <textarea
                      id="form-message"
                      name="message"
                      rows="5"
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
                      className="btn-v4-primary form-submit-btn"
                    >
                      {status === 'loading' ? 'Transmission en cours...' : 'Envoyer ma demande →'}
                    </button>
                    <span className="form-security-note">
                      🔒 Transmission sécurisée SSL
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
