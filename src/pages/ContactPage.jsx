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

      <section style={{ padding: '90px 0' }}>
        <div className="container-v4">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '4.5rem' }}>
            {/* Left Column: Direct Info & Guidelines */}
            <div>
              <span className="kicker-v4">Échange direct</span>
              <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0 1.25rem', lineHeight: 1.15 }}>Un accompagnement sur mesure pour vos ambitions</h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--ink-muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                Que vous ayez un cahier des charges précis ou une simple idée à structurer, nos équipes vous orientent vers le pôle adapté.
              </p>

              <div style={{ padding: '2.25rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Coordonnées officielles</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--ink-faint)', display: 'block', marginBottom: '0.25rem' }}>Email de réception :</span>
                    <a href="mailto:bokengi.group@gmail.com" style={{ color: 'var(--blue-cyan)', fontWeight: 600, fontSize: '1.1rem', fontFamily: 'var(--font-mono)', textDecoration: 'none' }}>
                      bokengi.group@gmail.com
                    </a>
                  </div>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--ink-faint)', display: 'block', marginBottom: '0.25rem' }}>Délai moyen de réponse :</span>
                    <span style={{ color: 'var(--ink-heading)', fontWeight: 600, fontSize: '0.95rem' }}>Sous 24 à 48 heures ouvrées</span>
                  </div>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--ink-faint)', display: 'block', marginBottom: '0.25rem' }}>Zones d'intervention :</span>
                    <span style={{ color: 'var(--ink-heading)', fontWeight: 600, fontSize: '0.95rem' }}>Afrique · Europe · À distance</span>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid var(--blue-cyan)', padding: '1.5rem', borderRadius: '0 var(--radius-xs) var(--radius-xs) 0' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--ink-heading)', marginBottom: '0.35rem', fontWeight: 700 }}>Confidentialité garantie</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
                  Les informations et données partagées dans le cadre de vos demandes de devis et projets restent strictement confidentielles.
                </p>
              </div>
            </div>

            {/* Right Column: Complete Form */}
            <div style={{ padding: '3.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)' }}>
              {status === 'success' ? (
                <div style={{ textAlign: 'center' }} role="status">
                  <div style={{ width: '64px', height: '64px', background: '#10B981', color: '#FFFFFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>✓</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Message transmis avec succès !</h3>
                  <p style={{ fontSize: '1.05rem', color: 'var(--ink-muted)', lineHeight: 1.65, maxWidth: '480px', margin: '0 auto' }}>
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
                  {status === 'error' && (
                    <div className="form-alert form-alert-error" role="alert" style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-xs)', marginBottom: '1.5rem' }}>
                      {errorMessage}
                    </div>
                  )}

                  {/* Type de demande */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="form-type" style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink-heading)', marginBottom: '0.5rem' }}>
                      Type de demande <span style={{ color: 'var(--blue-cyan)' }}>*</span>
                    </label>
                    <select
                      id="form-type"
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '0.85rem 1rem', background: 'var(--bg-main)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)', color: 'var(--ink-heading)', fontSize: '0.95rem' }}
                      required
                    >
                      <option value="Demande de devis">Demande de devis</option>
                      <option value="Projet informatique">Projet informatique</option>
                      <option value="Cybersécurité">Cybersécurité</option>
                      <option value="Développement Web">Développement Web</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Assistance administrative">Assistance administrative</option>
                      <option value="Événementiel">Événementiel</option>
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
                      className="btn-v4-primary form-submit-btn"
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
