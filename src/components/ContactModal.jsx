import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ContactModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const nameInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setError(null);
      setName('');
      setEmail('');
      setMessage('');
      
      // Auto focus
      setTimeout(() => {
        if (nameInputRef.current) nameInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Requête HTTP réelle avec Axios vers un service de mock
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
        name,
        email,
        message,
        recipient: 'contact@kal-cooperation.com'
      });

      if (response.status === 201) {
        setSubmitted(true);
      } else {
        throw new Error('Erreur de soumission.');
      }
    } catch (err) {
      console.error(err);
      setError("L'envoi a échoué. Veuillez réessayer ou m'envoyer un e-mail directement.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="contact-modal" className={`modal ${isOpen ? 'open' : ''}`} role="dialog" aria-labelledby="modal-title">
      <div className="modal-overlay" onClick={onClose} tabIndex={-1}></div>
      <div className="modal-container">
        <button className="modal-close" onClick={onClose} aria-label="Fermer la fenêtre">&times;</button>
        <div className="modal-content">
          {!submitted ? (
            <>
              <h3 className="modal-title" id="modal-title">Discutons de votre projet</h3>
              <p className="modal-subtitle">Décrivez-moi vos besoins, je vous recontacterai sous 24h.</p>
              
              <form id="contact-form" onSubmit={handleSubmit}>
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
                  <label htmlFor="form-message">Votre message</label>
                  <textarea 
                    id="form-message" 
                    required 
                    placeholder="Quels sont vos objectifs, stack, délais ?" 
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                  />
                </div>
                {error && <p style={{ color: '#d90429', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</p>}
                <button type="submit" className="btn-primary form-submit" disabled={loading}>
                  {loading ? "Envoi en cours..." : "Envoyer la demande"}
                </button>
              </form>
            </>
          ) : (
            <div id="form-success" className="form-success-message">
              <div className="success-icon">✓</div>
              <h4>Message envoyé !</h4>
              <p>Merci pour votre intérêt. Je reviens vers vous sous 24h avec une proposition ou pour planifier un échange.</p>
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
