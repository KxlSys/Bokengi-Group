'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useI18n } from '@/i18n'

interface ContactFormProps {
  initialPole?: string
  initialType?: string
}

const POLES_IDS = ['it', 'digital', 'business', 'consulting', 'events']

export const ContactForm: React.FC<ContactFormProps> = () => {
  const searchParams = useSearchParams()
  const { t, getHref } = useI18n()

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
    consent: false,
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const polesOptions = [
    { id: 'it', name: t.expertises.it.name, num: '01', desc: t.expertises.it.sub },
    { id: 'digital', name: t.expertises.digital.name, num: '02', desc: t.expertises.digital.sub },
    { id: 'business', name: t.expertises.business.name, num: '03', desc: t.expertises.business.sub },
    { id: 'consulting', name: t.expertises.consulting.name, num: '04', desc: t.expertises.consulting.sub },
    { id: 'events', name: t.expertises.events.name, num: '05', desc: t.expertises.events.sub },
  ]

  useEffect(() => {
    const qPole = searchParams.get('pole')
    const qType = searchParams.get('type')

    if (qPole && POLES_IDS.includes(qPole)) {
      setForm((prev) => ({ ...prev, pole: qPole }))
    }
    if (qType && ['devis', 'cadrage', 'support', 'partenariat', 'autre'].includes(qType)) {
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

    if (!form.consent) {
      setStatus('error')
      setFeedbackMessage(t.contactForm.consentRequiredError)
      return
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || t.contactForm.genericError)
      }

      setStatus('success')
      setFeedbackMessage(data.message || t.contactForm.successDesc)
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
        consent: false,
      })
    } catch (err: any) {
      setStatus('error')
      setFeedbackMessage(err.message || t.contactForm.submissionFailed)
    }
  }

  if (status === 'success') {
    return (
      <div className="p-8 md:p-12 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--blue-cyan)]/30 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-[var(--radius-xs)] bg-[var(--blue-primary)] text-white flex items-center justify-center font-bold text-2xl">
          ✓
        </div>
        <h3 className="text-2xl font-bold text-[var(--ink-heading)] mb-2">
          {t.contactForm.successTitle}
        </h3>
        <p className="text-sm text-[var(--ink-muted)] max-w-md mx-auto mb-6 leading-relaxed">
          {feedbackMessage || t.contactForm.successDesc}
        </p>
        <div className="p-4 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] text-xs font-mono text-[var(--ink-heading)] max-w-sm mx-auto mb-8 border border-[var(--border-subtle)]">
          {t.contactForm.estimatedDelay} <strong>{t.contactForm.delayHours}</strong>
        </div>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="btn-v4-secondary inline-flex items-center gap-2"
        >
          {t.contactForm.newRequestBtn} <span>→</span>
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
          {t.contactForm.title}
        </h3>
        <p className="text-xs text-[var(--ink-muted)] mt-1">
          {t.contactForm.subtitle}
        </p>
      </div>

      {status === 'error' && (
        <div
          role="alert"
          className="p-4 rounded-[var(--radius-xs)] bg-red-500/10 border border-red-500/30 text-red-500 text-xs leading-relaxed"
        >
          <strong>{t.common.errorPrefix} : </strong> {feedbackMessage}
        </div>
      )}

      {/* 1. Type de sollicitation */}
      <div>
        <label htmlFor="form-request-type" className="block text-xs uppercase font-mono tracking-wider text-[var(--ink-heading)] mb-2 font-semibold">
          {t.contactForm.requestType} <span className="text-[var(--blue-cyan)]">*</span>
        </label>
        <select
          id="form-request-type"
          name="requestType"
          value={form.requestType}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--ink-heading)] text-sm focus:outline-none focus:border-[var(--blue-cyan)]"
        >
          <option value="devis">{t.contactForm.types.devis}</option>
          <option value="cadrage">{t.contactForm.types.cadrage}</option>
          <option value="support">{t.contactForm.types.support}</option>
          <option value="partenariat">{t.contactForm.types.partenariat}</option>
          <option value="autre">{t.contactForm.types.autre}</option>
        </select>
      </div>

      {/* 2. Sélection du Pôle (Architectural Cards) */}
      <div>
        <label className="block text-xs uppercase font-mono tracking-wider text-[var(--ink-heading)] mb-2 font-semibold">
          {t.contactForm.pole} <span className="text-[var(--blue-cyan)]">*</span>
        </label>
        <div
          role="radiogroup"
          aria-label={t.contactForm.pole}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5"
        >
          {polesOptions.map((p) => {
            const isSelected = form.pole === p.id
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
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
            {t.contactForm.firstname} <span className="text-[var(--blue-cyan)]">*</span>
          </label>
          <input
            type="text"
            id="form-firstname"
            name="firstname"
            placeholder={t.contactForm.firstnamePlaceholder}
            value={form.firstname}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--ink-heading)] text-sm focus:outline-none focus:border-[var(--blue-cyan)]"
          />
        </div>
        <div>
          <label htmlFor="form-lastname" className="block text-xs uppercase font-mono tracking-wider text-[var(--ink-heading)] mb-1 font-semibold">
            {t.contactForm.lastname} <span className="text-[var(--blue-cyan)]">*</span>
          </label>
          <input
            type="text"
            id="form-lastname"
            name="lastname"
            placeholder={t.contactForm.lastnamePlaceholder}
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
            {t.contactForm.company} <span className="text-[var(--ink-muted)] text-[10px] lowercase">({t.common.optional})</span>
          </label>
          <input
            type="text"
            id="form-company"
            name="company"
            placeholder={t.contactForm.companyPlaceholder}
            value={form.company}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--ink-heading)] text-sm focus:outline-none focus:border-[var(--blue-cyan)]"
          />
        </div>
        <div>
          <label htmlFor="form-email" className="block text-xs uppercase font-mono tracking-wider text-[var(--ink-heading)] mb-1 font-semibold">
            {t.contactForm.email} <span className="text-[var(--blue-cyan)]">*</span>
          </label>
          <input
            type="email"
            id="form-email"
            name="email"
            placeholder={t.contactForm.emailPlaceholder}
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
          {t.contactForm.phone} <span className="text-[var(--ink-muted)] text-[10px] lowercase">({t.common.optional})</span>
        </label>
        <input
          type="tel"
          id="form-phone"
          name="phone"
          placeholder={t.contactForm.phonePlaceholder}
          value={form.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--ink-heading)] text-sm focus:outline-none focus:border-[var(--blue-cyan)]"
        />
      </div>

      {/* 6. Description du besoin */}
      <div>
        <label htmlFor="form-message" className="block text-xs uppercase font-mono tracking-wider text-[var(--ink-heading)] mb-1 font-semibold">
          {t.contactForm.message} <span className="text-[var(--blue-cyan)]">*</span>
        </label>
        <textarea
          id="form-message"
          name="message"
          rows={5}
          placeholder={t.contactForm.messagePlaceholder}
          value={form.message}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--ink-heading)] text-sm focus:outline-none focus:border-[var(--blue-cyan)] resize-y leading-relaxed"
        />
      </div>

      {/* 7. HONEYPOT ANTI-SPAM (Masqué aux humains) */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <label htmlFor="form-website">{t.common.optional}</label>
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

      {/* 8. Information RGPD & Prise de connaissance */}
      <div className="p-4 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] space-y-3">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="form-consent"
            name="consent"
            checked={form.consent}
            onChange={(e) => setForm((prev) => ({ ...prev, consent: e.target.checked }))}
            required
            className="mt-0.5 h-4 w-4 rounded border-[var(--border-medium)] text-[var(--blue-cyan)] focus:ring-[var(--blue-cyan)] cursor-pointer shrink-0"
          />
          <label
            htmlFor="form-consent"
            className="text-xs text-[var(--ink-muted)] leading-relaxed cursor-pointer select-none"
          >
            {t.contactForm.consentText}{' '}
            <Link
              href={getHref('/confidentialite')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--blue-cyan)] font-medium underline underline-offset-2 hover:opacity-80"
            >
              {t.contactForm.privacyLink}
            </Link>{' '}
            {t.contactForm.consentSuffix}{' '}
            <span className="text-[var(--blue-cyan)]">*</span>
          </label>
        </div>
        <p className="text-[11px] text-[var(--ink-faint)] leading-relaxed sm:pl-7">
          {t.contactForm.gdprNotice}
        </p>
      </div>

      {/* 9. Bouton d'envoi & Garanties */}
      <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-v4-primary w-full sm:w-auto inline-flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              <span>{t.contactForm.submitting}</span>
            </>
          ) : (
            <>
              <span>{t.contactForm.submit}</span>
              <span>→</span>
            </>
          )}
        </button>

        <div className="text-xs text-[var(--ink-muted)] flex items-center gap-2">
          <span>🔒</span>
          <span>{t.contactForm.securityBadge}</span>
        </div>
      </div>
    </form>
  )
}

export default ContactForm
