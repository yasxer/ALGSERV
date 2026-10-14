import { NextRequest, NextResponse, after } from 'next/server'
import { telegramConfigured, escapeHtml, sendMessageTo, sendFileTo, sendLogoTo, forEachChat } from '@/lib/telegram'
import { getPaidCheckout, claimCheckout } from '@/lib/payments'

/* Send everything to one chat ID sequentially (logo → msg → files) */
async function sendToChat(chatId: string, message: string, reqId: string, photo: File | null, idCard: File | null, selfie: File | null) {
  await sendLogoTo(chatId, `🔔 ALGSERV — طلب جديد #${reqId}`)
  await sendMessageTo(chatId, message)
  if (photo)  await sendFileTo(chatId, photo,  `📸 الصورة الشخصية — #${reqId}`)
  if (idCard) await sendFileTo(chatId, idCard, `🪪 بطاقة التعريف / جواز السفر — #${reqId}`)
  if (selfie) await sendFileTo(chatId, selfie, `🤳 السيلفي مع البطاقة — #${reqId}`)
}

const asFile = (v: FormDataEntryValue | null) => (v instanceof File && v.size > 0 ? v : null)

export async function POST(req: NextRequest) {
  if (!telegramConfigured) {
    return NextResponse.json({ error: 'Telegram not configured' }, { status: 500 })
  }

  const fd = await req.formData()

  // Only a paid, not-yet-used Moqawil checkout may deliver an order.
  const checkout = await getPaidCheckout(fd.get('checkout_id'), s => s === 'moqawil-dati')
  if (!checkout) {
    return NextResponse.json({ error: 'Payment not verified' }, { status: 402 })
  }
  if (!claimCheckout(checkout.id)) {
    return NextResponse.json({ error: 'Order already submitted' }, { status: 409 })
  }

  const field = (k: string) => escapeHtml(fd.get(k))
  const fullName   = field('fullName')
  const fatherName = field('fatherName')
  const motherName = field('motherName')
  const dob        = field('dob')
  const pob        = field('pob')
  const wilaya     = field('wilaya')
  const commune    = field('commune')
  const address    = field('address')
  const phone      = field('phone')
  const email      = field('email')
  const activity   = field('activity')

  const photo  = asFile(fd.get('photo'))
  const idCard = asFile(fd.get('idCard'))
  const selfie = asFile(fd.get('selfie'))

  /* unique ID per submission to avoid confusion between simultaneous requests */
  const reqId = Date.now().toString(36).toUpperCase()
  const now   = new Date().toLocaleString('fr-DZ', { timeZone: 'Africa/Algiers' })

  const message = `
🆕 <b>طلب بطاقة مقاول ذاتي</b>  |  #${reqId}
🕒 ${now}
💰 <b>مدفوع:</b> ${checkout.amount} دج  —  <code>${escapeHtml(checkout.id)}</code>

👤 <b>المعلومات الشخصية:</b>
• الاسم الكامل: <b>${fullName}</b>
• اسم الأب: ${fatherName}
• اسم الأم: ${motherName}
• تاريخ الميلاد: ${dob}
• مكان الميلاد: ${pob}

📍 <b>العنوان:</b>
• الولاية: ${wilaya}
• البلدية: ${commune}
• العنوان: ${address}

📞 <b>التواصل:</b>
• الهاتف: ${phone}${email ? `\n• البريد: ${email}` : ''}

💼 <b>النشاط المراد:</b> ${activity}
  `.trim()

  /* ── Return OK immediately — send to Telegram in background ── */
  after(() => forEachChat(id => sendToChat(id, message, reqId, photo, idCard, selfie)))

  return NextResponse.json({ ok: true })
}
