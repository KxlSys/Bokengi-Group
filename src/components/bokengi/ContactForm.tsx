'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface ContactFormProps {
  initialPole?: string
  initialType?: string
}

const POLES_OPTIONS = [
  { id: 'it', name: 'Bokengi IT', num: '01', desc: 'Cybersécurité, Cloud & Infra' },
  { id: 'digital', name: 'Bokengi Digital', num: '02', desc: 'Développement Web, Apps & UX' },
  { id: 'business', name: 'Bokengi Business', num: '03', desc: 'Support opérationnel & Gestion' },
  { id: 'consulting', name: 'Bokengi Consulting', num: '04', desc: 'Conseil stratégique & Audit' },
  { id: 'events', name: 'Bokengi Events', num: '05', desc: 'Événements & Séminaires pro' },
]

export const ContactForm: React.FC<ContactFormProps> = () => {
  const searchParams = useSearchParams()

  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    company: '',
    email: '',
    phone: '',
    pole: 'it',
    requestType: 'devis',
    message: '',
    website: '', // Honeypot anti-spam
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  useEffect(() => {
    const qPole = searchParams.get('pole')
    const qType = searchParams.get('type')

    if (qPole && POLES_OPTIONS.some((p) => p.id === qPole)) {
      setForm((prev) => ({ ...prev, pole: qPole }))
    }
    if (qType && ['devis', 'cadrage', 'partenariat', 'autre'].includes(qType)) {
      setForm((prev) => ({ ...prev, requestType: qType }))
    }
  }, [searchParams])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setFeedbackMessage('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue lors de la transmission.')
      }

      setStatus('success')
      setFeedbackMessage(data.message || 'Votre demande a été transmise avec succès.')
      setForm({
        firstname: '',
        lastname: '',
        company: '',
        email: '',
        phone: '',
        pole: 'it',
        requestType: 'devis',
        message: '',
        website: '',
      })
    } catch (err: any) {
      setStatus('error')
      setFeedbackMessage(err.message || 'Impossible de transmettre votre demande. Veuillez réessayer.')
    }
  }

  if (status === 'success') {
    return (
      <div className="p-8 md:p-12 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--blue-cyan)]/30 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-[var(--radius-xs)] bg-[var(--blue-primary)] text-white flex items-center justify-center font-bold text-2xl">
          ✓
        </div>
        <h3 className="text-2xl font-bold text-[var(--ink-heading)] mb-2">
          Demande transmise avec succès !
        </h3>
        <p className="text-sm text-[var(--ink-muted)] max-w-md mx-auto mb-6 leading-relaxed">
          {feedbackMessage}
        </p>
        <div className="p-4 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] text-xs font-mono text-[var(--ink-heading)] max-w-sm mx-auto mb-8 border border-[var(--border-subtle)]">
          Délai de traitement estimé : <strong>24 à 48 heures ouvrées</strong>
        </div>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="btn-v4-secondary inline-flex items-center gap-2"
        >
          Envoyer une autre demande <span>→</span>
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 md:p-10 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6"
    >
      <div className="border-b border-[var(--border-subtle)] pb-4 mb-4">
        <h3 className="text-xl font-bold text-[var(--ink-heading)]">
          Formulaire de cadrage & devis
        </h3>
        <p className="text-xs text-[var(--ink-muted)] mt-1">
          Renseignez les détails de votre besoin pour être orienté vers nos spécialistes.
        </p>
      </div>

      {status === 'error' && (
        <div
          role="alert"
          className="p-4 rounded-[var(--radius-xs)] bg-red-500/10 border border-red-500/30 text-red-500 text-xs leading-relaxed"
        >
          <strong>Erreur : </strong> {feedbackMessage}
        </div>
      )}

      {/* 1. Type de sollicitation */}
      <div>
        <label htmlFor="form-request-type" className="block text-xs uppercase font-mono tracking-wider text-[var(--ink-heading)] mb-2 font-semibold">
          Type de demande <span className="text-[var(--blue-cyan)]">*</span>
        </label>
        <select
          id="form-request-type"
          name="requestType"
          value={form.requestType}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--ink-heading)] text-sm focus:outline-none focus:border-[var(--blue-cyan)]"
        >
          <option value="devis">Demande de devis chiffré</option>
          <option value="cadrage">Cadrage de projet & audit technique</option>
          <option value="partenariat">Partenariat institutionnel / commercial</option>
          <option value="autre">Autre demande générale</option>
        </select>
      </div>

      {/* 2. Sélection du Pôle (Architectural Cards) */}
      <div>
        <label className="block text-xs uppercase font-mono tracking-wider text-[var(--ink-heading)] mb-2 font-semibold">
          Pôle d\'expertise sollicité <span className="text-[var(--blue-cyan)]">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {POLES_OPTIONS.map((p) => {
            const isSelected = form.pole === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, pole: p.id }))}
                className={`p-3 rounded-[var(--radius-xs)] text-left border transition-all ${
                  isSelected
                    ? 'bg-[var(--blue-primary)]/15 border-[var(--blue-cyan)]'
                    : 'bg-[var(--bg-elevated)]/60 border-[var(--border-subtle)] hover:border-[var(--border-medium)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-[var(--blue-cyan)] font-bold">
                    {p.num}
                  </span>
                  {isSelected && (
                    <span className="text-xs text-[var(--blue-cyan)] font-bold">✓</span>
                  )}
                </div>
                <div className="text-xs font-bold text-[var(--ink-heading)]">{p.name}</div>
                <div className="text-[11px] text-[var(--ink-muted)] truncate">{p.desc}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Identité (Prénom / Nom) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="form-firstname" className="block text-xs uppercase font-mono tracking-wider text-[var(--ink-heading)] mb-1 font-semibold">
            Prénom <span className="text-[var(--blue-cyan)]">*</span>
          </label>
          <input
            type="text"
            id="form-firstname"
            name="firstname"
            placeholder="Ex: Alexandre"
            value={form.firstname}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--ink-heading)] text-sm focus:outline-none focus:border-[var(--blue-cyan)]"
          />
        </div>
        <div>
          <label htmlFor="form-lastname" className="block text-xs uppercase font-mono tracking-wider text-[var(--ink-heading)] mb-1 font-semibold">
            Nom de famille <span className="text-[var(--blue-cyan)]">*</span>
          </label>
          <input
            type="text"
            id="form-lastname"
            name="lastname"
            placeholder="Ex: Mabiala"
            value={form.lastname}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--ink-heading)] text-sm focus:outline-none focus:border-[var(--blue-cyan)]"
          />
        </div>
      </div>

      {/* 4. Organisation & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="form-company" className="block text-xs uppercase font-mono tracking-wider text-[var(--ink-heading)] mb-1 font-semibold">
            Organisation / Entreprise <span className="text-[var(--ink-muted)] text-[10px] lowercase">(optionnel)</span>
          </label>
          <input
            type="text"
            id="form-company"
            name="company"
            placeholder="Ex: Ministère, Entreprise, Startup..."
            value={form.company}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--ink-heading)] text-sm focus:outline-none focus:border-[var(--blue-cyan)]"
          />
        </div>
        <div>
          <label htmlFor="form-email" className="block text-xs uppercase font-mono tracking-wider text-[var(--ink-heading)] mb-1 font-semibold">
            Email professionnel <span className="text-[var(--blue-cyan)]">*</span>
          </label>
          <input
            type="email"
            id="form-email"
            name="email"
            placeholder="nom@organisation.com"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--ink-heading)] text-sm focus:outline-none focus:border-[var(--blue-cyan)]"
          />
        </div>
      </div>

      {/* 5. Téléphone */}
      <div>
        <label htmlFor="form-phone" className="block text-xs uppercase font-mono tracking-wider text-[var(--ink-heading)] mb-1 font-semibold">
          Numéro de téléphone <span className="text-[var(--ink-muted)] text-[10px] lowercase">(optionnel)</span>
        </label>
        <input
          type="tel"
          id="form-phone"
          name="phone"
          placeholder="Ex: +242 06 ... ou +33 6 ..."
          value={form.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--ink-heading)] text-sm focus:outline-none focus:border-[var(--blue-cyan)]"
        />
      </div>

      {/* 6. Description du besoin */}
      <div>
        <label htmlFor="form-message" className="block text-xs uppercase font-mono tracking-wider text-[var(--ink-heading)] mb-1 font-semibold">
          Description de votre projet ou besoin <span className="text-[var(--blue-cyan)]">*</span>
        </label>
        <textarea
          id="form-message"
          name="message"
          rows={5}
          placeholder="Précisez votre contexte, vos objectifs, les livrables attendus, les délais envisagés..."
          value={form.message}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--ink-heading)] text-sm focus:outline-none focus:border-[var(--blue-cyan)] resize-y leading-relaxed"
        />
      </div>

      {/* 7. HONEYPOT ANTI-SPAM (Masqué aux humains) */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <label htmlFor="form-website">Ne pas remplir ce champ :</label>
        <input
          type="text"
          id="form-website"
          name="website"
          value={form.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* 8. Bouton d'envoi & Garanties */}
      <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-v4-primary w-full sm:w-auto inline-flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              <span>Transmission en cours...</span>
            </>
          ) : (
            <>
              <span>Transmettre ma demande</span>
              <span>→</span>
            </>
          )}
        </button>

        <div className="text-xs text-[var(--ink-muted)] flex items-center gap-2">
          <span>🔒</span>
          <span>Transmission sécurisée · Données confidentielles</span>
        </div>
      </div>
    </form>
  )
}

export default ContactForm
