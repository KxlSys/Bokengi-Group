'use client'

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type { Locale, Dictionary } from './types'
import { fr } from './dictionaries/fr'
import { en } from './dictionaries/en'

export interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  getHref: (path: string) => string
  t: Dictionary
}

import { DICTIONARIES, getDictionary } from './getDictionary'

const I18nContext = createContext<I18nContextType>({
  locale: 'fr',
  setLocale: () => {},
  toggleLocale: () => {},
  getHref: (path: string) => path,
  t: fr,
})

export const I18nProvider: React.FC<{ children: React.ReactNode; initialLocale?: Locale }> = ({
  children,
  initialLocale = 'fr',
}) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  useEffect(() => {
    if (initialLocale) {
      setLocaleState(initialLocale)
      try {
        document.documentElement.lang = initialLocale
      } catch {}
    }
  }, [initialLocale])

  useEffect(() => {
    // Only check stored preferences if initialLocale was not explicitly given
    if (initialLocale && (initialLocale === 'en' || initialLocale === 'fr')) {
      return
    }
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
  }, [initialLocale])

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

  const getHref = (path: string): string => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    if (cleanPath.startsWith('/fr/') || cleanPath === '/fr') {
      return `/${locale}${cleanPath.substring(3)}`
    }
    if (cleanPath.startsWith('/en/') || cleanPath === '/en') {
      return `/${locale}${cleanPath.substring(3)}`
    }
    return `/${locale}${cleanPath === '/' ? '' : cleanPath}`
  }

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      getHref,
      t: DICTIONARIES[locale] || fr,
    }),
    [locale]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = (): I18nContextType => {
  return useContext(I18nContext)
}
