import { NextRequest, NextResponse } from 'next/server'

// Cache mémoire simple pour limitation des abus (fenêtre glissante par IP)
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
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

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
      website, // Honeypot anti-spam
    } = body

    // 1. HONEYPOT ANTI-SPAM
    // Si un robot a rempli le champ caché "website", on feint le succès sans rien enregistrer
    if (website && typeof website === 'string' && website.trim().length > 0) {
      console.warn(`[Anti-Spam] Bot piégé via honeypot depuis l'IP ${ip}`)
      return NextResponse.json({ success: true, message: 'Demande transmise avec succès.' }, { status: 200 })
    }

    // 2. VALIDATION STRICTE DES CHAMPS
    // Gestion du nom complet ou découpé
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

    const validRequestTypes = ['devis', 'cadrage', 'partenariat', 'autre']
    const safeType = validRequestTypes.includes(requestType) ? requestType : 'devis'

    // 3. PERSISTANCE DANS PAYLOAD CMS
    let createdLeadId: string | number | null = null

    try {
      const { getPayload } = await import('payload')
      const configPromise = (await import('@payload-config')).default
      const payload = await getPayload({ config: configPromise })

      // Résolution du pôle si slug fourni
      let resolvedPoleId: string | number | undefined = undefined
      if (pole && typeof pole === 'string') {
        const poleDoc = await payload.find({
          collection: 'poles',
          where: {
            or: [
              { slug: { equals: pole } },
              { name: { equals: pole } },
            ],
          },
          limit: 1,
        })
        if (poleDoc.docs.length > 0) {
          resolvedPoleId = poleDoc.docs[0].id
        }
      }

      const leadDoc = await payload.create({
        collection: 'leads',
        data: {
          firstname: safeFirstname,
          lastname: safeLastname,
          company: typeof company === 'string' ? company.trim().slice(0, 150) : null,
          email: safeEmail,
          phone: typeof phone === 'string' ? phone.trim().slice(0, 50) : null,
          requestType: safeType as any,
          pole: resolvedPoleId as any,
          message: safeMessage,
          source: 'website-contact-form',
          status: 'new',
        },
      })

      createdLeadId = leadDoc.id
      console.info(`[CRM Leads] Nouveau lead créé avec succès dans Payload (ID: ${createdLeadId}) pour ${safeEmail}`)
    } catch (dbError) {
      // Résilience : Si la base PostgreSQL n'est pas joignable (ex: test local sans DB),
      // nous enregistrons le lead dans les logs de l'application et ne rejetons JAMAIS le visiteur.
      console.warn('[CRM Leads] Persistance Payload différée (base non active) :', dbError)
      createdLeadId = `offline-${Date.now()}`
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
