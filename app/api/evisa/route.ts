import { NextRequest, NextResponse, after } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const CHAT_IDS  = (process.env.TELEGRAM_CHAT_ID ?? '').split(',').map(s => s.trim()).filter(Boolean)
const TG        = `https://api.telegram.org/bot${BOT_TOKEN}`

async function sendMessage(chatId: string, text: string) {
  await fetch(`${TG}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })
}

async function sendFile(chatId: string, file: File, caption: string) {
  const fd = new FormData()
  fd.append('chat_id', chatId)
  fd.append('caption', caption)
  fd.append('document', file)
  await fetch(`${TG}/sendDocument`, { method: 'POST', body: fd })
}

async function sendLogoPhoto(chatId: string, caption: string) {
  try {
    const logoBuffer = readFileSync(join(process.cwd(), 'public', 'algserv-logo.jpg'))
    const logoFile = new File([logoBuffer], 'algserv-logo.jpg', { type: 'image/jpeg' })
    const fd = new FormData()
    fd.append('chat_id', chatId)
    fd.append('caption', caption)
    fd.append('photo', logoFile)
    await fetch(`${TG}/sendPhoto`, { method: 'POST', body: fd })
  } catch {
    // non-critical
  }
}

type Doc = { file: File; label: string }

/* Send everything to one chat ID sequentially (logo → msg → files) */
async function sendToChat(chatId: string, message: string, reqId: string, docs: Doc[]) {
  await sendLogoPhoto(chatId, `🔔 ALGSERV — طلب فيزا إلكترونية جديد #${reqId}`)
  await sendMessage(chatId, message)
  for (const doc of docs) {
    await sendFile(chatId, doc.file, `📎 ${doc.label} — #${reqId}`)
  }
}

export async function POST(req: NextRequest) {
  if (!BOT_TOKEN || CHAT_IDS.length === 0) {
    return NextResponse.json({ error: 'Telegram not configured' }, { status: 500 })
  }

  const fd = await req.formData()

  const countryName   = fd.get('countryName')   as string
  const processing    = fd.get('processing')    as string
  const price         = fd.get('price')         as string
  const fullName      = fd.get('fullName')      as string
  const phone         = fd.get('phone')         as string
  const email         = fd.get('email')         as string
  const maritalStatus = fd.get('maritalStatusLabel') as string
  const address       = fd.get('address')       as string
  const notes         = fd.get('notes')         as string

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
  after(async () => {
    /* all chat IDs in parallel */
    await Promise.all(
      CHAT_IDS.map(id => sendToChat(id, message, reqId, docs))
    )
  })

  return NextResponse.json({ ok: true })
}
