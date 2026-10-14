import { NextRequest, NextResponse, after } from 'next/server'
import { telegramConfigured, escapeHtml, sendMessageTo, sendFileTo, sendLogoTo, forEachChat } from '@/lib/telegram'
import { getPaidCheckout, claimCheckout } from '@/lib/payments'
import { EVISA_NAMES, EvisaServiceType } from '@/lib/evisa'

type Doc = { file: File; label: string }

/* Send everything to one chat ID sequentially (logo → msg → files) */
async function sendToChat(chatId: string, message: string, reqId: string, docs: Doc[]) {
  await sendLogoTo(chatId, `🔔 ALGSERV — طلب فيزا إلكترونية جديد #${reqId}`)
  await sendMessageTo(chatId, message)
  for (const doc of docs) {
    await sendFileTo(chatId, doc.file, `📎 ${doc.label} — #${reqId}`)
  }
}

export async function POST(req: NextRequest) {
  if (!telegramConfigured) {
    return NextResponse.json({ error: 'Telegram not configured' }, { status: 500 })
  }

  const fd = await req.formData()

  // Only a paid, not-yet-used E-Visa checkout may deliver an order. What was paid
  // comes from Chargily — the client-sent country/price is display-only.
  const checkout = await getPaidCheckout(fd.get('checkout_id'), s => s in EVISA_NAMES)
  if (!checkout) {
    return NextResponse.json({ error: 'Payment not verified' }, { status: 402 })
  }
  if (!claimCheckout(checkout.id)) {
    return NextResponse.json({ error: 'Order already submitted' }, { status: 409 })
  }
  const paidFor = EVISA_NAMES[checkout.service as EvisaServiceType]

  const field = (k: string) => escapeHtml(fd.get(k))
  const countryName   = field('countryName')
  const processing    = field('processing')
  const price         = field('price')
  const fullName      = field('fullName')
  const phone         = field('phone')
  const email         = field('email')
  const maritalStatus = field('maritalStatusLabel')
  const address       = field('address')
  const notes         = field('notes')

  /* collect uploaded documents with their labels (doc_<key> / doclabel_<key>) */
  const docs: Doc[] = []
  for (const [key, value] of fd.entries()) {
    if (key.startsWith('doc_') && value instanceof File) {
      const label = (fd.get(`doclabel_${key.slice(4)}`) as string) || key.slice(4)
      docs.push({ file: value, label })
    }
  }

  /* unique ID per submission to avoid confusion between simultaneous requests */
  const reqId = Date.now().toString(36).toUpperCase()
  const now   = new Date().toLocaleString('fr-DZ', { timeZone: 'Africa/Algiers' })

  const message = `
🛂 <b>طلب فيزا إلكترونية (E-Visa)</b>  |  #${reqId}
🕒 ${now}
✅ <b>مدفوع:</b> ${escapeHtml(paidFor)} — ${checkout.amount} دج  —  <code>${escapeHtml(checkout.id)}</code>

🌍 <b>الدولة:</b> ${countryName}
⏱ <b>مدة المعالجة:</b> ${processing}
💰 <b>السعر:</b> ${price}

👤 <b>معلومات العميل:</b>
• الاسم واللقب: <b>${fullName}</b>
• الهاتف: ${phone}${email ? `\n• البريد: ${email}` : ''}
• الحالة العائلية: ${maritalStatus}
• العنوان: ${address}${notes ? `\n\n📝 <b>ملاحظات:</b> ${notes}` : ''}

📎 <b>الوثائق المرفقة:</b> ${docs.length}
  `.trim()

  /* ── Return OK immediately — send to Telegram in background ── */
  after(() => forEachChat(id => sendToChat(id, message, reqId, docs)))

  return NextResponse.json({ ok: true })
}
