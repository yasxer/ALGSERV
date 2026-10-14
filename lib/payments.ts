import { sendTelegramMessage, escapeHtml } from './telegram'
import { chargilyClient, SERVICE_NAMES, ServiceType } from './chargily'

export interface OrderInfo {
  service: string
  clientName?: string | null
  clientPhone?: string | null
  clientEmail?: string | null
  amount?: number | null
  details?: Record<string, unknown> | null
}

/**
 * Notifies the owner via Telegram that an order was paid.
 *
 * Fired from the Chargily webhook only. Chargily delivers `checkout.paid` once
 * per checkout, so this stays free of duplicates without any store to dedupe
 * against — the client-side /api/payment/verify never notifies.
 */
export async function notifyOrderPaid(info: OrderInfo): Promise<void> {
  const svcName = SERVICE_NAMES[info.service as ServiceType] ?? info.service

  const lines = [
    '💰 <b>Paiement confirmé — ALGSERV</b>',
    `🧾 Service : <b>${escapeHtml(svcName)}</b>`,
    info.amount ? `💵 ${escapeHtml(info.amount)} DZD` : '',
    info.clientName ? `👤 Client : ${escapeHtml(info.clientName)}` : '',
    info.clientPhone ? `📞 ${escapeHtml(info.clientPhone)}` : '',
  ].filter(Boolean)

  await sendTelegramMessage(lines.join('\n'))
}

/**
 * Notifies the owner via Telegram that a document was downloaded (free-offer
 * or already-unlocked download click). Fired directly from the download
 * button via /api/notify-download — not tied to a Chargily payment.
 */
export async function notifyDownload(
  info: Pick<OrderInfo, 'service' | 'clientName' | 'clientPhone'> & { variant?: string | null }
): Promise<void> {
  // The variant (e.g. "CV Simple (Gratuit)") is more precise than the generic
  // service name, which labels every CV "CV Professionnel".
  const svcName = info.variant || (SERVICE_NAMES[info.service as ServiceType] ?? info.service)

  const lines = [
    '📥 <b>Téléchargement — ALGSERV</b>',
    `🧾 Service : <b>${escapeHtml(svcName)}</b>`,
    info.clientName ? `👤 Client : ${escapeHtml(info.clientName)}` : '',
    info.clientPhone ? `📞 ${escapeHtml(info.clientPhone)}` : '',
  ].filter(Boolean)

  await sendTelegramMessage(lines.join('\n'))
}

export interface PaidCheckout {
  id: string
  service: string
  amount: number
}

/**
 * Asks Chargily whether `checkoutId` is paid and, if `accepts` is given, that it
 * was created for an accepted service. Returns null when not paid / unknown.
 */
export async function getPaidCheckout(
  checkoutId: unknown,
  accepts?: (service: string) => boolean,
): Promise<PaidCheckout | null> {
  if (!checkoutId || typeof checkoutId !== 'string') return null
  try {
    const checkout = await chargilyClient.getCheckout(checkoutId)
    const service = String(checkout.metadata?.service ?? '')
    if (checkout.status !== 'paid') return null
    if (accepts && !accepts(service)) return null
    return { id: checkout.id, service, amount: checkout.amount }
  } catch (err) {
    console.error('[payments] getCheckout failed:', err)
    return null
  }
}

// Checkout ids that already delivered their order. In-memory, so best-effort only
// (per server instance) — the checkout id is also printed in every Telegram
// message so a duplicate that slips through is easy to spot.
const usedCheckouts = new Set<string>()

/** Marks a checkout as used; returns false if it was already used. */
export function claimCheckout(checkoutId: string): boolean {
  if (usedCheckouts.has(checkoutId)) return false
  usedCheckouts.add(checkoutId)
  return true
}
