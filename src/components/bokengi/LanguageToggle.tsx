'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useI18n, type Locale } from '@/i18n'

export interface LanguageToggleProps {
  className?: string
  showLabel?: boolean
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  className = '',
  showLabel = true,
}) => {
  const { locale, setLocale, t } = useI18n()
  const pathname = usePathname()
  const router = useRouter()

  const handleSelectLocale = (targetLocale: Locale) => {
    setLocale(targetLocale)

    if (pathname) {
      const segments = pathname.split('/')
      if (segments[1] === 'fr' || segments[1] === 'en') {
        segments[1] = targetLocale
        const newPath = segments.join('/') || `/${targetLocale}`
        router.push(newPath)
      } else {
        const cleanPath = pathname === '/' ? '' : pathname
        router.push(`/${targetLocale}${cleanPath}`)
      }
    }
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-sans shrink-0 ${className}`.trim()}
      role="group"
      aria-label={`${t.nav.language}: ${locale === 'fr' ? t.nav.french : t.nav.english}`}
    >
      {showLabel && (
        <span
          className="text-[var(--ink-muted)] font-medium text-[11px] uppercase tracking-wider hidden lg:inline select-none"
          aria-hidden="true"
        >
          {t.nav.language} :
        </span>
      )}
      <div className="inline-flex items-center p-0.5 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
        <button
          type="button"
          onClick={() => handleSelectLocale('fr')}
          className={`px-2.5 py-1 min-w-[32px] min-h-[32px] sm:min-h-[34px] rounded-[2px] text-xs transition-all font-semibold cursor-pointer inline-flex items-center justify-center ${
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
          onClick={() => handleSelectLocale('en')}
          className={`px-2.5 py-1 min-w-[32px] min-h-[32px] sm:min-h-[34px] rounded-[2px] text-xs transition-all font-semibold cursor-pointer inline-flex items-center justify-center ${
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
