export type Locale = 'fr' | 'en'

export interface Dictionary {
  common: {
    backToHome: string
    loading: string
    contactUs: string
    scheduleCall: string
    requestQuote: string
    readMore: string
    discoverMore: string
    allRightsReserved: string
    estimatedResponseTime: string
    hoursWorking: string
  }
  nav: {
    home: string
    group: string
    expertises: string
    projects: string
    news: string
    contact: string
    accessRequest: string
    toggleTheme: string
    toggleLang: string
    language: string
    french: string
    english: string
    openMenu: string
    closeMenu: string
  }
  expertises: {
    it: { name: string; sub: string }
    digital: { name: string; sub: string }
    business: { name: string; sub: string }
    consulting: { name: string; sub: string }
    events: { name: string; sub: string }
  }
  contactForm: {
    title: string
    subtitle: string
    firstname: string
    firstnamePlaceholder: string
    lastname: string
    lastnamePlaceholder: string
    company: string
    companyPlaceholder: string
    email: string
    emailPlaceholder: string
    phone: string
    phonePlaceholder: string
    pole: string
    requestType: string
    types: {
      devis: string
      cadrage: string
      support: string
      partenariat: string
      autre: string
    }
    message: string
    messagePlaceholder: string
    consentText: string
    privacyLink: string
    submit: string
    submitting: string
    successTitle: string
    successDesc: string
    newRequestBtn: string
    estimatedDelay: string
    delayHours: string
  }
  footer: {
    baseline: string
    description: string
    navigationTitle: string
    expertisesTitle: string
    contactTitle: string
    legalTitle: string
    legalNotice: string
    privacyPolicy: string
    securityCharter: string
    clientAccess: string
  }
}
