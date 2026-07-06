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
  const detailLines = info.details
    ? Object.entries(info.details).map(([k, v]) => `• ${k}: ${String(v)}`)
    : []

  const lines = [
    '💰 <b>Paiement confirmé — ALGSERV</b>',
    `🧾 Service : <b>${svcName}</b>`,
    info.clientName ? `👤 Client : ${info.clientName}` : '',
    info.clientPhone ? `📞 ${info.clientPhone}` : '',
    info.clientEmail && info.clientEmail !== '—' ? `✉ ${info.clientEmail}` : '',
    info.amount ? `💵 ${info.amount} DZD` : '',
    ...detailLines,
  ].filter(Boolean)

  await sendTelegramMessage(lines.join('\n'))
}
