'use client'

import React, { useState } from 'react'

export const AccessRequestForm: React.FC = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    requestedRole: 'editor',
    justification: '',
    website: '', // Honeypot anti-bot
    consent: false,
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [feedbackMessage, setFeedbackMessage] = useState('')

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

    if (!form.consent) {
      setStatus('error')
      setFeedbackMessage(
        'Veuillez cocher la case attestant de votre habilitation professionnelle pour transmettre votre demande.'
      )
      return
    }

    try {
      const res = await fetch('/api/access-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue lors de l’envoi de votre demande.')
      }

      setStatus('success')
      setFeedbackMessage(
        data.message ||
          'Votre demande d’accès a bien été transmise à la direction technique Bokengi Group. Un courriel d’activation vous sera adressé après validation.'
      )
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        requestedRole: 'editor',
        justification: '',
        website: '',
        consent: false,
      })
    } catch (err: any) {
      setStatus('error')
      setFeedbackMessage(err.message || 'Échec de transmission. Veuillez réessayer ultérieurement.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── CHAMP HONEYPOT INVISIBLE (ANTI-BOT) ── */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <label htmlFor="website">Ne pas remplir ce champ :</label>
        <input
          type="text"
          id="website"
          name="website"
          value={form.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prénom */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-[var(--ink-heading)] mb-2">
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            value={form.firstName}
            onChange={handleChange}
            placeholder="Ex : Alexandre"
            className="w-full px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--ink-body)] placeholder:text-[var(--ink-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition"
          />
        </div>

        {/* Nom */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-[var(--ink-heading)] mb-2">
            Nom de famille <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            value={form.lastName}
            onChange={handleChange}
            placeholder="Ex : Mabiala"
            className="w-full px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--ink-body)] placeholder:text-[var(--ink-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition"
          />
        </div>
      </div>

      {/* Email professionnel */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[var(--ink-heading)] mb-2">
          Adresse email professionnelle <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="alexandre.mabiala@bokengi-group.com"
          className="w-full px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--ink-body)] placeholder:text-[var(--ink-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition"
        />
        <p className="text-xs text-[var(--ink-muted)] mt-1.5">
          L’adresse doit correspondre à votre identifiant d’organisation ou professionnel vérifiable.
        </p>
      </div>

      {/* Rôle souhaité */}
      <div>
        <label htmlFor="requestedRole" className="block text-sm font-medium text-[var(--ink-heading)] mb-2">
          Rôle souhaité (consultatif) <span className="text-red-500">*</span>
        </label>
        <select
          id="requestedRole"
          name="requestedRole"
          required
          value={form.requestedRole}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--ink-body)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition"
        >
          <option value="editor">Éditeur de contenu — Gestion des articles, études de cas et médias</option>
          <option value="admin">Administrateur technique — Gestion des pôles, services et utilisateurs</option>
        </select>
        <p className="text-xs text-[var(--ink-muted)] mt-1.5">
          La décision finale d’habilitation est formellement arrêtée par la direction technique Super Administrateur.
        </p>
      </div>

      {/* Justification */}
      <div>
        <label htmlFor="justification" className="block text-sm font-medium text-[var(--ink-heading)] mb-2">
          Justification & Mission <span className="text-red-500">*</span>
        </label>
        <textarea
          id="justification"
          name="justification"
          required
          rows={4}
          value={form.justification}
          onChange={handleChange}
          placeholder="Précisez votre fonction au sein du groupe, votre pôle d’intervention et les motifs opérationnels justifiant l’ouverture d’un compte d’accès..."
          className="w-full px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--ink-body)] placeholder:text-[var(--ink-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition resize-y"
        />
        <p className="text-xs text-[var(--ink-muted)] mt-1.5">
          Minimum 20 caractères. Aucune transmission de mot de passe n’est requise à cette étape.
        </p>
      </div>

      {/* Consentement */}
      <div className="flex items-start gap-3 pt-2">
        <input
          type="checkbox"
          id="consent"
          name="consent"
          checked={form.consent}
          onChange={(e) => setForm((prev) => ({ ...prev, consent: e.target.checked }))}
          className="mt-1 h-4 w-4 rounded border-[var(--border-subtle)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
        />
        <label htmlFor="consent" className="text-xs text-[var(--ink-muted)] leading-relaxed">
          J’atteste sur l’honneur appartenir aux équipes ou aux partenaires dûment mandatés par Bokengi Group, et sollicite l’attribution d’un compte nominatif dans le respect des règles de sécurité et de confidentialité du groupe.
        </label>
      </div>

      {/* Messages de retour */}
      {status === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm leading-relaxed">
          {feedbackMessage}
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm leading-relaxed">
          {feedbackMessage}
        </div>
      )}

      {/* Bouton de soumission */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3.5 px-6 rounded-xl font-medium bg-[var(--brand-primary)] text-white hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
      >
        {status === 'loading' ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Enregistrement sécurisé en cours...</span>
          </>
        ) : (
          <span>Transmettre ma demande d’accès</span>
        )}
      </button>
    </form>
  )
}
