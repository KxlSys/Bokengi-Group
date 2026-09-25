declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SERVER_URL?: string
      VERCEL_PROJECT_PRODUCTION_URL?: string
      ERPNEXT_API_URL?: string
      ERPNEXT_API_KEY?: string
      ERPNEXT_API_SECRET?: string
      CONTACT_EMAIL?: string
      NEXT_PUBLIC_CONTACT_EMAIL?: string
      RESEND_API_KEY?: string
      CONTACT_FROM_EMAIL?: string
      NEXT_PUBLIC_CALCOM_LINK?: string
      NEXT_PUBLIC_CALCOM_ENABLED?: string
      NEXT_PUBLIC_OPENSTATUS_URL?: string
      NEXT_PUBLIC_OPENSTATUS_ENABLED?: string
      NEXT_PUBLIC_UMAMI_WEBSITE_ID?: string
      NEXT_PUBLIC_UMAMI_SRC?: string
      NEXT_PUBLIC_UMAMI_HOST_URL?: string
      NEXT_PUBLIC_UMAMI_ENABLED?: string
    }
  }
}

export {}
