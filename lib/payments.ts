import { sendTelegramMessage } from './telegram'
import { SERVICE_NAMES, ServiceType } from './chargily'

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
    `🧾 Service : <b>${svcName}</b>`,
    info.amount ? `💵 ${info.amount} DZD` : '',
    info.clientName ? `👤 Client : ${info.clientName}` : '',
    info.clientPhone ? `📞 ${info.clientPhone}` : '',
  ].filter(Boolean)

  await sendTelegramMessage(lines.join('\n'))
}

/**
 * Notifies the owner via Telegram that a document was downloaded (free-offer
 * or already-unlocked download click). Fired directly from the download
 * button via /api/notify-download — not tied to a Chargily payment.
 */
export async function notifyDownload(info: Pick<OrderInfo, 'service' | 'clientName' | 'clientPhone'>): Promise<void> {
  const svcName = SERVICE_NAMES[info.service as ServiceType] ?? info.service

  const lines = [
    '📥 <b>Téléchargement — ALGSERV</b>',
    `🧾 Service : <b>${svcName}</b>`,
    info.clientName ? `👤 Client : ${info.clientName}` : '',
    info.clientPhone ? `📞 ${info.clientPhone}` : '',
  ].filter(Boolean)

  await sendTelegramMessage(lines.join('\n'))
}
