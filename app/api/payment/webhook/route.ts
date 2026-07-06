import { NextRequest } from 'next/server'
import { verifySignature } from '@chargily/chargily-pay'
import { notifyOrderPaid } from '@/lib/payments'

export async function POST(request: NextRequest) {
  const secret = process.env.CHARGILY_WEBHOOK_SECRET
  if (!secret) {
    console.error('[Webhook] CHARGILY_WEBHOOK_SECRET is not set')
    return new Response('Server misconfiguration', { status: 500 })
  }

  const signature = request.headers.get('signature') || ''
  const rawBody = Buffer.from(await request.arrayBuffer())

  if (!signature) {
    return new Response('Missing signature', { status: 400 })
  }

  try {
    const valid = verifySignature(rawBody, signature, secret)
    if (!valid) {
      return new Response('Forbidden', { status: 403 })
    }
  } catch {
    return new Response('Forbidden', { status: 403 })
  }

  const event = JSON.parse(rawBody.toString())

  if (event.type === 'checkout.paid') {
    const checkout = event.data ?? {}
    const meta = checkout.metadata ?? {}
    await notifyOrderPaid({
      service: meta.service ?? 'unknown',
      clientName: meta.clientName,
      clientPhone: meta.clientPhone,
      clientEmail: meta.clientEmail,
      amount: meta.amount ?? checkout.amount,
      details: meta.details,
    })
  }

  return new Response('OK', { status: 200 })
}
