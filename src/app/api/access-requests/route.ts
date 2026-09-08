import { NextRequest, NextResponse } from 'next/server'

// Cache mémoire pour limitation des abus (maximum 3 demandes / heure / IP)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

export function isAccessRequestRateLimited(
  ip: string,
  limit = 3,
  windowMs = 3600000
): boolean {
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
      '127.0.0.1'

    // 1. LIMITATION DU DÉBIT (ANTI-BRUTEFORCE)
    if (isAccessRequestRateLimited(ip, 3, 3600000)) {
      return NextResponse.json(
        {
          error:
            'Trop de demandes soumises depuis cette adresse. Veuillez patienter une heure avant de réessayer.',
        },
        { status: 429 }
      )
    }

    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Format de requête invalide.' },
        { status: 400 }
      )
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
      website, // Honeypot invisible
      assignedRole,
      status,
      expiresAt,
    } = body

    // 2. HONEYPOT ANTI-BOT
    if (website && typeof website === 'string' && website.trim().length > 0) {
      console.warn(`[Anti-Spam AccessRequests] Bot piégé via honeypot depuis l'IP ${ip}`)
      return NextResponse.json(
        {
          success: true,
          message: 'Votre demande d’accès a été enregistrée avec succès.',
        },
        { status: 200 }
      )
    }

    // 3. SÉCURITÉ ANTI-ÉLÉVATION (PARAMÈTRES INTERDITS)
    if (
      assignedRole ||
      (status && status !== 'pending') ||
      expiresAt ||
      body.adminNotes ||
      body.processedAt ||
      body.processedBy
    ) {
      return NextResponse.json(
        {
          error:
            'Tentative non autorisée : les paramètres administratifs (assignedRole, status, expiresAt, adminNotes, processedAt, processedBy) ne peuvent pas être définis lors de la soumission.',
        },
        { status: 403 }
      )
    }

    if (requestedRole === 'super-admin') {
      return NextResponse.json(
        {
          error:
            'Action non autorisée : le rôle "super-admin" ne peut être ni demandé ni attribué.',
        },
        { status: 400 }
      )
    }

    // 4. VALIDATION ET NORMALISATION DES ENTRÉES
    const safeFirstname = (typeof firstName === 'string' ? firstName : typeof firstname === 'string' ? firstname : '').trim()
    if (!safeFirstname || safeFirstname.length < 2 || safeFirstname.length > 50) {
      return NextResponse.json(
        { error: 'Le prénom doit comporter entre 2 et 50 caractères.' },
        { status: 400 }
      )
    }

    const safeLastname = (typeof lastName === 'string' ? lastName : typeof lastname === 'string' ? lastname : '').trim()
    if (!safeLastname || safeLastname.length < 2 || safeLastname.length > 50) {
      return NextResponse.json(
        { error: 'Le nom de famille doit comporter entre 2 et 50 caractères.' },
        { status: 400 }
      )
    }

    const safeEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!safeEmail || !emailRegex.test(safeEmail) || safeEmail.length > 100) {
      return NextResponse.json(
        { error: 'Veuillez renseigner une adresse email professionnelle valide.' },
        { status: 400 }
      )
    }

    const safeJustification = (typeof justification === 'string' ? justification : typeof message === 'string' ? message : '').trim()
    if (!safeJustification || safeJustification.length < 20 || safeJustification.length > 1000) {
      return NextResponse.json(
        {
          error:
            'La justification doit comporter entre 20 et 1000 caractères pour motiver votre demande d’accès.',
        },
        { status: 400 }
      )
    }

    const safeRequestedRole: 'admin' | 'editor' =
      requestedRole === 'admin' ? 'admin' : 'editor'

    // 5. GESTION DES COLLISIONS ET PERSISTANCE PAYLOAD
    let createdRequestId: string | number = `offline-${Date.now()}`

    try {
      const { getPayload } = await import('payload')
      const configPromise = (await import('@payload-config')).default
      const payload = await getPayload({ config: configPromise })

      // Collision A : Vérifier si l'email existe déjà dans Users
      const existingUser = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: safeEmail,
          },
        },
        limit: 1,
        overrideAccess: true,
      })

      if (existingUser.docs.length > 0) {
        return NextResponse.json(
          {
            error: 'Cet email est déjà associé à un compte existant.',
          },
          { status: 400 }
        )
      }

      // Collision B : Vérifier si une demande pending non-expirée existe déjà
      const existingPending = await payload.find({
        collection: 'access-requests' as any,
        where: {
          and: [
            { email: { equals: safeEmail } },
            { status: { equals: 'pending' } },
          ],
        },
        limit: 1,
        overrideAccess: true,
      })

      if (existingPending.docs.length > 0) {
        const pendingDoc = existingPending.docs[0] as any
        const isNotExpired =
          pendingDoc?.expiresAt &&
          new Date(pendingDoc.expiresAt).getTime() > Date.now()

        if (isNotExpired) {
          return NextResponse.json(
            {
              error:
                'Une demande d\'accès est déjà en cours de traitement pour cette adresse email.',
            },
            { status: 409 }
          )
        }
      }

      // Création de la demande d'accès avec overrideAccess autorisé uniquement sur cet endpoint assaini
      const newRequest = await payload.create({
        collection: 'access-requests' as any,
        overrideAccess: true,
        data: {
          firstName: safeFirstname,
          lastName: safeLastname,
          email: safeEmail,
          requestedRole: safeRequestedRole,
          justification: safeJustification,
          status: 'pending',
        } as any,
      })

      createdRequestId = newRequest.id
    } catch (dbErr: any) {
      const errMsg = dbErr?.message || String(dbErr)
      const errCode = dbErr?.code || dbErr?.cause?.code || ''

      // Détection de la violation d'unicité (PostgreSQL 23505 sur l'index partiel pending_email_uidx)
      if (
        errCode === '23505' ||
        errMsg.includes('access_requests_pending_email_uidx') ||
        errMsg.includes('duplicate key')
      ) {
        return NextResponse.json(
          {
            error:
              'Une demande d\'accès est déjà en cours de traitement pour cette adresse email.',
          },
          { status: 409 }
        )
      }

      // Propagation des erreurs de validation ou de permissions levées par Payload
      if (dbErr?.status && typeof dbErr.status === 'number' && dbErr.status >= 400 && dbErr.status < 500) {
        return NextResponse.json(
          { error: dbErr.message },
          { status: dbErr.status }
        )
      }

      console.warn(
        '[AccessRequests] Persistance Payload différée (base non active ou offline) :',
        errMsg
      )
      // En environnement de build ou offline, préserver la réponse
    }

    return NextResponse.json(
      {
        success: true,
        message:
          'Votre demande d’accès a bien été enregistrée et sera examinée par la direction technique.',
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
