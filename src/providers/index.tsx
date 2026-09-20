import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { I18nProvider, type Locale } from '@/i18n'

export const Providers: React.FC<{
  children: React.ReactNode
  initialLocale?: Locale
}> = ({ children, initialLocale = 'fr' }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <I18nProvider initialLocale={initialLocale}>{children}</I18nProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
