'use client'

import React from 'react'
import { useI18n } from '@/i18n'

export interface LanguageToggleProps {
  className?: string
  showLabel?: boolean
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  className = '',
  showLabel = true,
}) => {
  const { locale, setLocale, t } = useI18n()

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-sans ${className}`.trim()}
      role="group"
      aria-label={`${t.nav.language}: ${locale === 'fr' ? t.nav.french : t.nav.english}`}
    >
      {showLabel && (
        <span
          className="text-[var(--ink-muted)] font-medium text-[11px] uppercase tracking-wider hidden sm:inline select-none"
          aria-hidden="true"
        >
          {t.nav.language} :
        </span>
      )}
      <div className="inline-flex items-center p-0.5 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
        <button
          type="button"
          onClick={() => setLocale('fr')}
          className={`px-2 py-1 rounded-[2px] text-xs transition-all font-semibold cursor-pointer ${
            locale === 'fr'
              ? 'bg-[var(--blue-primary)] text-white shadow-xs'
              : 'text-[var(--ink-muted)] hover:text-[var(--ink-heading)]'
          }`}
          aria-pressed={locale === 'fr'}
          aria-label={t.nav.french}
          title={t.nav.french}
        >
          {t.nav.french}
        </button>

        <button
          type="button"
          onClick={() => setLocale('en')}
          className={`px-2 py-1 rounded-[2px] text-xs transition-all font-semibold cursor-pointer ${
            locale === 'en'
              ? 'bg-[var(--blue-primary)] text-white shadow-xs'
              : 'text-[var(--ink-muted)] hover:text-[var(--ink-heading)]'
          }`}
          aria-pressed={locale === 'en'}
          aria-label={t.nav.english}
          title={t.nav.english}
        >
          {t.nav.english}
        </button>
      </div>
    </div>
  )
}

export default LanguageToggle
