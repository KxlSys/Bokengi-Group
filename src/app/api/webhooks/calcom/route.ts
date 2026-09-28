import { NextRequest, NextResponse } from 'next/server'
import { processCalcomWebhook } from '@/lib/calcom'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()

    if (!rawBody || rawBody.trim().length === 0) {
      return NextResponse.json(
        { error: 'Empty payload received' },
        { status: 400 }
      )
    }

    const signatureHeader =
      req.headers.get('x-cal-signature-256') ||
      req.headers.get('X-Cal-Signature-256') ||
      req.headers.get('x-calcom-signature')

    const result = await processCalcomWebhook(rawBody, signatureHeader)

    return NextResponse.json(
      {
        success: result.success,
        message: result.message,
        bookingUid: result.bookingUid,
        leadId: result.leadId,
        isDuplicate: result.isDuplicate || false,
      },
      { status: result.statusCode }
    )
  } catch (error: any) {
    console.error('[API Webhooks Cal.com] Erreur inattendue :', error)
    return NextResponse.json(
      { error: 'Internal server error processing webhook' },
      { status: 500 }
    )
  }
}
