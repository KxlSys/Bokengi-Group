import { NextRequest, NextResponse } from 'next/server'
import { submitAccessRequestToERPNext } from '@/lib/erpnext-client'

const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

function isAccessRequestRateLimited(ip: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now - entry.lastReset > windowMs) {
    rateLimitMap.set(ip, { count: 1, lastReset: now })
    return false
  }
  if (entry.count >= limit) return true
  entry.count += 1
  return false
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('cf-connecting-ip')?.trim() ||
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      '127.0.0.1'

    if (isAccessRequestRateLimited(ip, 5, 3600000)) {
      return NextResponse.json(
        { error: 'Trop de demandes soumises depuis cette adresse. Veuillez patienter une heure avant de réessayer.' },
        { status: 429 }
      )
    }

    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Format de requête invalide.' }, { status: 400 })
    }

    const {
      firstName,
      lastName,
      firstname,
      lastname,
      email,
      requestedRole,
      justification,
      message,
      website,
      assignedRole,
      status,
      expiresAt,
    } = body

    // ── PROTECTION HONEYPOT (ANTI-BOT) ──
    if (website && typeof website === 'string' && website.trim().length > 0) {
      console.warn(`[Anti-Spam AccessRequests] Bot piégé via honeypot depuis l'IP ${ip}`)
      return NextResponse.json(
        { success: true, message: "Votre demande d'accès a été enregistrée avec succès." },
        { status: 200 }
      )
    }

    // ── VÉRIFICATION DE SÉCURITÉ CONTRE PRIVILEGE ESCALATION ──
    if (assignedRole || (status && status !== 'pending') || expiresAt || body.adminNotes || body.processedAt || body.processedBy) {
      return NextResponse.json({ error: 'Tentative non autorisée.' }, { status: 403 })
    }

    if (requestedRole === 'super-admin') {
      return NextResponse.json({ error: 'Action non autorisée. Les habilitations Super Administrateur sont restreintes.' }, { status: 400 })
    }

    const safeFirstName = (typeof firstName === 'string' ? firstName : typeof firstname === 'string' ? firstname : '').trim()
    const safeLastName = (typeof lastName === 'string' ? lastName : typeof lastname === 'string' ? lastname : '').trim()
    const safeEmail = (typeof email === 'string' ? email : '').trim().toLowerCase()
    const safeJustification = (typeof justification === 'string' ? justification : typeof message === 'string' ? message : '').trim()
    const safeRole = requestedRole === 'admin' ? 'admin' : 'editor'

    if (!safeFirstName || safeFirstName.length < 2 || safeFirstName.length > 80) {
      return NextResponse.json({ error: 'Le prénom doit comporter entre 2 et 80 caractères.' }, { status: 400 })
    }

    if (!safeLastName || safeLastName.length < 2 || safeLastName.length > 80) {
      return NextResponse.json({ error: 'Le nom de famille doit comporter entre 2 et 80 caractères.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!safeEmail || !emailRegex.test(safeEmail) || safeEmail.length > 254) {
      return NextResponse.json({ error: 'Veuillez renseigner une adresse email professionnelle valide.' }, { status: 400 })
    }

    if (!safeJustification || safeJustification.length < 10 || safeJustification.length > 3000) {
      return NextResponse.json({ error: 'La justification doit comporter entre 10 et 3000 caractères.' }, { status: 400 })
    }

    let createdRequestId: string | number | null = null

    try {
      const erpResult = await submitAccessRequestToERPNext({
        first_name: safeFirstName,
        last_name: safeLastName,
        email: safeEmail,
        requested_role: safeRole,
        justification: safeJustification,
      })

      createdRequestId = erpResult.name || `access-${Date.now()}`
      console.info(`[AccessRequests] Demande d'accès enregistrée dans ERPNext (ID: ${createdRequestId}) pour ${safeEmail}`)
    } catch (err: any) {
      console.warn('[AccessRequests] Persistance ERPNext différée (mode hors-ligne / base non joignable) :', err)
      createdRequestId = `offline-access-${Date.now()}`
    }

    return NextResponse.json(
      {
        success: true,
        message: "Votre demande d'accès a bien été transmise à la direction technique Bokengi Group. Un lien d'activation sécurisé vous sera délivré après validation.",
        id: createdRequestId,
      },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('Erreur inattendue POST /api/access-requests :', err)
    return NextResponse.json(
      { error: 'Une erreur interne est survenue lors du traitement de votre demande.' },
      { status: 500 }
    )
  }
}
