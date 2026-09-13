'use client'

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type { Locale, Dictionary } from './types'
import { fr } from './dictionaries/fr'
import { en } from './dictionaries/en'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: Dictionary
}

const DICTIONARIES: Record<Locale, Dictionary> = { fr, en }

const I18nContext = createContext<I18nContextType>({
  locale: 'fr',
  setLocale: () => {},
  toggleLocale: () => {},
  t: fr,
})

export const I18nProvider: React.FC<{ children: React.ReactNode; initialLocale?: Locale }> = ({
  children,
  initialLocale = 'fr',
}) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  useEffect(() => {
    // Lecture de la préférence stockée (localStorage en priorité, puis cookie)
    try {
      const stored = localStorage.getItem('bokengi_locale') as Locale | null
      if (stored === 'fr' || stored === 'en') {
        setLocaleState(stored)
        document.documentElement.lang = stored
        return
      }

      // Lecture du cookie bokengi_locale ou payload-lng
      const match = document.cookie.match(/(?:^|;\s*)(?:bokengi_locale|payload-lng)=([^;]+)/)
      if (match && (match[1] === 'fr' || match[1] === 'en')) {
        const cookieLang = match[1] as Locale
        setLocaleState(cookieLang)
        document.documentElement.lang = cookieLang
      }
    } catch {
      // LocalStorage désactivé ou restreint
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem('bokengi_locale', newLocale)
      document.cookie = `bokengi_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
      document.cookie = `payload-lng=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
      document.documentElement.lang = newLocale
    } catch {
      // Silencieux
    }
  }

  const toggleLocale = () => {
    setLocale(locale === 'fr' ? 'en' : 'fr')
  }

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t: DICTIONARIES[locale] || fr,
    }),
    [locale]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = (): I18nContextType => {
  return useContext(I18nContext)
}
