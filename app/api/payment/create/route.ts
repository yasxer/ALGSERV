import { NextRequest } from 'next/server'
import { chargilyClient, SERVICE_PRICES, SERVICE_NAMES, SERVICE_ROUTES, ServiceType } from '@/lib/chargily'

export async function POST(request: NextRequest) {
  let service: string, locale: string
  let clientName: string, clientEmail: string, clientPhone: string | undefined
  let details: Record<string, unknown> | undefined

  try {
    const body = await request.json()
    service = body.service
    locale = body.locale || 'fr'
    clientName = body.clientName || '—'
    clientEmail = body.clientEmail || '—'
    clientPhone = body.clientPhone
    details = body.details
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!service || !(service in SERVICE_PRICES)) {
    return Response.json({ error: 'Invalid service' }, { status: 400 })
  }

  if (!['ar', 'en', 'fr'].includes(locale)) locale = 'fr'

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const svc = service as ServiceType

  try {
    const checkout = await chargilyClient.createCheckout({
      amount: SERVICE_PRICES[svc],
      currency: 'dzd',
      // On success Chargily redirects to success_url with ?checkout_id=<id>
      // appended. The page proves payment via /api/payment/verify using that id —
      // the redirect alone unlocks nothing. Client details ride in metadata so the
      // webhook can build the Telegram notification (no database involved).
      success_url: `${appUrl}${SERVICE_ROUTES[svc]}`,
      failure_url: `${appUrl}/payment/cancel?service=${svc}`,
      webhook_endpoint: `${appUrl}/api/payment/webhook`,
      description: SERVICE_NAMES[svc],
      locale: locale as 'ar' | 'en' | 'fr',
      metadata: {
        service: svc,
        clientName,
        clientEmail,
        clientPhone: clientPhone ?? null,
        amount: SERVICE_PRICES[svc],
        details: details ?? null,
      },
    })

    return Response.json({
      checkout_url: checkout.checkout_url,
      orderId: checkout.id,
    })
  } catch (error) {
    console.error('[Chargily] Create checkout error:', error)
    return Response.json({ error: 'Payment creation failed' }, { status: 500 })
  }
}
