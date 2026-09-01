import React, { useState, useEffect, useRef } from 'react';
import { sendContactMessage } from '../lib/contact';

const ContactModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const nameInputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    setSubmitted(false);
    setError(null);
    setName('');
    setEmail('');
    setMessage('');
    setWebsite('');

    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sendContactMessage({ name, email, message, website });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "L'envoi a échoué. Réessayez ou écrivez à bokengi.group@gmail.com."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="contact-modal"
      className={`modal ${isOpen ? 'open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-overlay" onClick={onClose} aria-hidden="true" />
      <div className="modal-container" ref={containerRef}>
        <button className="modal-close" onClick={onClose} aria-label="Fermer la fenêtre">
          &times;
        </button>
        <div className="modal-content">
          {!submitted ? (
            <>
              <h3 className="modal-title" id="modal-title">
                Demander un devis
              </h3>
              <p className="modal-subtitle">
                Décrivez votre besoin. Notre équipe vous recontactera pour échanger sur votre projet.
              </p>

              <form id="contact-form" onSubmit={handleSubmit}>
                <div className="form-honeypot" aria-hidden="true">
                  <label htmlFor="form-website">Ne pas remplir</label>
                  <input
                    type="text"
                    id="form-website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="form-name">Votre nom / Entreprise</label>
                  <input
                    type="text"
                    id="form-name"
                    ref={nameInputRef}
                    required
                    placeholder="Ex. Jean Dupont / ACME Corp"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="form-email">Adresse email</label>
                  <input
                    type="email"
                    id="form-email"
                    required
                    placeholder="Ex. jean@acme.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="form-message">Votre besoin</label>
                  <textarea
                    id="form-message"
                    required
                    placeholder="Décrivez votre projet, vos objectifs ou la prestation recherchée."
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                  />
                </div>
                {error && <p className="form-error">{error}</p>}
                <button type="submit" className="btn-primary form-submit" disabled={loading}>
                  {loading ? 'Envoi en cours...' : 'Envoyer ma demande'}
                </button>
              </form>
            </>
          ) : (
            <div id="form-success" className="form-success-message">
              <div className="success-icon">✓</div>
              <h4>Demande envoyée !</h4>
              <p>
                Merci pour votre demande. Bokengi Group reviendra vers vous prochainement.
              </p>
              <button
                className="btn-primary"
                style={{ marginTop: '2rem', width: '100%', border: 'none' }}
                onClick={onClose}
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
