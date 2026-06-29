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

/* Send everything to one chat ID sequentially (logo → msg → files) */
async function sendToChat(chatId: string, message: string, reqId: string, photo: File | null, idCard: File | null, selfie: File | null) {
  await sendLogoPhoto(chatId, `🔔 ALGSERV — طلب جديد #${reqId}`)
  await sendMessage(chatId, message)
  if (photo)  await sendFile(chatId, photo,  `📸 الصورة الشخصية — #${reqId}`)
  if (idCard) await sendFile(chatId, idCard, `🪪 بطاقة التعريف / جواز السفر — #${reqId}`)
  if (selfie) await sendFile(chatId, selfie, `🤳 السيلفي مع البطاقة — #${reqId}`)
}

export async function POST(req: NextRequest) {
  if (!BOT_TOKEN || CHAT_IDS.length === 0) {
    return NextResponse.json({ error: 'Telegram not configured' }, { status: 500 })
  }

  const fd = await req.formData()

  const fullName   = fd.get('fullName')   as string
  const fatherName = fd.get('fatherName') as string
  const motherName = fd.get('motherName') as string
  const dob        = fd.get('dob')        as string
  const pob        = fd.get('pob')        as string
  const wilaya     = fd.get('wilaya')     as string
  const commune    = fd.get('commune')    as string
  const address    = fd.get('address')    as string
  const phone      = fd.get('phone')      as string
  const email      = fd.get('email')      as string
  const activity   = fd.get('activity')   as string

  const photo  = fd.get('photo')  as File | null
  const idCard = fd.get('idCard') as File | null
  const selfie = fd.get('selfie') as File | null

  /* unique ID per submission to avoid confusion between simultaneous requests */
  const reqId = Date.now().toString(36).toUpperCase()
  const now   = new Date().toLocaleString('fr-DZ', { timeZone: 'Africa/Algiers' })

  const message = `
🆕 <b>طلب بطاقة مقاول ذاتي</b>  |  #${reqId}
🕒 ${now}

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
  after(async () => {
    /* all chat IDs in parallel */
    await Promise.all(
      CHAT_IDS.map(id => sendToChat(id, message, reqId, photo, idCard, selfie))
    )
  })

  return NextResponse.json({ ok: true })
}
