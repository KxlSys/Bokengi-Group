import type { Locale, Dictionary } from './types'
import { fr } from './dictionaries/fr'
import { en } from './dictionaries/en'

export const DICTIONARIES: Record<Locale, Dictionary> = { fr, en }

export function getDictionary(locale: Locale = 'fr'): Dictionary {
  return DICTIONARIES[locale] || fr
}
