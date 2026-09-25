import { NextRequest, NextResponse } from 'next/server'

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
    const ip = req.headers.get('cf-connecting-ip')?.trim() || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
    if (isAccessRequestRateLimited(ip, 3, 3600000)) {
      return NextResponse.json({ error: 'Trop de demandes soumises depuis cette adresse. Veuillez patienter une heure avant de réessayer.' }, { status: 429 })
    }

    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Format de requête invalide.' }, { status: 400 })
    }

    const { firstName, lastName, firstname, lastname, email, requestedRole, justification, message, website, assignedRole, status, expiresAt } = body

    if (website && typeof website === 'string' && website.trim().length > 0) {
      console.warn(`[Anti-Spam AccessRequests] Bot piégé via honeypot depuis l'IP ${ip}`)
      return NextResponse.json({ success: true, message: 'Votre demande d\'accès a été enregistrée avec succès.' }, { status: 200 })
    }

    if (assignedRole || (status && status !== 'pending') || expiresAt || body.adminNotes || body.processedAt || body.processedBy) {
      return NextResponse.json({ error: 'Tentative non autorisée.' }, { status: 403 })
    }

    if (requestedRole === 'super-admin') {
      return NextResponse.json({ error: 'Action non autorisée.' }, { status: 400 })
    }

    let createdRequestId: string | number = `erpnext-` + Date.now()
    console.warn('[AccessRequests] Enregistrement temporaire (migration ERPNext en cours).')

    return NextResponse.json({ success: true, message: 'Votre demande d\'accès a bien été enregistrée et sera examinée par la direction technique.', id: createdRequestId }, { status: 201 })
  } catch (err: any) {
    console.error('Erreur inattendue POST /api/access-requests :', err)
    return NextResponse.json({ error: 'Une erreur interne est survenue lors du traitement de votre demande.' }, { status: 500 })
  }
}
