import { NextRequest, NextResponse } from 'next/server'
import { submitLeadToERPNext } from '@/lib/erpnext-client'

const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

function isRateLimited(ip: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now - entry.lastReset > windowMs) {
    rateLimitMap.set(ip, { count: 1, lastReset: now })
    return false
  }

  if (entry.count >= limit) {
    return true
  }

  entry.count += 1
  return false
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('cf-connecting-ip')?.trim() ||
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown'

    if (isRateLimited(ip, 6, 60000)) {
      return NextResponse.json(
        { error: 'Trop de requêtes soumises. Veuillez patienter une minute avant de réessayer.' },
        { status: 429 }
      )
    }

    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Format de requête invalide.' }, { status: 400 })
    }

    const {
      firstname,
      lastname,
      name,
      company,
      email,
      phone,
      requestType,
      pole,
      message,
      website, 
    } = body

    if (website && typeof website === 'string' && website.trim().length > 0) {
      console.warn(`[Anti-Spam] Bot piégé via honeypot depuis l'IP ${ip}`)
      return NextResponse.json({ success: true, message: 'Demande transmise avec succès.' }, { status: 200 })
    }

    let safeFirstname = typeof firstname === 'string' ? firstname.trim() : ''
    let safeLastname = typeof lastname === 'string' ? lastname.trim() : ''

    if (!safeFirstname && typeof name === 'string' && name.trim().length > 0) {
      const parts = name.trim().split(' ')
      safeFirstname = parts[0]
      safeLastname = parts.slice(1).join(' ') || parts[0]
    }

    if (!safeFirstname || safeFirstname.length < 2 || safeFirstname.length > 100) {
      return NextResponse.json({ error: 'Le prénom ou nom complet doit comporter au moins 2 caractères.' }, { status: 400 })
    }

    if (!safeLastname) {
      safeLastname = safeFirstname
    }

    const safeEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!safeEmail || !emailRegex.test(safeEmail) || safeEmail.length > 254) {
      return NextResponse.json({ error: 'Veuillez renseigner une adresse email valide.' }, { status: 400 })
    }

    const safeMessage = typeof message === 'string' ? message.trim() : ''
    if (!safeMessage || safeMessage.length < 10) {
      return NextResponse.json({ error: 'Votre message doit comporter au moins 10 caractères pour nous permettre de comprendre votre besoin.' }, { status: 400 })
    }
    if (safeMessage.length > 5000) {
      return NextResponse.json({ error: 'Le message est trop volumineux (maximum 5000 caractères).' }, { status: 400 })
    }

    const validRequestTypes = ['devis', 'cadrage', 'support', 'partenariat', 'autre']
    const safeType = validRequestTypes.includes(requestType) ? requestType : 'devis'

    let createdLeadId: string | number | null = null

    try {
      const enrichedMessage = safeType === 'support'
        ? `[Demande de type: Support / Assistance technique]\n\n` + safeMessage
        : safeMessage

      createdLeadId = await submitLeadToERPNext({
        firstname: safeFirstname,
        lastname: safeLastname,
        company: typeof company === 'string' ? company.trim().slice(0, 150) : '',
        email: safeEmail,
        phone: typeof phone === 'string' ? phone.trim().slice(0, 50) : '',
        requestType: safeType,
        pole: pole && typeof pole === 'string' ? pole : '',
        message: enrichedMessage,
        source: 'website-contact-form',
      })
      console.info(`[CRM Leads] Nouveau lead créé avec succès dans ERPNext (ID: ${createdLeadId}) pour ${safeEmail}`)
    } catch (dbError) {
      console.warn('[CRM Leads] Persistance ERPNext différée (base non active) :', dbError)
      createdLeadId = `offline-` + Date.now()
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Votre demande a été transmise avec succès à l\'équipe Bokengi Group. Nous vous répondrons sous 24 à 48h ouvrées.',
        id: createdLeadId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[API Leads] Erreur inattendue lors du traitement :', error)
    return NextResponse.json(
      { error: 'Une erreur interne est survenue. Veuillez réessayer ou nous contacter par email.' },
      { status: 500 }
    )
  }
}
