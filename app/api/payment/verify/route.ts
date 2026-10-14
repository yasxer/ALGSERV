import { NextRequest } from 'next/server'
import { getPaidCheckout } from '@/lib/payments'

/**
 * Server-side proof of payment. The client MUST call this before revealing the
 * paid document — the `?checkout_id=<id>` query param on its own proves nothing.
 *
 * We ask Chargily directly for the checkout status; there is no database. This
 * route never notifies — the webhook owns notifications (see /api/payment/webhook).
 */
export async function POST(request: NextRequest) {
  let orderId: string | undefined
  let service: string | undefined
  try {
    const body = await request.json()
    orderId = body?.orderId
    service = body?.service
  } catch {
    return Response.json({ paid: false, error: 'Invalid request body' }, { status: 400 })
  }

  if (!orderId || typeof orderId !== 'string') {
    return Response.json({ paid: false, error: 'Missing orderId' }, { status: 400 })
  }

  // A paid checkout only unlocks the service it was created for. This blocks
  // replaying a cheap checkout id (e.g. facture, 250 DA) on a pricier page
  // (e.g. cv, 500 DA) via ?checkout_id=<id>.
  const checkout = await getPaidCheckout(orderId, s => !service || s === service)
  return Response.json({ paid: Boolean(checkout) })
}
