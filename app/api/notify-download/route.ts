import { NextRequest } from 'next/server'
import { notifyDownload } from '@/lib/payments'

/**
 * Pings the owner on Telegram the moment a client downloads their document —
 * covers the free-offer flow, which never touches Chargily so the payment
 * webhook never fires.
 */
export async function POST(request: NextRequest) {
  let service: string | undefined
  let variant: string | undefined
  let clientName: string | undefined
  let clientPhone: string | undefined

  try {
    const body = await request.json()
    service = body?.service
    variant = body?.variant
    clientName = body?.clientName
    clientPhone = body?.clientPhone
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!service) {
    return Response.json({ error: 'Missing service' }, { status: 400 })
  }

  await notifyDownload({ service, variant, clientName, clientPhone })

  return Response.json({ ok: true })
}
