'use client'

import React, { useState } from 'react'
import { useI18n } from '@/i18n'

export const AccessRequestForm: React.FC = () => {
  const { t } = useI18n()
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
      setFeedbackMessage(t.accessRequest.consentError)
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
        throw new Error(data.error || t.accessRequest.genericError)
      }

      setStatus('success')
      setFeedbackMessage(data.message || t.accessRequest.successMessage)
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
      setFeedbackMessage(err.message || t.accessRequest.genericError)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── CHAMP HONEYPOT INVISIBLE (ANTI-BOT) ── */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <label htmlFor="website">{t.common.optional}</label>
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
            {t.accessRequest.firstName} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            value={form.firstName}
            onChange={handleChange}
            placeholder={t.accessRequest.firstName}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--ink-body)] placeholder:text-[var(--ink-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition"
          />
        </div>

        {/* Nom */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-[var(--ink-heading)] mb-2">
            {t.accessRequest.lastName} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            value={form.lastName}
            onChange={handleChange}
            placeholder={t.accessRequest.lastName}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--ink-body)] placeholder:text-[var(--ink-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition"
          />
        </div>
      </div>

      {/* Email professionnel */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[var(--ink-heading)] mb-2">
          {t.accessRequest.email} <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="contact@bokengi-group.com"
          className="w-full px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--ink-body)] placeholder:text-[var(--ink-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition"
        />
        <p className="text-xs text-[var(--ink-muted)] mt-1.5">
          {t.accessRequest.emailHint}
        </p>
      </div>

      {/* Rôle souhaité */}
      <div>
        <label htmlFor="requestedRole" className="block text-sm font-medium text-[var(--ink-heading)] mb-2">
          {t.accessRequest.roleLabel} <span className="text-red-500">*</span>
        </label>
        <select
          id="requestedRole"
          name="requestedRole"
          required
          value={form.requestedRole}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--ink-body)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition"
        >
          <option value="editor">{t.accessRequest.roleEditor}</option>
          <option value="admin">{t.accessRequest.roleAdmin}</option>
        </select>
        <p className="text-xs text-[var(--ink-muted)] mt-1.5">
          {t.accessRequest.roleHint}
        </p>
      </div>

      {/* Justification */}
      <div>
        <label htmlFor="justification" className="block text-sm font-medium text-[var(--ink-heading)] mb-2">
          {t.accessRequest.justification} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="justification"
          name="justification"
          required
          rows={4}
          value={form.justification}
          onChange={handleChange}
          placeholder={t.accessRequest.justificationPlaceholder}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--ink-body)] placeholder:text-[var(--ink-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition resize-y"
        />
        <p className="text-xs text-[var(--ink-muted)] mt-1.5">
          {t.accessRequest.justificationHint}
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
          {t.accessRequest.consentText}
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
            <span>{t.accessRequest.submitting}</span>
          </>
        ) : (
          <span>{t.accessRequest.submit}</span>
        )}
      </button>
    </form>
  )
}
